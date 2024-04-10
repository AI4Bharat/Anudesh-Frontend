"use client";
import "./chat.css";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Button,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import headerStyle from "@/styles/Header";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import { useState, useEffect, useRef } from "react";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import PatchAnnotationAPI from "@/app/actions/api/Dashboard/PatchAnnotations";
import GetTaskAnnotationsAPI from "@/app/actions/api/Dashboard/GetTaskAnnotationsAPI";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { makeStyles } from "@mui/styles";
import CustomizedSnackbars from "@/components/common/Snackbar";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: "1rem !important", // Adjust the font size as needed
  },
}));

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

const InstructionDrivenChatPage = ({chatHistory,setChatHistory}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const tooltipStyle = useStyles();
  let inputValue = "";
  const classes = headerStyle();
  const { taskId } = useParams();
  const [info, setInfo] = useState({});
  const [annotationId, setAnnotationId] = useState();
  const bottomRef = useRef(null);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
  const taskList = useSelector(
    (state) => state.GetTasksByProjectId?.data?.result,
  );

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const formatResponse = (response) => {
    response = String(response);
    const output = [];
    let count = 0;

    while (response) {
      response = response.trim();
      let index = response.indexOf("```");
      if (index == -1) {
        output.push({
          type: "text",
          value: response,
        });
        break;
      } else {
        count++;
        if (count % 2 !== 0) {
          output.push({
            type: "text",
            value: response.substring(0, index),
          });
          response = response.slice(index + 3);
        } else if (count % 2 === 0) {
          let next_space = response.indexOf("\n");
          let language = response.substring(0, next_space);
          response = response.slice(next_space + 1);
          let new_index = response.indexOf("```");
          let value = response.substring(0, new_index);
          output.push({
            type: "code",
            value: value,
            language: language,
          });
          response = response.slice(new_index + 3);
        }
      }
    }
    return output;
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
    const fetchData = async () => {
      const item = taskList?.filter((task) => task.id == taskId);
      if (item && item[0])
        setInfo({
          hint: item[0]?.data?.hint,
          examples: item[0]?.data?.examples,
          meta_info_intent: item[0]?.data?.meta_info_intent,
          instruction_data: item[0]?.data?.instruction_data,
          meta_info_domain: item[0]?.data?.meta_info_domain,
          meta_info_language: item[0]?.data?.meta_info_language,
        });
      const taskAnnotationsObj = new GetTaskAnnotationsAPI(taskId);
      const response = await fetch(taskAnnotationsObj.apiEndPoint(), {
        method: "GET",
        headers: taskAnnotationsObj.getHeaders().headers,
      });
      const data = await response.json();
      let modifiedChatHistory;
      if (data && [...data[0].result].length) {
        modifiedChatHistory = data[0].result.map((interaction) => {
          return {
            ...interaction,
            output: formatResponse(interaction.output),
          };
        });
        setChatHistory((prevChatHistory) => (data ? [...modifiedChatHistory] : []));
      }
      setAnnotationId(data[0].id);
      if (data && [...data[0].result].length) setShowChatContainer(true);
    };
    fetchData();
  }, [taskId, taskList]);

  const handleButtonClick = async () => {
    if (inputValue) {
      setLoading(true);
      const body = {
        annotation_notes: "",
        annotation_status: "labeled",
        result: inputValue,
        lead_time: 0.0,
        auto_save: "True",
        task_id:taskId,
      };
      const AnnotationObj = new PatchAnnotationAPI(annotationId, body);
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
          modifiedChatHistory = data.result.map((interaction) => {
            return {
              ...interaction,
              output: formatResponse(interaction.output),
            };
          });
        }
        else{
          setSnackbarInfo({
            open: true,
            message: data?.message,
            variant: "error",
          })
        }
        return data && data.result
          ? [...modifiedChatHistory]
          : [...prevChatHistory];
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: "please provide a prompt",
        variant: "error",
      })
    }
    setShowChatContainer(true);
  };

  const handleOnchange = (prompt) => {
    inputValue = prompt;
  };

  const renderChatHistory = () => {
    const chatElements = [];
    for (let index = 0; index < chatHistory.length; index++) {
      const message = chatHistory[index];
      chatElements.push(
        <Box
          sx={{
            paddingY: "1.5rem",
          }}
          key={index}
        >
          <Box
            sx={{
              width: "50vw",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "rgba(247, 184, 171, 0.2)",
            }}
          >
            <Avatar
              alt="user_profile_pic"
              variant="contained"
              src={
                loggedInUserData?.profile_photo
                  ? loggedInUserData.profile_photo
                  : ""
              }
              className={classes.avatar}
              sx={{
                marginRight: "1rem",
              }}
            />
            <Box>{message.prompt}</Box>
          </Box>
          <Box
            sx={{
              width: "50vw",
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              padding: "3.5rem 1.5rem 0rem",
              borderRadius: "0.5rem",
            }}
          >
            <Image
              width={50}
              height={50}
              src="https://i.imgur.com/56Ut9oz.png"
              alt="Bot Avatar"
              style={{
                marginRight: "1rem",
              }}
            />
            <Box className="flex-col">
              {message?.output?.map((segment, index) =>
                segment.type == "text" ? (
                  <ReactMarkdown
                    key={index}
                    className="flex-col overflow-x-scroll"
                  >
                    {segment.value}
                  </ReactMarkdown>
                ) : (
                  <>
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignContent: "center",
                        paddingX: "1rem",
                        borderRadius: "5px 5px 0 0",
                        backgroundColor: "#c5c5c5",
                        paddingY: "0.8rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#4e4e4e",
                          fontWeight: "500",
                        }}
                      >
                        {segment.language}
                      </p>
                      <Tooltip
                        title="Copy code to clipboard"
                        classes={{ tooltip: tooltipStyle.tooltip }}
                      >
                        <button
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "end",
                          }}
                          onClick={copyToClipboard.bind(null, segment.value)}
                        >
                          <ContentPasteIcon
                            sx={{
                              fontSize: "1.4rem",
                              color: "#4e4e4e",
                            }}
                          />
                          <p
                            style={{
                              paddingLeft: "0.2rem",
                              fontSize: "1rem",
                              color: "#4e4e4e",
                              fontWeight: "500",
                            }}
                          >
                            Copy
                          </p>
                        </button>
                      </Tooltip>
                    </Box>
                    <SyntaxHighlighter
                      language={segment.language}
                      style={gruvboxDark}
                      className="code"
                      customStyle={codeStyle}
                    >
                      {segment.value}
                    </SyntaxHighlighter>
                  </>
                ),
              )}
            </Box>
          </Box>
        </Box>,
      );
    }
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
              {info.meta_info_language}
            </Typography>

            <Button variant="outlined" onClick={handleClose}>
              {translate("modalButton.close")}
            </Button>
          </Box>
        </Modal>
      </>
    );
  };

  return (
    <>
      {renderSnackBar()}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              borderRadius: "20px",
              padding: "10px",
              marginTop: "1.5rem",
              backgroundColor: "rgba(247, 184, 171, 0.2)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h3"
                align="center"
                sx={{
                  color: "#636363",
                  fontSize: "2rem",
                  fontWeight: "800",
                  marginRight: "0.5rem",
                }}
              >
                {translate("typography.instructions")}
              </Typography>

              <Tooltip title="Hint and Metadata">
                <IconButton onClick={handleOpen}>
                  <TipsAndUpdatesIcon color="primary.dark" fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography
              paragraph={true}
              sx={{
                fontSize: "1.2rem",
                padding: "0.5rem 1rem 0",
                minHeight: "6rem",
                maxHeight: "6rem",
                overflowY: "scroll",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {info.instruction_data}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            margin: "0.8rem 0",
            overflowY: "scroll",
            minHeight: "39rem",
            maxHeight: "39rem",
            borderRadius: "20px",
            backgroundColor: "#FFF",
            paddingLeft: "0px !important",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100% !important",
              padding: "1rem 0 4rem",
            }}
          >
            {showChatContainer ? renderChatHistory() : null}
          </Box>
          <div ref={bottomRef} />
        </Grid>
        <Grid item xs={12} sx={{ boxSizing: "border-box" }}>
          <Textarea
            handleButtonClick={handleButtonClick}
            handleOnchange={handleOnchange}
            size={12}
            grid_size={"80.6rem"}
            class_name={""}
            loading={loading}
          />
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
