"use client";
import "./chat.css";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import headerStyle from "@/styles/Header";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import { useState, useEffect, useRef } from "react";
import CustomizedSnackbars from "@/components/common/Snackbar";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import PatchAnnotationAPI from "@/app/actions/api/Dashboard/PatchAnnotations";
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
}) => {
  const tooltipStyle = useStyles();
  const [inputValue, setInputValue] = useState("");
  const classes = headerStyle();
  const { taskId } = useParams();
  const [annotationId, setAnnotationId] = useState();
  const [shrinkedMessages, setShrinkedMessages] = useState({});
  const [isInstructionExpanded, setIsInstructionExpanded] = useState(true);

  const bottomRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadtime, setloadtime] = useState(new Date());
  const load_time = useRef();

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);

  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
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
      setChatHistory(modifiedChatHistory);
    } else {
      setChatHistory([]);
    }
    setAnnotationId(annotation[0]?.id);
    setShowChatContainer(!!annotation[0]?.result);
  }, [annotation]);

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

  const handleButtonClick = async () => {
    if (inputValue) {
      setLoading(true);
      const body = {
        result: inputValue,
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
      const AnnotationObj = new PatchAnnotationAPI(id?.id, body);
      const res = await fetch(AnnotationObj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(AnnotationObj.getBody()),
        headers: AnnotationObj.getHeaders().headers,
      });
      const data = await res.json();
      let modifiedChatHistory;
      setChatHistory((prevChatHistory) => {
        data && data.result && setLoading(false);
        if (data && data.result) {
          modifiedChatHistory = data.result.map((interaction, index) => {
            const isLastInteraction = index === data?.result?.length - 1;
            return {
              ...interaction,
              output: formatResponse(interaction.output, isLastInteraction),
            };
          });
        } else {
          setLoading(false);
          setSnackbarInfo({
            open: true,
            message: data?.message,
            variant: "error",
          });
        }
        return data && data.result
          ? [...modifiedChatHistory]
          : [...prevChatHistory];
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: "Please provide a prompt",
        variant: "error",
      });
    }
    setTimeout(() => {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, 1000);
    setShowChatContainer(true);
  };

  const handleOnchange = (prompt) => {
    setInputValue(prompt);
  };
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [globalTransliteration, setGlobalTransliteration] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
      console.log(
        globalTransliteration,
        "lll",
        localStorage.getItem("globalTransliteration"),
      );
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
    fontSize: "1rem",
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

const renderChatHistory = () => {
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
                          fontSize: "0.9rem",
                          width: "100%",
                          borderRadius: "12px 12px 0 12px",
                          color: grey[900],
                          background: "#ffffff",
                          border: `1px solid ${grey[200]}`,
                          boxShadow: `0px 2px 2px ${grey[50]}`,
                          minHeight: "4rem",
                          resize: "none",
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
                      fontSize: "0.9rem",
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
                <ReactMarkdown
                  className="flex-col"
                  children={message?.prompt?.replace(/\n/gi, "&nbsp; \n")}
                  components={{
                    p: ({node, ...props}) => <p style={{fontSize: '0.9rem', margin: '0.5rem 0'}} {...props} />,
                  }}
                />
              )}
            </Grid>
            
            <IconButton
              size="small"
              onClick={() => toggleShrink(index)}
              style={{
                position: "absolute",
                bottom: "0.5rem",
                right: "0.5rem",
              }}
            >
              {shrinkedMessages[index] ? (
                <ExpandMoreIcon style={{ fontSize: "1rem", color: "#EE6633" ,fontWeight:"bold"}} />
              ) : (
                <ExpandLessIcon style={{ fontSize: "1rem", color: "#EE6633" }} />
              )}
            </IconButton>

            {index === chatHistory.length - 1 &&
              stage !== "Alltask" &&
              !disableUpdateButton && (
                <IconButton
                  size="large"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: "2rem",
                    marginTop: "1rem",
                    borderRadius: "50%",
                  }}
                  onClick={() => handleClick("delete-pair", id?.id, 0.0)}
                >
                  <DeleteOutlinedIcon
                    style={{ color: "#EE6633", fontSize: "1rem" }}
                  />
                </IconButton>
              )}
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
                  src="https://i.postimg.cc/nz91fDCL/undefined-Imgur.webp"
                  alt="Bot Avatar"
                  priority
                />
              </Grid>

              <Grid item xs={11} style={{ paddingTop: "0rem" }}>
                {message?.output.map((segment, index) =>
                  segment.type === 'text' ? (
                    (ProjectDetails?.metadata_json?.editable_response) || segment.value == "" ? (
                      globalTransliteration === "true" ? (
                        <IndicTransliterate
                          key={index}
                          value={segment.value}
                          onChangeText={(e) =>
                            handleTextChange(e, index, message, "output")
                          }
                          lang={targetLang}
                          style={{
                            fontSize: "0.9rem",
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
                            fontSize: "0.9rem",
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
                      <ReactMarkdown
                        key={index}
                        children={segment?.value?.replace(/\n/gi, "&nbsp; \n")}
                        components={{
                          p: ({node, ...props}) => <p style={{fontSize: '0.9rem', margin: '0.5rem 0'}} {...props} />,
                        }}
                      />
                    )
                  ) : (
                    <SyntaxHighlighter
                      key={index}
                      language={segment.language}
                      style={gruvboxDark}
                      customStyle={{ 
                        padding: "0.8rem",
                        borderRadius: "5px",
                        fontSize: "0.9rem"
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
  };

  if (!isMounted) {
    return null;
  }
return (
  <>
    {renderSnackBar()}
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        height: "calc(100vh - 120px)", // Reduced height to make space for textarea
        overflow: "hidden",
      }}
    >
      {/* Instruction Panel */}
      <Box
        sx={{
          width: { xs: "100%", md: isInstructionExpanded ? "30%" : "40px" },
          height: { xs: isInstructionExpanded ? "auto" : "60px", md: "100%" },
          maxHeight: { xs: isInstructionExpanded ? "30vh" : "none", md: "100%" },
          transition: "all 0.3s ease",
          padding: isInstructionExpanded ? "1rem" : "0.5rem",
          borderRight: { xs: "none", md: "1px solid #e0e0e0" },
          borderBottom: { xs: "1px solid #e0e0e0", md: "none" },
          backgroundColor: "#fafafa",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isInstructionExpanded ? "space-between" : "center",
            marginBottom: isInstructionExpanded ? "1rem" : 0,
            padding: "0.5rem",
            backgroundColor: "rgba(247, 184, 171, 0.2)",
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
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              {translate("typography.instructions")}
            </Typography>
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

        {isInstructionExpanded && (
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
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
              <Typography
                paragraph
                sx={{
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  color: "#333",
                }}
              >
                {info.instruction_data}
              </Typography>
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
                    fontSize: "1rem",
                    mb: 1,
                  }}
                >
                  {translate("modal.hint")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.85rem",
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
                    fontSize: "1rem",
                    mb: 1,
                  }}
                >
                  {translate("modal.examples")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.85rem",
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
                    fontSize: "1rem",
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
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            backgroundImage: `url("https://i.postimg.cc/76Mw8q8t/chat-bg.webp")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#fff",
            width: "100%",
            minHeight: 0,
          }}
        >
          {showChatContainer ? renderChatHistory() : null}
          <div ref={bottomRef} />
        </Box>
      </Box>
    </Box>

    {/* Textarea placed outside the main container */}
    {stage !== "Alltask" && !disableUpdateButton ? (
      <Box
        sx={{
          padding: "1rem",
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
          width: "100%",
          boxSizing: "border-box",
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Textarea
          handleButtonClick={handleButtonClick}
          handleOnchange={handleOnchange}
          size={12}
          sx={{
            width: "100%",
          }}
          class_name={"w-full"}
          loading={loading}
          inputValue={inputValue}
          overrideGT={true}
          task_id={taskId}
          script={info.meta_info_language}
        />
      </Box>
    ) : null}
  </>
);
}
export default InstructionDrivenChatPage;