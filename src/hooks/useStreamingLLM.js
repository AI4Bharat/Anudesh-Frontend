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
 *     onDone: (fullText, finishReason) => { ... }, // called when stream completes; finishReason is "stop", "length", or null
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
        const token = localStorage.getItem("anudesh_access_token");
        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `JWT ${token}`;
        }

        const response = await fetch(streamUrl, {
          method: "POST",
          headers: headers,
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

            // Legacy stream completion (plain text sentinel)
            if (dataStr === "[DONE]") {
              if (onDone) onDone(fullText, null);
              return fullText;
            }

            try {
              const parsed = JSON.parse(dataStr);

              // JSON stream completion with finish_reason
              if (parsed.done) {
                if (onDone) onDone(fullText, parsed.finish_reason || null);
                return fullText;
              }

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
          onDone(fullText, null);
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

  /**
   * Stream responses from multiple LLM models concurrently.
   *
   * @param {Object} options
   * @param {string} options.prompt - The user prompt
   * @param {Array} options.modelInteractions - The model_interactions array from annotation result
   * @param {Array} options.models - List of model names to stream from
   * @param {Object} options.systemPromptData - Per-model system prompts (optional)
   * @param {Function} options.onToken - Called with (modelName, token, fullTextForModel)
   * @param {Function} options.onModelDone - Called with (modelName, fullTextForModel, finishReason) when a model finishes
   * @param {Function} options.onDone - Called with ({modelName: fullText, ...}) when all models finish
   * @param {Function} options.onError - Called with (errorMsg) on error
   */
  const streamMultiModelResponse = useCallback(
    async ({ prompt, modelInteractions = [], models = [], systemPromptData = {}, onToken, onModelDone, onDone, onError }) => {
      // Abort any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const streamUrl = `${configs.BASE_URL_AUTO}/functions/chat_output_stream_multi`;
      const modelTexts = {}; // Track accumulated text per model
      models.forEach((m) => { modelTexts[m] = ""; });

      try {
        const token = localStorage.getItem("anudesh_access_token");
        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `JWT ${token}`;
        }

        const response = await fetch(streamUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            message: prompt,
            model_interactions: modelInteractions,
            models: models,
            system_prompt_data: systemPromptData,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Multi-model stream request failed with status ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const dataStr = trimmed.slice(6);

            // Legacy plain text sentinel
            if (dataStr === "[DONE]") {
              if (onDone) onDone(modelTexts);
              return modelTexts;
            }

            try {
              const parsed = JSON.parse(dataStr);

              // Global done (all models finished)
              if (parsed.done && !parsed.model) {
                if (onDone) onDone(modelTexts);
                return modelTexts;
              }

              if (parsed.error && !parsed.model) {
                // Global error
                if (onError) onError(parsed.error);
                return null;
              }

              if (parsed.error && parsed.model) {
                // Per-model error
                modelTexts[parsed.model] = `[ERROR] ${parsed.error}`;
                if (onToken) onToken(parsed.model, `[ERROR] ${parsed.error}`, modelTexts[parsed.model]);
                continue;
              }

              if (parsed.done && parsed.model) {
                // A single model finished — includes finish_reason
                if (onModelDone) onModelDone(parsed.model, modelTexts[parsed.model] || "", parsed.finish_reason || null);
                continue;
              }

              if (parsed.token !== undefined && parsed.model) {
                modelTexts[parsed.model] = (modelTexts[parsed.model] || "") + parsed.token;
                if (onToken) onToken(parsed.model, parsed.token, modelTexts[parsed.model]);
              }
            } catch (parseErr) {
              console.warn("Failed to parse multi-model SSE data:", dataStr);
            }
          }
        }

        // Stream ended without [DONE]
        if (onDone) onDone(modelTexts);
        return modelTexts;
      } catch (err) {
        if (err.name === "AbortError") return null;
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

  return { streamResponse, streamMultiModelResponse, abortStream };
}
