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

const InstructionDrivenChatPage = () => {
    /* eslint-disable react-hooks/exhaustive-deps */
  let inputValue = "";
  const classes = headerStyle();
  const { taskId } = useParams();
  const [chatHistory, setChatHistory] = useState([{}]);
  const [info, setInfo] = useState({});
  const [annotationId, setAnnotationId] = useState();
  const bottomRef = useRef(null);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      const item = taskList.filter((task) => task.id == taskId);
      if (item && item[0])
        setInfo({
          instruction_data: item[0]?.data?.instruction_data,
          hint: item[0]?.data?.hint,
          examples: item[0]?.data?.examples,
          meta_info_domain: item[0]?.data?.meta_info_domain,
          meta_info_language: item[0]?.data?.meta_info_language,
          meta_info_intent: item[0]?.data?.meta_info_intent,
        });
      const taskAnnotationsObj = new GetTaskAnnotationsAPI(taskId);
      const response = await fetch(taskAnnotationsObj.apiEndPoint(), {
        method: "GET",
        headers: taskAnnotationsObj.getHeaders().headers,
      });
      const data = await response.json();
      setChatHistory((prevChatHistory) => (data ? [...data[0].result] : []));
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
      };
      const AnnotationObj = new PatchAnnotationAPI(annotationId, body);
      const res = await fetch(AnnotationObj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(AnnotationObj.getBody()),
        headers: AnnotationObj.getHeaders().headers,
      });
      const data = await res.json();
      setChatHistory((prevChatHistory) => {
        data && data.result && setLoading(false);
        return data && data.result ? [...data.result] : [...prevChatHistory];
      });
    } else {
      alert("Please provide a prompt.");
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
              paddingBottom: "1.5rem",
              paddingX: "1.5rem",
              borderRadius: "0.5rem",
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
              alignItems: "center",
              paddingY: "1.75rem",
              paddingX: "1.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "rgba(247, 184, 171, 0.2)",
              overflowX: "scroll",
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
            <ReactMarkdown className="flex-col">{message.output}</ReactMarkdown>
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
            grid_size={'80.6rem'}
            class_name={''}
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