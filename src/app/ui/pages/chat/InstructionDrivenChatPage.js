"use client";
import "./chat.css";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnnotationsTask } from "@/Lib/Features/projects/getAnnotationsTask";
import headerStyle from "@/styles/Header";
import ReactMarkdown from "react-markdown";
import linkifyText from "@/utils/linkifyText";
import { useParams } from "react-router-dom";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import CustomizedSnackbars from "@/components/common/Snackbar";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import PatchAnnotationAPI from "@/app/actions/api/Dashboard/PatchAnnotations";
import useStreamingLLM from "@/hooks/useStreamingLLM";
import ChatLang from "@/utils/Chatlang";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import configs from "@/config/config";
import LanguageCode from "@/utils/LanguageCode";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Slider from '@mui/material/Slider';
const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: "1rem !important",
  },
}));

const orange = {
  200: "pink",
  400: "#EE6633",
  600: "#EE663366",
};

const grey = {
  50: "#F3F6F9",
  200: "#DAE2ED",
  300: "#C7D0DD",
  700: "#434D5B",
  900: "#1C2025",
};

const codeStyle = {
  borderRadius: "0xp 0px 5px 5px",
  width: "45vw",
  overflowX: "scroll",
  fontSize: "1.1rem",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

// Font size slider component 
const FontSizeSlider = memo(({ value, containerRef, onCommit, onReset }) => {
  const [localValue, setLocalValue] = useState(value);
  const rafRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleChange = useCallback((_e, newVal) => {
    setLocalValue(newVal);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--chat-font-size', `${newVal}rem`);
      }
    });
  }, [containerRef]);

  const handleCommit = useCallback((_e, newVal) => {
    onCommit(newVal);
  }, [onCommit]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: "0.5rem",
        pb: "0.5rem",
        flexShrink: 0,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography sx={{ fontSize: "0.7rem", color: "#888", whiteSpace: "nowrap" }}>
        Aa
      </Typography>
      <Slider
        value={localValue}
        min={0.7}
        max={1.4}
        step={0.05}
        onChange={handleChange}
        onChangeCommitted={handleCommit}
        size="small"
        sx={{
          color: "#EE6633",
          width: "100%",
          minWidth: 0,
          "& .MuiSlider-thumb": { width: 12, height: 12 },
        }}
      />
      <Typography sx={{ fontSize: "0.7rem", color: "#888", whiteSpace: "nowrap" }}>
        {Math.round(localValue * 16)}px
      </Typography>
      <Tooltip title={<span style={{ fontFamily: "Roboto, sans-serif" }}>Reset font size</span>}>
        <IconButton
          size="small"
          onClick={onReset}
          sx={{ padding: "4px", minWidth: "auto", marginLeft: "4px" }}
        >
          <RestartAltIcon style={{ fontSize: "1rem", color: "#EE6633" }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
});

const isErrorOutput = (value) => {
  if (typeof value !== "string") return false;
  const lower = value.toLowerCase().trim();
  return (
    lower.startsWith("[error]") ||
    lower.startsWith("the model is temporarily unavailable") ||
    lower.startsWith("encountered an error") ||
    lower.startsWith("streaming timed out") ||
    lower.startsWith("failed to generate a response")
  );
};

