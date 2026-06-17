import { useCallback, useRef } from "react";
import configs from "@/config/config";

/**
 * Custom hook for streaming LLM output via Server-Sent Events (SSE).
 *
 * Usage:
 *   const { streamResponse, abortStream } = useStreamingLLM();
 *
 *   await streamResponse({
 *     prompt: "Hello",
 *     history: [{prompt: "hi", output: "hello"}],
 *     model: "google/gemma-4-26B-A4B-it",
 *     onToken: (token) => { ... },        // called for each streamed token
 *     onDone: (fullText) => { ... },       // called when stream completes
 *     onError: (errorMsg) => { ... },      // called on error
 *   });
 */
export default function useStreamingLLM() {
  const abortControllerRef = useRef(null);

  const streamResponse = useCallback(
    async ({ prompt, history = [], model, onToken, onDone, onError }) => {
      // Abort any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const streamUrl = `${configs.BASE_URL_AUTO}/functions/chat_output_stream`;
      let fullText = "";

      try {
        const response = await fetch(streamUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: prompt,
            history: history,
            model: model,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Stream request failed with status ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE format: each event is "data: ...\n\n"
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // keep incomplete line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const dataStr = trimmed.slice(6); // remove "data: " prefix

            // Check for stream completion
            if (dataStr === "[DONE]") {
              if (onDone) onDone(fullText);
              return fullText;
            }

            try {
              const parsed = JSON.parse(dataStr);

              if (parsed.error) {
                if (onError) onError(parsed.error);
                return null;
              }

              if (parsed.token !== undefined) {
                fullText += parsed.token;
                if (onToken) onToken(parsed.token, fullText);
              }
            } catch (parseErr) {
              // Skip malformed JSON lines
              console.warn("Failed to parse SSE data:", dataStr);
            }
          }
        }

        // If stream ended without [DONE], still call onDone
        if (fullText && onDone) {
          onDone(fullText);
        }
        return fullText;
      } catch (err) {
        if (err.name === "AbortError") {
          // Stream was intentionally aborted
          return null;
        }
        if (onError) onError(err.message);
        return null;
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [],
  );

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return { streamResponse, abortStream };
}
