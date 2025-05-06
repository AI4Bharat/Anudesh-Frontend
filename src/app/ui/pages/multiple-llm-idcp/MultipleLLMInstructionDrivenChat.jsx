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
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import PatchAnnotationAPI from "@/app/actions/api/Dashboard/PatchAnnotations";
import ChatLang from "@/utils/Chatlang";
import { IndicTransliterate } from "@/libs/dist";
import configs from "@/config/config";

import { info } from "./config";
import { chatHistory } from "./config";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

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

const viewFullResponseModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
  padding: "2.4rem",
};

const MultipleLLMInstructionDrivenChat = ({
  // chatHistory,
  setChatHistory,
  handleClick,
  formatResponse,
  formatPrompt,
  id,
  stage,
  notes,
  // info,
  disableUpdateButton,
  annotation,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const tooltipStyle = useStyles();
  const [inputValue, setInputValue] = useState("");
  const classes = headerStyle();
  const { taskId } = useParams();
  const [annotationId, setAnnotationId] = useState();
  const bottomRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [showChatContainer, setShowChatContainer] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadtime, setloadtime] = useState(new Date());
  const load_time = useRef();
  const [viewFullResponse, setViewFullResponse] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      alert(`You selected: ${selectedOption}`);
    } else {
      alert("Please select an option before submitting.");
    }
  };

  const handleOpenViewFullResponse = () => setViewFullResponse(true);
  const handleCloseViewFullResponse = () => setViewFullResponse(false);

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

  // useEffect(() => {
  //   let modifiedChatHistory = [];
  //   if (
  //     annotation &&
  //     Array.isArray(annotation[0]?.result) &&
  //     annotation[0]?.result.length > 0
  //   ) {
  //     modifiedChatHistory = annotation[0]?.result.map((interaction, index) => {
  //       return {
  //         ...interaction,
  //         output: formatResponse(interaction.output),
  //       };
  //     });
  //     setChatHistory(modifiedChatHistory);
  //   } else {
  //     setChatHistory([]);
  //   }
  //   setAnnotationId(annotation[0]?.id);
  //   setShowChatContainer(!!annotation[0]?.result);
  // }, [annotation]);

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

  // const handleButtonClick = async () => {
  //   if (inputValue) {
  //     setLoading(true);
  //     const body = {
  //       result: inputValue,
  //       lead_time:
  //         (new Date() - loadtime) / 1000 +
  //         Number(id?.lead_time?.lead_time ?? 0),
  //       auto_save: true,
  //       task_id: taskId,
  //     };
  //     if (stage === "Alltask") {
  //       body.annotation_status = id?.annotation_status;
  //     } else {
  //       body.annotation_status = localStorage.getItem("labellingMode");
  //     }
  //     if (stage === "Review") {
  //       body.review_notes = JSON.stringify(
  //         notes?.current?.getEditor().getContents(),
  //       );
  //     } else if (stage === "SuperChecker") {
  //       body.superchecker_notes = JSON.stringify(
  //         notes?.current?.getEditor().getContents(),
  //       );
  //     } else {
  //       body.annotation_notes = JSON.stringify(
  //         notes?.current?.getEditor().getContents(),
  //       );
  //     }
  //     if (stage === "Review" || stage === "SuperChecker") {
  //       body.parentannotation = id?.parent_annotation;
  //     }
  //     const AnnotationObj = new PatchAnnotationAPI(id?.id, body);
  //     const res = await fetch(AnnotationObj.apiEndPoint(), {
  //       method: "PATCH",
  //       body: JSON.stringify(AnnotationObj.getBody()),
  //       headers: AnnotationObj.getHeaders().headers,
  //     });
  //     const data = await res.json();
  //     let modifiedChatHistory;
  //     setChatHistory((prevChatHistory) => {
  //       data && data.result && setLoading(false);
  //       if (data && data.result) {
  //         modifiedChatHistory = data.result.map((interaction, index) => {
  //           const isLastInteraction = index === data?.result?.length - 1;
  //           return {
  //             ...interaction,
  //             output: formatResponse(interaction.output, isLastInteraction),
  //           };
  //         });
  //       } else {
  //         setLoading(false);
  //         setSnackbarInfo({
  //           open: true,
  //           message: data?.message,
  //           variant: "error",
  //         });
  //       }
  //       return data && data.result
  //         ? [...modifiedChatHistory]
  //         : [...prevChatHistory];
  //     });
  //   } else {
  //     setSnackbarInfo({
  //       open: true,
  //       message: "Please provide a prompt",
  //       variant: "error",
  //     });
  //   }
  //   setTimeout(() => {
  //     bottomRef.current.scrollIntoView({ behavior: "smooth" });
  //   }, 1000);
  //   setShowChatContainer(true);
  // };

  const handleOnchange = (prompt) => {
    setInputValue(prompt);
  };

  const handleEditResponse = () => {
    console.log("edit response");
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
        setGlobalTransliteration(storedGlobalTransliteration === "true");
      }
      if (storedLanguage !== null) {
        setTargetLang(storedLanguage);
      }
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
      // handleButtonClick();
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
    const chatElements = chatHistory?.map((message, index) => (
      <Grid
        container
        spacing={2}
        key={index}
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ padding: "1.5rem", margin: "auto" }}
      >
        <Grid
          item
          sx={{
            backgroundColor: "rgba(247, 184, 171, 0.2)",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            position: "relative",
            width: "100%",
            marginBottom: "1.5rem",
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar
                alt="user_profile_pic"
                src={loggedInUserData?.profile_photo || ""}
                sx={{ marginRight: "1rem" }}
              />
            </Grid>
            <Grid item xs className="w-full">
              {ProjectDetails?.metadata_json?.editable_prompt ? (
                globalTransliteration ? (
                  <IndicTransliterate
                    customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                    apiKey={`JWT ${localStorage.getItem(
                      "anudesh_access_token",
                    )}`}
                    renderComponent={(props) => (
                      <textarea
                        maxRows={10}
                        placeholder={translate("chat_placeholder")}
                        {...props}
                        className=""
                        style={{
                          fontSize: "1rem",
                          width: "100%",
                          padding: "12px",
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
                      padding: "12px",
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
            {index === chatHistory.length - 1 &&
              stage !== "Alltask" &&
              !disableUpdateButton && (
                <IconButton
                  size="large"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    marginTop: "1rem",
                    borderRadius: "50%",
                  }}
                  onClick={() => handleClick("delete-pair", id?.id, 0.0)}
                >
                  <DeleteOutlinedIcon
                    sx={{ color: "#EE6633", fontSize: "1.2rem" }}
                  />
                </IconButton>
              )}
          </Grid>
        </Grid>

        <Grid
          item
          sx={{
            textAlign: "left",
            position: "relative",
            width: "100%",
            padding: "1.5rem",
            borderRadius: "0.5rem",
          }}
        >
          <Grid container alignItems="start" spacing={2}>
            <Grid item>
              <Image
                width={50}
                height={50}
                src="https://i.postimg.cc/nz91fDCL/undefined-Imgur.webp"
                alt="Bot Avatar"
                priority
              />
            </Grid>

            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                minWidth: `90%`,
              }}
            >
              {/* {message?.output.map((segment, index) =>
                segment.type === "text" ? (
                  ProjectDetails?.metadata_json?.editable_response ||
                  segment.value == "" ? (
                    globalTransliteration ? (
                      <IndicTransliterate
                        key={index}
                        value={segment.value}
                        onChangeText={(e) =>
                          handleTextChange(e, index, message, "output")
                        }
                        lang={targetLang}
                        style={{
                          fontSize: "1rem",
                          padding: "12px",
                          borderRadius: "12px 12px 0 12px",
                          color: grey[900],
                          background: "#ffffff",
                          border: `1px solid ${grey[200]}`,
                          boxShadow: `0px 2px 2px ${grey[50]}`,
                          minHeight: "5rem",
                          // resize: "none",
                          width: "100%",
                        }}
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
                          padding: "12px",
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
                ),
              )} */}

              {/* Output 1 Section */}
              <Box
                sx={{
                  border: "1px solid #ccc",
                  width: "60%",
                  marginLeft: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  borderRadius: "10px",
                }}
              >
                <Tooltip
                  title={
                    <span style={{ fontFamily: "Roboto, sans-serif" }}>
                      Expand to view full response
                    </span>
                  }
                >
                  <IconButton onClick={handleOpenViewFullResponse}>
                    <OpenInFullIcon
                      sx={{
                        padding: "10px 10px 0 0",
                        color: "#EE6633",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Modal
                  open={viewFullResponse}
                  onClose={handleCloseViewFullResponse}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                    sx: {
                      backdropFilter: "blur(2px)", // Apply blur effect
                      backgroundColor: "rgba(0, 0, 0, 0.2)", // Optional light overlay
                    },
                  }}
                >
                  <Fade in={viewFullResponse}>
                    <Box sx={viewFullResponseModalStyle}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            color: "#EE6633",
                            fontSize: "1.25rem",
                          }}
                        >
                          Claude 3.7 Sonnet
                        </Typography>
                        <IconButton onClick={handleCloseViewFullResponse}>
                          <CloseIcon sx={{ color: "#EE6633" }} />
                        </IconButton>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          maxHeight: "60vh",
                          overflowY: "scroll",
                        }}
                      >
                        {message.response.output1}
                      </Typography>
                    </Box>
                  </Fade>
                </Modal>
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "400px",
                    padding: "20px 50px",
                  }}
                >
                  {message.response.output1}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      backgroundColor: "#E8E6E6",
                      padding: "10px",
                      borderRadius: "10px",
                      fontSize: "1rem",
                    }}
                  >
                    Claude 3.7 Sonnet
                  </Typography>
                </Box>
              </Box>

              {/* Output 2 Section */}
              <Box
                sx={{
                  border: "1px solid #ccc",
                  width: "60%",
                  marginLeft: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  borderRadius: "10px",
                }}
              >
                <Tooltip
                  title={
                    <span style={{ fontFamily: "Roboto, sans-serif" }}>
                      Expand to view full response
                    </span>
                  }
                >
                  <IconButton onClick={handleOpenViewFullResponse}>
                    <OpenInFullIcon
                      sx={{
                        padding: "10px 10px 0 0",
                        color: "#EE6633",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Modal
                  open={viewFullResponse}
                  onClose={handleCloseViewFullResponse}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                    sx: {
                      backdropFilter: "blur(2px)", // Apply blur effect
                      backgroundColor: "rgba(0, 0, 0, 0.2)", // Optional light overlay
                    },
                  }}
                >
                  <Fade in={viewFullResponse}>
                    <Box sx={viewFullResponseModalStyle}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingBottom: "1.5rem",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            color: "#EE6633",
                            fontSize: "1.25rem",
                          }}
                        >
                          Claude 3.7 Sonnet
                        </Typography>
                        <IconButton onClick={handleCloseViewFullResponse}>
                          <CloseIcon sx={{ color: "#EE6633" }} />
                        </IconButton>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          maxHeight: "60vh",
                          overflowY: "scroll",
                        }}
                      >
                        {message.response.output2}
                      </Typography>
                    </Box>
                  </Fade>
                </Modal>
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "400px",
                    padding: "20px 50px",
                  }}
                >
                  {message.response.output2}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      backgroundColor: "#E8E6E6",
                      padding: "10px",
                      borderRadius: "10px",
                      fontSize: "1rem",
                    }}
                  >
                    Claude 3.7 Sonnet
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          sx={{
            padding: "1.5rem",
            position: "relative",
            width: "85%",
            backgroundColor: "rgba(247, 184, 171, 0.2)",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <span>Which response do you like better?</span>
              <Button
                variant="contained"
                onClick={() => handleOptionClick("Model A")}
                sx={{
                  backgroundColor:
                    selectedOption === "Model A" ? "#EE6633" : "#FFFFFF", // Highlight selected button
                  color: selectedOption === "Model A" ? "#FFF" : "#000", // Adjust text color
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  "&:hover": {
                    backgroundColor:
                      selectedOption === "Model A" ? "#EE6633" : "#DAE2ED", // Hover effect
                  },
                  marginLeft: "1.2rem",
                }}
              >
                Model A
              </Button>
              <Button
                variant="contained"
                onClick={() => handleOptionClick("Model B")}
                sx={{
                  backgroundColor:
                    selectedOption === "Model B" ? "#EE6633" : "#FFFFFF", // Highlight selected button
                  color: selectedOption === "Model B" ? "#FFF" : "#000", // Adjust text color
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  "&:hover": {
                    backgroundColor:
                      selectedOption === "Model B" ? "#EE6633" : "#DAE2ED", // Hover effect
                  },
                  marginLeft: "1.2rem",
                }}
              >
                Model B
              </Button>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  border: "1.5px solid #EE6633",
                  color: "#EE6633",
                  backgroundColor: "#FFF",
                  borderRadius: "8px",
                  padding: "0.5rem 1.5rem",
                  "&:hover": {
                    backgroundColor: "#EE6633",
                    color: "#FFF",
                  },
                }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  border: "1.5px solid #EE6633",
                  color: "#EE6633",
                  backgroundColor: "#FFF",
                  borderRadius: "8px",
                  padding: "0.5rem 1.5rem",
                  "&:hover": {
                    backgroundColor: "#EE6633",
                    color: "#FFF",
                  },
                  marginLeft: "1.2rem",
                }}
              >
                <CloseIcon />
              </Button>
            </Box>
          </Typography>
        </Grid>
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
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              borderRadius: "10px",
              padding: "10px",
              backgroundColor: "rgba(247, 184, 171, 0.2)",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              margin: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // padding: "1rem",
              }}
            >
              <Typography
                variant="h3"
                align="center"
                sx={{
                  color: "#636363",
                  fontSize: {
                    xs: "0.8125rem", // Small screens (mobile)
                    sm: "1rem", // Medium screens (tablet)
                    md: "1.5rem", // Large screens (laptops)
                    lg: "2rem", // Extra-large screens (desktops)
                  },
                  fontWeight: "800",
                }}
              >
                {translate("typography.instructions")}
              </Typography>
              <Tooltip
                title={
                  <span style={{ fontFamily: "Roboto, sans-serif" }}>
                    Hint and Metadata
                  </span>
                }
              >
                <IconButton onClick={handleOpen}>
                  <TipsAndUpdatesIcon color="primary.dark" fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography
              paragraph={true}
              sx={{
                fontSize: {
                  xs: "0.5rem", // Small screens (mobile)
                  sm: "0.75rem", // Medium screens (tablet)
                  md: ".8125rem", // Large screens (laptops)
                  lg: "1rem", // Extra-large screens (desktops)
                },
                padding: "0.5rem 1rem ",
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {info.instruction_data}
            </Typography>
          </Box>
        </Box>
        <Grid
          item
          xs={12}
          sx={{
            margin: "0.8rem 0",
            overflowY: "scroll",
            // minHeight: "39rem",
            // maxHeight: "39rem",
            borderRadius: "20px",
            backgroundColor: "#FFF",
            paddingLeft: "0px !important",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center !important",
              padding: "1rem 0",
            }}
          >
            {showChatContainer ? renderChatHistory() : null}
          </Box>
          <Box ref={bottomRef} />
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
              }}
            >
              <Textarea
                // handleButtonClick={handleButtonClick}
                handleOnchange={handleOnchange}
                size={12}
                sx={{
                  width: "100vw",
                }}
                class_name={"w-full"}
                loading={loading}
                inputValue={inputValue}
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

export default MultipleLLMInstructionDrivenChat;