const InstructionDrivenChatPage = ({
  chatHistory,
  setChatHistory,
  handleClick,
  formatResponse,
  formatPrompt,
  id,
  stage,
  notes,
  info,
  disableUpdateButton,
  annotation,
  setLoading,
  loading,
  setIsModelStreaming,
  fontSize: initialFontSize = 1.0,
}) => {
  const [fontSize, setFontSize] = useState(
    typeof initialFontSize === 'number' ? initialFontSize : 1.0
  );
  const [isPinned, setIsPinned] = useState(false);

  const getFontSize = () => 'var(--chat-font-size)';
  const [pendingResendPrompt, setPendingResendPrompt] = useState(null);
  const tooltipStyle = useStyles();
  const [inputValue, setInputValue] = useState("");
  const classes = headerStyle();
  const { taskId } = useParams();
  const dispatch = useDispatch();



  const [annotationId, setAnnotationId] = useState();
  const [shrinkedMessages, setShrinkedMessages] = useState({});
  const [isInstructionExpanded, setIsInstructionExpanded] = useState(true);

  const bottomRef = useRef(null);
  const hasRecoveredInProgressChat = useRef(false);
  const isSendInFlightRef = useRef(false);
  const chatHistoryRef = useRef(chatHistory);
  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);
  const [hasMounted, setHasMounted] = useState(false);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [open, setOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);

  useEffect(() => {
    if (pendingResendPrompt && !isStreaming && chatHistory !== null) {
      const prompt = pendingResendPrompt;
      setPendingResendPrompt(null);
      setTimeout(() => {
        handleButtonClick(prompt);
      }, 500);
    }
  }, [pendingResendPrompt, chatHistory]);

  useEffect(() => {
    let intervalId;
    if (isPolling) {
      intervalId = setInterval(() => {
        dispatch(fetchAnnotationsTask(taskId));
        setPollingCount((prev) => prev + 1);
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling, taskId, dispatch]);

  useEffect(() => {
    if (pollingCount > 6) {
      setIsPolling(false);
      setIsStreaming(false);
      setPollingCount(0);

      setSnackbarInfo({
        open: true,
        message: "Streaming timed out. Please refresh the page.",
        variant: "error",
      });
    }
  }, [pollingCount, taskId]);

  useEffect(() => {
    if (setIsModelStreaming) {
      setIsModelStreaming(isStreaming);
    }
  }, [isStreaming, setIsModelStreaming]);

  const [loadtime, setloadtime] = useState(new Date());
  const load_time = useRef();
  const { streamResponse, abortStream } = useStreamingLLM();

  // Abort any in-flight stream when the page unmounts (e.g. browser back).
  // Otherwise the detached stream keeps running, completes in the background,
  // and its completion handler removes the `in_progress_chat_single_${taskId}`
  // recovery key (and PATCHes the server). Returning before the server refetch
  // would then find no recovery breadcrumb, so the prompt vanishes until a
  // manual refresh. Aborting keeps the breadcrumb so recovery can restore it.
  useEffect(() => {
    return () => {
      abortStream();
    };
  }, [abortStream]);

  const [instructionWidth, setInstructionWidth] = useState(30);
  const containerRef = useRef(null);
  const instructionPanelRef = useRef(null);
  const widthRef = useRef(30);
  const isDraggingRef = useRef(false);

  const saveAnnotationUIPref = useCallback((newPrefs) => {
    try {
      const localPrefs = localStorage.getItem("annotation_ui_preferences");
      let prefs = {};
      if (localPrefs) {
        prefs = JSON.parse(localPrefs);
      }
      prefs = { ...prefs, ...newPrefs };
      localStorage.setItem("annotation_ui_preferences", JSON.stringify(prefs));
    } catch (err) {
      console.error('Failed to save local annotation UI preferences', err);
    }
  }, []);

  // Drag handler functions 
  const onDrag = useCallback((e) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const dragX = e.clientX;
    const containerLeft = containerRect.left;
    const containerWidth = containerRect.width;

    const percentage = ((dragX - containerLeft) / containerWidth) * 100;
    const newWidth = Math.min(60, Math.max(20, percentage));

    widthRef.current = newWidth;
    if (instructionPanelRef.current) {
      instructionPanelRef.current.style.width = `${newWidth}%`;
    }
  }, []);

  const stopDragging = useCallback(() => {
    isDraggingRef.current = false;

    if (instructionPanelRef.current) {
      instructionPanelRef.current.style.transition = 'all 0.3s ease';
      instructionPanelRef.current.style.removeProperty('width');
    }

    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDragging);

    const roundedWidth = Math.round(widthRef.current * 10) / 10;
    setInstructionWidth(roundedWidth);
    saveAnnotationUIPref({
      instruction_panel_width: roundedWidth
    });
  }, [onDrag, saveAnnotationUIPref]);

  const startDragging = useCallback((e) => {
    e.preventDefault();
    isDraggingRef.current = true;

    if (instructionPanelRef.current) {
      instructionPanelRef.current.style.transition = 'none';
    }

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDragging);
  }, [onDrag, stopDragging]);

  const handlePinToggle = useCallback(() => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    saveAnnotationUIPref({
      instruction_panel_pinned: newPinned,
      instruction_panel_width: Math.round(instructionWidth * 10) / 10,
    });
  }, [isPinned, instructionWidth, saveAnnotationUIPref]);


  const handleResetFontSize = useCallback((e) => {
    if (e) e.stopPropagation();
    setFontSize(1.0);
    saveAnnotationUIPref({ annotation_font_size: 1.0 });
  }, [saveAnnotationUIPref]);

  const handleResetPanelWidth = useCallback((e) => {
    if (e) e.stopPropagation();
    setInstructionWidth(30);
    setIsPinned(false);
    saveAnnotationUIPref({
      instruction_panel_width: 30,
      instruction_panel_pinned: false
    });
  }, [saveAnnotationUIPref]);

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);

  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);

  // Sync annotation UI preferences from localStorage on mount
  useEffect(() => {
    const localPrefs = localStorage.getItem("annotation_ui_preferences");
    if (localPrefs) {
      try {
        const prefs = JSON.parse(localPrefs);
        if (typeof prefs.instruction_panel_width === 'number') {
          setInstructionWidth(prefs.instruction_panel_width);
        }
        if (typeof prefs.annotation_font_size === 'number') {
          setFontSize(prefs.annotation_font_size);
        }
        if (typeof prefs.instruction_panel_pinned === 'boolean') {
          setIsPinned(prefs.instruction_panel_pinned);
        }
      } catch (err) {
        console.error('Failed to parse local annotation UI preferences', err);
      }
    }
  }, []);

  useEffect(() => {
    widthRef.current = instructionWidth;
  }, [instructionWidth]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--chat-font-size', `${fontSize}rem`);
    }
  }, [fontSize]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setSnackbarInfo({
        open: true,
        message: "Copied to clipboard!",
        variant: "success",
      });
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Failed to copy to clipboard!",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (!taskId) return;
    let modifiedChatHistory = [];
    if (
      annotation &&
      Array.isArray(annotation[0]?.result) &&
      annotation[0]?.result.length > 0
    ) {
      modifiedChatHistory = annotation[0]?.result.map((interaction, index) => {
        return {
          ...interaction,
          output: formatResponse(interaction.output),
        };
      });
    }


    if (!hasRecoveredInProgressChat.current && annotation && annotation.length > 0) {
      hasRecoveredInProgressChat.current = true;

      const localInProgress = localStorage.getItem(`in_progress_chat_single_${taskId}`);
      if (localInProgress) {
        try {
          const parsedLocal = JSON.parse(localInProgress);
          const lastLocalPrompt = parsedLocal[parsedLocal.length - 1]?.prompt;

          // Check if server has this prompt WITH a real non-empty response
          const serverTurnWithValidResponse = modifiedChatHistory.find(
            (c) =>
              c.prompt === lastLocalPrompt &&
              c.output &&
              c.output.length > 0 &&
              c.output[0]?.value &&
              c.output[0].value.trim() !== ""
          );

          if (!serverTurnWithValidResponse) {
            const lastPromptToResend = lastLocalPrompt;

            // Drop the in-progress last turn (its response never finished streaming)
            // so the resend below re-appends it once, instead of rendering the prompt
            // twice — once as an empty-response placeholder and again as the streamed
            // resend.
            const priorTurns = Array.isArray(parsedLocal) ? parsedLocal.slice(0, -1) : [];
            modifiedChatHistory = priorTurns;
            setChatHistory(priorTurns);

            setIsStreaming(false);
            setIsPolling(false);
            localStorage.removeItem(`in_progress_chat_single_${taskId}`);
            setPendingResendPrompt(lastPromptToResend);
          } else {
            localStorage.removeItem(`in_progress_chat_single_${taskId}`);
            setIsStreaming(false);
            setIsPolling(false);
            setPollingCount(0);
          }
        } catch (e) {
          console.error(e);
          localStorage.removeItem(`in_progress_chat_single_${taskId}`);
        }
      }
    }

    const hasLocalError = chatHistoryRef.current && chatHistoryRef.current.length > 0 && (
      typeof chatHistoryRef.current[chatHistoryRef.current.length - 1]?.output === "string"
        ? isErrorOutput(chatHistoryRef.current[chatHistoryRef.current.length - 1].output)
        : (Array.isArray(chatHistoryRef.current[chatHistoryRef.current.length - 1]?.output) &&
          isErrorOutput(chatHistoryRef.current[chatHistoryRef.current.length - 1].output.map(seg => seg.value || "").join("")))
    );

    if (!isSendInFlightRef.current && !pendingResendPrompt && !hasLocalError) {
      setChatHistory(modifiedChatHistory);
      setShowChatContainer(!!annotation[0]?.result);
    }
    setAnnotationId(annotation[0]?.id);
  }, [annotation, taskId, pendingResendPrompt]);

  const cleanMetaInfo = (value) =>
    value.replace(/\(for example:.*?\)/gi, "").trim();

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const formatTextWithTooltips = (text, info) => {
    text = String(text);

    const metaInfoIntent = cleanMetaInfo(String(info.meta_info_intent));
    const metaInfoLanguage = cleanMetaInfo(String(info.meta_info_language));
    const metaInfoDomain = cleanMetaInfo(String(info.meta_info_domain));

    let formattedText = text;

    const placeholders = [
      {
        key: "meta_info_intent",
        value: metaInfoIntent,
        tooltip: "Intent of the instruction",
      },
      {
        key: "meta_info_language",
        value: metaInfoLanguage,
        tooltip: "Language used",
      },
      {
        key: "meta_info_domain",
        value: metaInfoDomain,
        tooltip: "Domain of the content",
      },
    ];

    placeholders.forEach(({ value, tooltip }) => {
      if (value !== "None") {
        const escapedValue = escapeRegExp(value);
        const regex = new RegExp(`(${escapedValue})`, "gi");
        text = text.replace(regex, (match) => {
          return `<Tooltip title="${tooltip}"><strong>${match}</strong></Tooltip>`;
        });
      }
    });

    return text;
  };
  const formattedText = formatTextWithTooltips(info.instruction_data, info);

  const handleButtonClick = async (promptOverride, retry = false) => {
    const prompt = promptOverride ?? inputValue;
    if (prompt) {
      isSendInFlightRef.current = true;
      setChatLoading(true);
      setIsStreaming(true);

      const currentPrompt = prompt;
      // Add optimistic entry with a streaming placeholder
      setChatHistory((prev) => {
        let updated;
        if (retry) {
          updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              output: [{ type: "text", value: "" }],
            };
          }
        } else {
          if (prev.length > 0 && prev[prev.length - 1]?.prompt === currentPrompt) {
            updated = [...prev];
            updated[updated.length - 1] = { prompt: currentPrompt, output: [{ type: "text", value: "" }] };
          } else {
            updated = [...prev, { prompt: currentPrompt, output: [{ type: "text", value: "" }] }];
          }
        }
        localStorage.setItem(`in_progress_chat_single_${taskId}`, JSON.stringify(updated));
        return updated;
      });

      setShowChatContainer(true);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      const isBlankResponse = !!ProjectDetails?.metadata_json?.blank_response;

      if (isBlankResponse) {
        const previousHistory = chatHistoryRef.current.map((chat) => ({
          prompt: chat.prompt,
          output: typeof chat.output === "string"
            ? chat.output
            : chat.output?.map?.((seg) => seg.value || "").join("") || "",
        }));

        const fullHistoryPayload = [
          ...previousHistory,
          {
            prompt: currentPrompt,
            output: "",
          }
        ];

        const body = {
          result: fullHistoryPayload,
          retry,
          lead_time:
            (new Date() - loadtime) / 1000 +
            Number(id?.lead_time?.lead_time ?? 0),
          auto_save: true,
          task_id: taskId,
        };
        if (stage === "Alltask") {
          body.annotation_status = id?.annotation_status;
        } else {
          body.annotation_status = localStorage.getItem("labellingMode");
        }
        if (stage === "Review") {
          body.review_notes = JSON.stringify(
            notes?.current?.getEditor().getContents(),
          );
        } else if (stage === "SuperChecker") {
          body.superchecker_notes = JSON.stringify(
            notes?.current?.getEditor().getContents(),
          );
        } else {
          body.annotation_notes = JSON.stringify(
            notes?.current?.getEditor().getContents(),
          );
        }
        if (stage === "Review" || stage === "SuperChecker") {
          body.parentannotation = id?.parent_annotation;
        }

        try {
          const AnnotationObj = new PatchAnnotationAPI(id?.id, body);
          const res = await fetch(AnnotationObj.apiEndPoint(), {
            method: "PATCH",
            body: JSON.stringify(AnnotationObj.getBody()),
            headers: AnnotationObj.getHeaders().headers,
          });
          const data = await res.json();

          if (data && data.result) {
            const modifiedChatHistory = data.result.map((interaction, index) => {
              const isLastInteraction = index === data.result.length - 1;
              return {
                ...interaction,
                output: formatResponse(interaction.output, isLastInteraction),
              };
            });
            setChatHistory([...modifiedChatHistory]);
            localStorage.removeItem(`in_progress_chat_single_${taskId}`);
          }
        } catch (error) {
          console.error("Error saving blank response:", error);
        } finally {
          setChatLoading(false);
          setIsStreaming(false);
          isSendInFlightRef.current = false;
          setIsPolling(false);
          setPollingCount(0);
        }
        return;
      }

      // Build the history for the streaming endpoint (previous turns only)
      const streamHistory = chatHistoryRef.current
        .map((chat) => ({
          prompt: chat.prompt,
          output: typeof chat.output === "string"
            ? chat.output
            : chat.output?.map?.((seg) => seg.value || "").join("") || "",
        }))
        // Filter out any previous turns that had an empty output (e.g. interrupted ones)
        // because passing empty outputs to the LLM backend causes generation to crash
        .filter((chat) => chat.output.trim() !== "");

      const taskData = JSON.parse(localStorage.getItem("TaskData") || "{}");
      const model = taskData?.data?.model || "google/gemma-4-26B-A4B-it";

      const streamPromise = streamResponse({
        prompt: currentPrompt,
        history: streamHistory,
        model: model,
        onToken: (token, fullText) => {
          setIsPolling(false);
          setPollingCount(0);
          setChatHistory((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (lastIdx >= 0) {
              updated[lastIdx] = {
                ...updated[lastIdx],
                output: [{ type: "text", value: fullText }],
              };
            }

            localStorage.setItem(`in_progress_chat_single_${taskId}`, JSON.stringify(updated));
            return updated;
          });
          // Auto-scroll as tokens arrive (use auto instead of smooth to prevent animation cancellation stutter)
          bottomRef.current?.scrollIntoView({ behavior: "auto" });
        },
        onError: (errMsg) => {
          console.error("Streaming error:", errMsg);
          setSnackbarInfo({
            open: true,
            message: `Streaming error: ${errMsg}`,
            variant: "error",
          });
          setChatHistory((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (lastIdx >= 0) {
              updated[lastIdx] = {
                ...updated[lastIdx],
                output: [{ type: "text", value: `[ERROR] ${errMsg}` }],
              };
            }
            return updated;
          });
          setChatLoading(false);
          setIsStreaming(false);
        },
      });

      const body = {
        result: currentPrompt,
        retry,
        lead_time:
          (new Date() - loadtime) / 1000 +
          Number(id?.lead_time?.lead_time ?? 0),
        auto_save: true,
        task_id: taskId,
      };
      if (stage === "Alltask") {
        body.annotation_status = id?.annotation_status;
      } else {
        body.annotation_status = localStorage.getItem("labellingMode");
      }
      if (stage === "Review") {
        body.review_notes = JSON.stringify(
          notes?.current?.getEditor().getContents(),
        );
      } else if (stage === "SuperChecker") {
        body.superchecker_notes = JSON.stringify(
          notes?.current?.getEditor().getContents(),
        );
      } else {
        body.annotation_notes = JSON.stringify(
          notes?.current?.getEditor().getContents(),
        );
      }
      if (stage === "Review" || stage === "SuperChecker") {
        body.parentannotation = id?.parent_annotation;
      }

      try {
        const streamedText = await streamPromise;

        if (streamedText) {
          // Construct the full history array for the backend so it doesn't re-trigger LLM generation
          const previousHistory = chatHistoryRef.current.slice(0, -1).map((chat) => ({
            prompt: chat.prompt,
            output: typeof chat.output === "string"
              ? chat.output
              : chat.output?.map?.((seg) => seg.value || "").join("") || "",
          }));

          const fullHistoryPayload = [
            ...previousHistory,
            {
              prompt: currentPrompt,
              output: streamedText,
            }
          ];
          body.result = fullHistoryPayload;

          const AnnotationObj = new PatchAnnotationAPI(id?.id, body);
          const res = await fetch(AnnotationObj.apiEndPoint(), {
            method: "PATCH",
            body: JSON.stringify(AnnotationObj.getBody()),
            headers: AnnotationObj.getHeaders().headers,
          });
          const data = await res.json();

          if (data && data.result) {
            const modifiedChatHistory = data.result.map((interaction, index) => {
              const isLastInteraction = index === data.result.length - 1;
              return {
                ...interaction,
                output: formatResponse(interaction.output, isLastInteraction),
              };
            });
            setChatHistory([...modifiedChatHistory]);
            // Only clear localStorage after server confirms successful save
            localStorage.removeItem(`in_progress_chat_single_${taskId}`);
          } else if (!data) {
            setSnackbarInfo({
              open: true,
              message: data?.message || "Failed to save LLM response",
              variant: "error",
            });
            localStorage.removeItem(`in_progress_chat_single_${taskId}`);
          }
        }
      } catch (error) {
        console.error("Error in chat save/stream operation:", error);
      } finally {
        setChatLoading(false);
        setIsStreaming(false);
        isSendInFlightRef.current = false;
        setIsPolling(false);
        setPollingCount(0);
      }

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    } else {
      setSnackbarInfo({
        open: true,
        message: "Please provide a prompt",
        variant: "error",
      });
    }
    if (!promptOverride) {
      setText("");
    }
  };

  const handleOnchange = (prompt) => {
    setInputValue(prompt);
  };
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [globalTransliteration, setGlobalTransliteration] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);


  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const storedGlobalTransliteration = localStorage.getItem(
        "globalTransliteration",
      );
      const storedLanguage = localStorage.getItem("language");

      if (storedGlobalTransliteration !== null) {
        setGlobalTransliteration(storedGlobalTransliteration);
      }

      if (storedLanguage !== null) {
        setTargetLang(storedLanguage);
      }
      // const lc = LanguageCode.languages.find(
      //   (lang) => lang.label.toLowerCase() === ProjectDetails?.tgt_language?.toLowerCase()
      // );

      // if (Number(info.meta_info_language) < 3){
      //   setTargetLang(lc.code);
      // }else{
      //   setTargetLang("en");
      // }
    }
  }, [info]);  // Dependency on info - runs on mount and when info changes

  useEffect(() => {
    // This effect runs when chatHistory changes
    if (chatHistory && chatHistory.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (text !== "") {
      handleOnchange(text);
    }
  }, [text]);

  const handleMouseEnter = (event) => {
    event.target.style.borderColor = orange[400];
  };

  const handleMouseLeave = (event) => {
    event.target.style.borderColor = grey[200];
  };

  const handleFocus = (event) => {
    event.target.style.outline = "0px";
    event.target.style.borderColor = orange[400];
    event.target.style.boxShadow = `0 0 0 3px ${orange[200]}`;
  };

  const handleBlur = (event) => {
    event.target.style.boxShadow = `0px 2px 2px ${grey[50]}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleButtonClick();
      setText("");
    } else if (event.key === "Enter" && event.shiftKey) {
      setText((prevText) => prevText + "\n");
    }
  };
  const textareaStyle = {
    resize: "none",
    fontSize: getFontSize(),
    width: "60%",
    fontWeight: "400",
    lineHeight: "1.5",
    padding: "12px",
    borderRadius: "12px 12px 0 12px",
    color: grey[900],
    background: "#ffffff",
    border: `1px solid ${grey[200]}`,
    boxShadow: `0px 2px 2px ${grey[50]}`,
    outline: 0,
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  if (!isMounted) {
    return null;
  }

  const handleTextChange = (e, index, message, fieldType) => {
    if (globalTransliteration) {
      var updatedValue = e;
    } else {
      var updatedValue = e.target.value;
    }

    const updatedChatHistory = [...chatHistory];

    const messageIndex = chatHistory.findIndex((msg) => msg === message);

    if (messageIndex !== -1) {
      if (fieldType === "prompt") {
        updatedChatHistory[messageIndex].prompt = updatedValue;
      } else if (fieldType === "output") {
        updatedChatHistory[messageIndex].output[index].value = updatedValue;
      }

      setChatHistory(updatedChatHistory);
    }
  };

  // Helper function to detect if text is in Urdu/Kashmiri script
  const isRTLLanguage = (text) => {
    if (!text) return false;
    // Both Urdu and Kashmiri use Arabic/Persian script (Unicode range U+0600 to U+06FF)
    // This range covers Arabic, Persian, Urdu, and Kashmiri scripts
    const rtlScriptRegex = /[\u0600-\u06FF]/;
    return rtlScriptRegex.test(text);
  };

  const renderChatHistory = () => {

    // Delete/retry are disabled while a response is streaming; grey the icons to
    // match so they visibly read as unavailable (their hardcoded orange would
    // otherwise override MUI's disabled dimming).
    const actionsDisabled = isStreaming || chatLoading || loading;
    const actionIconColor = actionsDisabled ? grey[300] : "#EE6633";

    const toggleShrink = (index) => {
      setShrinkedMessages(prev => ({
        ...prev,
        [index]: !prev[index]
      }));
    };

    const chatElements = chatHistory?.map((message, index) => (

      <Grid
        container
        key={index}
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          padding: "0.8rem 0.5rem 0rem 0.5rem",
          margin: "0 auto",
          overflow: "hidden",
          maxWidth: "100%",
          boxSizing: "border-box",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Grid
          item
          style={{
            backgroundColor: "rgba(247, 184, 171, 0.2)",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            position: "relative",
            width: "100%",
          }}
        >
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#EE6633",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  marginRight: "0.5rem",
                }}
              >
                {index + 1}
              </div>
            </Grid>

            <Grid item>
              <Avatar
                alt="user_profile_pic"
                src={loggedInUserData?.profile_photo || ""}
                style={{
                  marginRight: "1rem",
                  width: "32px",
                  height: "32px"
                }}
              />
            </Grid>
            <Grid item xs className="w-full">
              {ProjectDetails?.metadata_json?.editable_prompt ? (
                globalTransliteration === "true" ? (
                  <IndicTransliterate
                    customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                    enableASR={true}
                    asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
                    apiKey={`JWT ${localStorage.getItem('anudesh_access_token')}`}
                    renderComponent={(props) => (
                      <textarea
                        maxRows={10}
                        placeholder={translate("chat_placeholder")}
                        {...props}
                        className=""
                        style={{
                          fontSize: getFontSize(),
                          width: "100%",
                          borderRadius: "12px 12px 0 12px",
                          color: grey[900],
                          background: "#ffffff",
                          border: `1px solid ${grey[200]}`,
                          boxShadow: `0px 2px 2px ${grey[50]}`,
                          minHeight: "4rem",
                          resize: "none",
                          textAlign: isRTLLanguage(message.prompt) ? "right" : "left",
                          direction: isRTLLanguage(message.prompt) ? "rtl" : "ltr",
                        }}
                      />
                    )}
                    value={message.prompt}
                    onChangeText={(e) =>
                      handleTextChange(e, null, message, "prompt")
                    }
                    lang={targetLang}
                    enabled={targetLang === "en" ? false : true}
                  />
                ) : (
                  <textarea
                    value={message.prompt}
                    onChange={(e) =>
                      handleTextChange(e, null, message, "prompt")
                    }
                    style={{
                      fontSize: getFontSize(),
                      width: "100%",
                      borderRadius: "12px 12px 0 12px",
                      color: grey[900],
                      background: "#ffffff",
                      border: `1px solid ${grey[200]}`,
                      boxShadow: `0px 2px 2px ${grey[50]}`,
                      minHeight: "4rem",
                      resize: "none",
                      textAlign: isRTLLanguage(message.prompt) ? "right" : "left",
                      direction: isRTLLanguage(message.prompt) ? "rtl" : "ltr",
                    }}
                    rows={1}
                  />
                )
              ) : (
                <ReactMarkdown
                  className="flex-col"
                  children={linkifyText(message?.prompt || "")}
                  components={{
                    p: ({ node, ...props }) => <p style={{ fontSize: getFontSize(), margin: '0.5rem 0' }} {...props} />, // UPDATED
                    a: ({ node, ...props }) => <a style={{ color: '#EE6633', textDecoration: 'underline', fontWeight: 500 }} target="_blank" rel="noopener noreferrer" {...props} />,
                  }}
                />
              )}
            </Grid>

            <Grid
              item
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flexShrink: 0,
              }}
            >
              {/* Copy prompt button */}
              <Tooltip title="Copy prompt">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(message?.prompt || "")}
                  style={{
                    padding: "4px",
                  }}
                >
                  <ContentCopyIcon style={{ fontSize: "1rem", color: "#EE6633" }} />
                </IconButton>
              </Tooltip>

              {/* Shrink button */}
              <IconButton
                size="small"
                onClick={() => toggleShrink(index)}
                style={{
                  padding: "4px",
                }}
              >
                {shrinkedMessages[index] ? (
                  <ExpandMoreIcon style={{ fontSize: "1rem", color: "#EE6633", fontWeight: "bold" }} />
                ) : (
                  <ExpandLessIcon style={{ fontSize: "1rem", color: "#EE6633" }} />
                )}
              </IconButton>

              {/* Retry button */}
              {index === chatHistory.length - 1 && stage !== "Alltask" && !disableUpdateButton && (
                <Tooltip title="Re-send the same prompt to get a new response">
                  <IconButton
                    size="small"
                    onClick={() => handleButtonClick(message.prompt, true)}
                    // Match delete: block retry while a response is streaming so
                    // an in-flight stream can't clash with a re-send.
                    disabled={actionsDisabled}
                    style={{
                      padding: "4px",
                    }}
                  >
                    <RestartAltIcon style={{ fontSize: "1rem", color: actionIconColor }} />
                  </IconButton>
                </Tooltip>
              )}

              {/* Delete button */}
              {index === chatHistory.length - 1 &&
                stage !== "Alltask" &&
                !disableUpdateButton && (
                  <IconButton
                    size="small"
                    onClick={() => handleClick("delete-pair", id?.id, 0.0)}
                    // Disable while a response is streaming: an in-flight stream
                    // would re-save the turn on completion and silently undo the
                    // delete. Re-enabled once streaming finishes.
                    disabled={actionsDisabled}
                    style={{
                      padding: "4px",
                    }}
                  >
                    <DeleteOutlinedIcon
                      style={{ color: actionIconColor, fontSize: "1rem" }}
                    />
                  </IconButton>
                )}
            </Grid>
          </Grid>
        </Grid>
        {/* Output Section - Only render when not shrinked */}
        {!shrinkedMessages[index] && (
          <Grid
            item
            xs={12}
            style={{
              textAlign: "left",
              position: "relative",
              width: "100%",
              backgroundColor: "white", // Added white background
              borderRadius: "0.5rem", // Added border radius
              border: "1px solid #e0e0e0", // Added border
              marginTop: "0.5rem", // Added spacing
              padding: "0.6rem", // Added padding
            }}
          >
            <Grid
              container
              alignItems="start"
              spacing={1}
              justifyContent="flex-start"
              style={{
                borderRadius: "0.5rem",
                width: "100%",
              }}
            >
              <Grid
                item
                xs={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "20px",
                }}
              >
                <Image
                  width={30}
                  height={30}
                  src="https://i.imgur.com/56Ut9oz.png"
                  alt="Bot Avatar"
                  priority
                />
              </Grid>

              <Grid item xs={11} style={{ paddingTop: "0rem" }}>
                {message?.output.map((segment, segIdx) =>
                  segment.type === 'text' ? (
                    ((ProjectDetails?.metadata_json?.editable_response) || (segment.value == "" && !ProjectDetails?.metadata_json?.blank_response)) && !(isStreaming && index === chatHistory.length - 1) ? (
                      globalTransliteration === "true" ? (
                        <IndicTransliterate
                          key={index}
                          value={segment.value}
                          onChangeText={(e) =>
                            handleTextChange(e, index, message, "output")
                          }
                          lang={targetLang}
                          style={{
                            fontSize: getFontSize(),
                            borderRadius: "12px 12px 0 12px",
                            color: grey[900],
                            background: "#ffffff",
                            border: `1px solid ${grey[200]}`,
                            boxShadow: `0px 2px 2px ${grey[50]}`,
                            minHeight: "4rem",
                            width: "100%",
                          }}
                          customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                          enableASR={true}
                          asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
                          apiKey={`JWT ${localStorage.getItem('anudesh_access_token')}`}
                          enabled={targetLang === "en" ? false : true}
                        />
                      ) : (
                        <textarea
                          key={index}
                          value={segment.value}
                          onChange={(e) =>
                            handleTextChange(e, index, message, "output")
                          }
                          style={{
                            fontSize: getFontSize(),
                            width: "100%",
                            borderRadius: "12px 12px 0 12px",
                            color: grey[900],
                            background: "#ffffff",
                            border: `1px solid ${grey[200]}`,
                            boxShadow: `0px 2px 2px ${grey[50]}`,
                            minHeight: "4rem",
                            resize: "none",
                          }}
                          rows={1}
                        />
                      )
                    ) : (
                      <>
                        {isStreaming && index === chatHistory.length - 1 && segment.value === "" ? (
                          <div className="streaming-dots">
                            <span></span><span></span><span></span>
                          </div>
                        ) : (
                          <div className={isStreaming && index === chatHistory.length - 1 ? "streaming-cursor" : ""}>
                            <ReactMarkdown
                              key={segIdx}
                              children={linkifyText(segment?.value || "")}
                              components={{
                                p: ({ node, ...props }) => <p style={{ fontSize: getFontSize(), margin: '0.5rem 0' }} {...props} />, // UPDATED
                                a: ({ node, ...props }) => <a style={{ color: '#EE6633', textDecoration: 'underline', fontWeight: 500 }} target="_blank" rel="noopener noreferrer" {...props} />,
                              }}
                            />
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <SyntaxHighlighter
                      key={index}
                      language={segment.language}
                      style={gruvboxDark}
                      customStyle={{
                        padding: "0.8rem",
                        borderRadius: "5px",
                        fontSize: getFontSize()
                      }}
                    >
                      {segment.value}
                    </SyntaxHighlighter>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    ));

    return chatElements;
  };
  const ChildModal = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Button
          sx={{
            marginTop: "1rem",
          }}
          variant="outlined"
          onClick={handleOpen}
        >
          {translate("modalButton.metaDataInfo")}
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: "40%" }}>
            <Typography
              id="child-modal-title"
              color={"#F18359"}
              fontWeight={"bold"}
              variant="h6"
            >
              {translate("modal.domain")}
            </Typography>
            <Typography variant="subtitle1" id="child-modal-description">
              {info.meta_info_domain}
            </Typography>

            <Typography
              color={"#F18359"}
              fontWeight={"bold"}
              variant="h6"
              id="child-modal-title"
            >
              {translate("modal.intent")}
            </Typography>
            <Typography variant="subtitle1" id="child-modal-description">
              {info.meta_info_intent}
            </Typography>

            <Typography
              id="child-modal-title"
              color={"#F18359"}
              fontWeight={"bold"}
              variant="h6"
            >
              {translate("modal.language")}
            </Typography>
            <Typography variant="subtitle1" id="child-modal-description">
              {ChatLang[info.meta_info_language]}
            </Typography>

            <Button variant="outlined" onClick={handleClose}>
              {translate("modalButton.close")}
            </Button>
          </Box>
        </Modal>
      </>
    );
  }; if (!isMounted) {
    return null;
  }
  return (
    <>
      {renderSnackBar()}
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          height: { xs: "calc(100dvh - 290px)", md: "calc(100vh - 190px)" },
          overflow: "hidden",
          position: { xs: "fixed", md: "relative" },
          top: { xs: "150px", md: "0" },
          left: { xs: 0, md: "0" },
          right: { xs: 0, md: "0" },
          bottom: { xs: "0", md: "0" },
          zIndex: { xs: 1000, md: "0" },

        }}
      >
        {/* Instruction Panel */}
        <Box
          ref={instructionPanelRef}
          sx={{
            width: {
              xs: "100%",
              md: isInstructionExpanded ? `${instructionWidth}%` : "40px"
            },
            height: {
              xs: isInstructionExpanded ? `${instructionWidth}dvh` : "60px",
              md: "100%"
            },
            maxHeight: { xs: isInstructionExpanded ? "70vh" : "none", md: "100%" },
            transition: "all 0.3s ease",
            padding: isInstructionExpanded ? "1rem" : "0px",
            paddingBottom: "0rem!important",
            paddingTop: isInstructionExpanded ? "0.3rem!important" : "0.5rem!important",
            borderRight: { xs: "none", md: "1px solid #e0e0e0" },
            backgroundColor: "#fafafa",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {isInstructionExpanded && window.innerWidth >= 768 && (
            <Box
              onMouseDown={!isPinned ? startDragging : undefined}
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '6px',
                height: '100%',
                cursor: !isPinned ? 'col-resize' : 'default',
                backgroundColor: 'transparent',
                zIndex: 10,
                ...(!isPinned && {
                  '&:hover': {
                    backgroundColor: 'rgba(238, 102, 51, 0.2)',
                  },
                  '&:active': {
                    backgroundColor: 'rgba(238, 102, 51, 0.3)',
                  },
                }),
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: '2px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '40px',
                  backgroundColor: !isPinned ? '#EE6633' : '#B0B0B0',
                  borderRadius: '2px',
                  opacity: !isPinned ? 0.6 : 0.4,
                }
              }}
            />
          )}        <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isInstructionExpanded ? "space-between" : "center",
              marginBottom: isInstructionExpanded ? "1rem" : 0,
              padding: isInstructionExpanded ? "0.5rem" : 0,
              backgroundColor: isInstructionExpanded ? "rgba(247, 184, 171, 0.2)" : "transparent",
              borderRadius: "8px",
              cursor: "pointer",
              minHeight: "40px",
              flexShrink: 0,
            }}
            onClick={() => setIsInstructionExpanded(!isInstructionExpanded)}
          >
            {isInstructionExpanded && (
              <Typography
                variant="h6"
                sx={{
                  color: "#636363",
                  fontWeight: "600",
                  fontSize: "1rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flexShrink: 1,
                  minWidth: 0,
                  marginRight: "0.5rem"
                }}
              >
                {translate("typography.instructions")}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
              {isInstructionExpanded && (
                <>
                  <Tooltip
                    title={
                      <span style={{ fontFamily: "Roboto, sans-serif" }}>
                        {isPinned ? "Unpin panel width" : "Pin panel width"}
                      </span>
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handlePinToggle(); }}
                      sx={{ padding: "4px", minWidth: "auto" }}
                    >
                      {isPinned
                        ? <PushPinIcon style={{ fontSize: "1rem", color: "#EE6633" }} />
                        : <PushPinOutlinedIcon style={{ fontSize: "1rem", color: "#888" }} />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      <span style={{ fontFamily: "Roboto, sans-serif" }}>
                        Reset panel width
                      </span>
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={handleResetPanelWidth}
                      sx={{ padding: "4px", minWidth: "auto" }}
                    >
                      <RestartAltIcon style={{ fontSize: "1rem", color: "#EE6633" }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              <Tooltip
                title={
                  <span style={{ fontFamily: "Roboto, sans-serif" }}>
                    {isInstructionExpanded ? "Collapse" : "Expand"}
                  </span>
                }
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsInstructionExpanded(!isInstructionExpanded);
                  }}
                  sx={{
                    padding: isInstructionExpanded ? '8px' : '4px',
                    minWidth: 'auto'
                  }}
                >
                  {isInstructionExpanded ? (
                    <ChevronLeftIcon style={{ fontSize: "1.2rem", color: "#EE6633" }} />
                  ) : (
                    <ChevronRightIcon style={{ fontSize: "1.2rem", color: "#EE6633" }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Font size slider — shown when expanded */}
          {isInstructionExpanded && (
            <FontSizeSlider
              value={fontSize}
              containerRef={containerRef}
              onCommit={(newVal) => {
                setFontSize(newVal);
                saveAnnotationUIPref({ annotation_font_size: newVal });
              }}
              onReset={() => handleResetFontSize()}
            />
          )}

          {isInstructionExpanded && (
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "0.5rem",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  marginBottom: "1rem",
                }}
              >
                <ReactMarkdown
                  className="flex-col"
                  children={info?.instruction_data ? info.instruction_data.replace(/\n/gi, "  \n").replace(/(^|\s)([A-Z][A-Za-z0-9]*(?:\s[A-Z0-9][A-Za-z0-9]*){0,3}):/g, '\n\n**$2:** ') : ""}
                  components={{
                    p: ({ node, ...props }) => <p style={{ fontSize: getFontSize(), lineHeight: "1.5", color: "#333", margin: '0 0 1rem 0' }} {...props} />,
                    a: ({ node, ...props }) => <a style={{ color: '#EE6633', textDecoration: 'underline', fontWeight: 500 }} target="_blank" rel="noopener noreferrer" {...props} />,
                  }}
                />
              </Box>

              {/* Metadata Information Section - Now directly in the panel */}
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "1px solid #e0e0e0",
                }}
              >
                {/* Hint Section */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      color: "#F18359",
                      fontWeight: "bold",
                      fontSize: 'calc(var(--chat-font-size) + 0.1rem)',
                      mb: 1,
                    }}
                  >
                    {translate("modal.hint")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 'max(0.6rem, calc(var(--chat-font-size) - 0.05rem))',
                      lineHeight: "1.4",
                      color: "#555",
                      backgroundColor: "#f8f9fa",
                      padding: "0.75rem",
                      borderRadius: "4px",
                      borderLeft: "3px solid #F18359",
                    }}
                  >
                    {info.hint || "No hints available"}
                  </Typography>
                </Box>

                {/* Examples Section */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      color: "#F18359",
                      fontWeight: "bold",
                      fontSize: 'calc(var(--chat-font-size) + 0.1rem)',
                      mb: 1,
                    }}
                  >
                    {translate("modal.examples")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 'max(0.6rem, calc(var(--chat-font-size) - 0.05rem))',
                      lineHeight: "1.4",
                      color: "#555",
                      backgroundColor: "#f8f9fa",
                      padding: "0.75rem",
                      borderRadius: "4px",
                      borderLeft: "3px solid #4CAF50",
                    }}
                  >
                    {info.examples || "No examples available"}
                  </Typography>
                </Box>

                {/* Additional Metadata Information */}
                <Box>
                  <Typography
                    sx={{
                      color: "#F18359",
                      fontWeight: "bold",
                      fontSize: 'calc(var(--chat-font-size) + 0.1rem)',
                      mb: 1,
                    }}
                  >
                    Additional Information
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {info.meta_info_language && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <CodeIcon fontSize="small" color="primary" />
                        <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "#666" }}>
                          Language: {info.meta_info_language}
                        </Typography>
                      </Box>
                    )}
                    {taskId && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <AssignmentIcon fontSize="small" color="secondary" />
                        <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "#666" }}>
                          Task ID: {taskId}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Chat Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            minWidth: 0,
            paddingBottom: "0rem!important",
          }}
        >
          {ProjectDetails?.metadata_json?.blank_response && (
            <Alert severity="info" sx={{ mx: 1, mt: 1 }}>
              This project doesn't require model response. Please submit if the prompt is correct
            </Alert>
          )}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              paddingBottom: "0rem!important",
              background: 'linear-gradient(135deg, #fff5f5 0%, #fff9f0 50%, #f5f0ff 100%)',
              width: "100%",
              minHeight: 0,
            }}
          >
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "100%",
              "& > *": {
                maxWidth: "100%",
                width: "100%"
              }
            }}>
              {showChatContainer ? renderChatHistory() : null}
            </Box>
            <Box ref={bottomRef} sx={{ height: "1px" }} />
          </Box>
        </Box>
      </Box>

      {/* Full Width Textarea - Covers Entire Width */}
      {stage !== "Alltask" && !disableUpdateButton ? (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100vw", // Full viewport width
            backgroundColor: "white",
            borderTop: "1px solid #e0e0e0",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
            py: "0.5rem",
            px: { xs: "0", md: "4rem" }, // Remove horizontal padding on desktop
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
            height: "70px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%", // Always full width
              mx: 0, // No margin
              paddingLeft: "1rem",
            }}
          >
            <Textarea
              handleButtonClick={handleButtonClick}
              handleOnchange={handleOnchange}
              size={10}
              sx={{
                width: "100%",
                margin: 0,
                padding: 0,
                "& .MuiInputBase-root": {
                  height: "50px",
                  width: "100%",
                },
                "& textarea": {
                  fontSize: getFontSize(),
                  width: "100%",
                }
              }}
              class_name={"w-full"}
              loading={loading || chatLoading}
              inputValue={inputValue}
              overrideGT={true}
              task_id={taskId}
              script={info.meta_info_language}
            />
          </Box>
        </Box>
      ) : null}
    </>
  );
};
export default InstructionDrivenChatPage;
