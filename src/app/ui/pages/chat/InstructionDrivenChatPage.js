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

const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: "1rem !important", // Adjust the font size as needed
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
  /* eslint-disable react-hooks/exhaustive-deps */
  const tooltipStyle = useStyles();
  const [inputValue, setInputValue] = useState("");
  const classes = headerStyle();
  const { taskId } = useParams();
  const [annotationId, setAnnotationId] = useState();
      const [shrinkedMessages, setShrinkedMessages] = useState({});

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
    // Ensure text is a string
    text = String(text);

    // Clean the meta info values
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
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#EE6633",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
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
                style={{ marginRight: "1rem" }}
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
                          fontSize: "1rem",
                          width: "100%",
                          borderRadius: "12px 12px 0 12px",
                          color: grey[900],
                          background: "#ffffff",
                          border: `1px solid ${grey[200]}`,
                          boxShadow: `0px 2px 2px ${grey[50]}`,
                          minHeight: "5rem",
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
                      fontSize: "1rem",
                      width: "100%",
                      borderRadius: "12px 12px 0 12px",
                      color: grey[900],
                      background: "#ffffff",
                      border: `1px solid ${grey[200]}`,
                      boxShadow: `0px 2px 2px ${grey[50]}`,
                      minHeight: "5rem",
                      resize: "none",
                    }}
                    rows={1}
                  />
                )
              ) : (
                <ReactMarkdown
                  className="flex-col"
                  children={message?.prompt?.replace(/\n/gi, "&nbsp; \n")}
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
                <ExpandMoreIcon style={{ fontSize: "1.2rem", color: "#EE6633" ,fontWeight:"bold"}} />
              ) : (
                <ExpandLessIcon style={{ fontSize: "1.2rem", color: "#EE6633" }} />
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
                    style={{ color: "#EE6633", fontSize: "1.2rem" }}
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
            }}
          >
            <Grid
              container
              alignItems="start"
              spacing={2}
              justifyContent="flex-start"
              style={{
                padding: "1rem 1rem 0.5rem 1rem",
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
                  minWidth: "50px",
                }}
              >
                <Image
                  width={50}
                  height={50}
                  src="https://i.postimg.cc/nz91fDCL/undefined-Imgur.webp"
                  alt="Bot Avatar"
                  priority
                />
              </Grid>

              <Grid item xs={11} style={{ paddingTop: "1rem" }}>
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
                            fontSize: "1rem",
                            borderRadius: "12px 12px 0 12px",
                            color: grey[900],
                            background: "#ffffff",
                            border: `1px solid ${grey[200]}`,
                            boxShadow: `0px 2px 2px ${grey[50]}`,
                            minHeight: "5rem",
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
                            fontSize: "1rem",
                            width: "100%",
                            borderRadius: "12px 12px 0 12px",
                            color: grey[900],
                            background: "#ffffff",
                            border: `1px solid ${grey[200]}`,
                            boxShadow: `0px 2px 2px ${grey[50]}`,
                            minHeight: "5rem",
                            resize: "none",
                          }}
                          rows={1}
                        />
                      )
                    ) : (
                      <ReactMarkdown
                        key={index}
                        children={segment?.value?.replace(/\n/gi, "&nbsp; \n")}
                      />
                    )
                  ) : (
                    <SyntaxHighlighter
                      key={index}
                      language={segment.language}
                      style={gruvboxDark}
                      customStyle={{ padding: "1rem", borderRadius: "5px" }}
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
const ChildModal = () => {    const [open, setOpen] = useState(false);

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
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              borderRadius: "10px",
              padding: "0px",
              backgroundColor: "rgba(247, 184, 171, 0.2)",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              cursor: "pointer",
                transform: isExpanded ? "scale(1)" : "scale(0.98)",
                
            }}
            
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Tooltip
                title={
                  <span style={{ fontFamily: "Roboto, sans-serif" }}>
                    {isExpanded ? "Click to collapse" : "Click to expand"}
                  </span>
                }
              >
                <Typography
                  variant="h3"
                  align="center"
                  sx={{
                    color: "#636363",
                    fontSize: {
                      xs: "0.8125rem",
                      sm: "1rem",
                      md: "1.5rem",
                      lg: "2rem",
                    },
                    fontWeight: "800",
                  }}
                >
                  {translate("typography.instructions")}
                </Typography>
              </Tooltip>
              <Tooltip
                title={
                  <span style={{ fontFamily: "Roboto, sans-serif" }}>
                    Hint and Metadata
                  </span>
                }
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen();
                  }}
                >
                  <TipsAndUpdatesIcon color="primary.dark" fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>
                        <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                position: "absolute",
                bottom: "0.5rem",
                right: "0.5rem",
              }}
            >
              {isExpanded ? (
                <ExpandLessIcon style={{ fontSize: "1.2rem", color: "#EE6633" ,fontWeight:"bold"}} />
              ) : (
                <ExpandMoreIcon style={{ fontSize: "1.2rem", color: "#EE6633",fontWeight:"bold" }} />

              )}
            </IconButton>



            <Box
              sx={{
                width: "100%",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <Typography
                paragraph={true}
                sx={{
                  fontSize: {
                    xs: "0.5rem",
                    sm: "0.75rem",
                    md: ".8125rem",
                    lg: "1rem",
                  },
                  padding: "0rem 1rem",
                  height: "auto",
                  display: "flex",
                  minWidth: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "pre-wrap",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  maxHeight: isExpanded ? "none" : "60px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  "&:hover": {
                  }
                }}
              >
                {info.instruction_data}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid
          item
          xs={12}
          sx={{
            margin: "0rem 0",
            overflowY: "scroll",
            // minHeight: "39rem",
            // maxHeight: "39rem",
            borderRadius: "20px",
            backgroundColor: "#FFF",
            paddingLeft: "0px !important",
            boxSizing: "border-box",
            width: "100%",
            height:"300px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center !important",
              padding: "0 0",
              // height:"200px",
              // overflow:"scroll"
            }}
          >
            {showChatContainer ? renderChatHistory() : null}
          </Box>
          <div ref={bottomRef} />
          {stage !== "Alltask" && !disableUpdateButton ? (
            <Grid
              item
              xs={12}
              sx={{
                boxSizing: "border-box",
                width: "100%",
                height: "5rem",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "white"
              }}
            >
              <Textarea
                handleButtonClick={handleButtonClick}
                handleOnchange={handleOnchange}
                // grid_size={"100vw"}
                size={12}
                sx={{
                  width: "100vw",
                }}
                class_name={"w-full"}
                loading={loading}
                inputValue={inputValue}
                // defaultLang={targetLang}
                overrideGT={true}
                task_id={taskId}
                script={info.meta_info_language}
              />
            </Grid>
          ) : null}
        </Grid>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "40%" }}>
          <Typography
            color={"#F18359"}
            fontWeight={"bold"}
            variant="h6"
            id="parent-modal-title"
          >
            {translate("modal.hint")}
          </Typography>
          <Typography variant="subtitle1" id="parent-modal-description">
            {info.hint}
          </Typography>
          <Typography
            color={"#F18359"}
            fontWeight={"bold"}
            variant="h6"
            id="parent-modal-title"
          >
            {translate("modal.examples")}
          </Typography>
          <Typography variant="subtitle1" id="parent-modal-description">
            {info.examples}
          </Typography>
          <ChildModal />
        </Box>
      </Modal>
    </>
  );
};

export default InstructionDrivenChatPage;
