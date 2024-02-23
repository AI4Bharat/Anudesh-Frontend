"use client";
import "./chat.css";
import { useState,   useRef,  useEffect } from "react";
import { Grid, Box, Avatar, Typography } from "@mui/material";
import Image from "next/image";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import headerStyle from "@/styles/Header";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import "./chat.css";
import Spinner from "@/components/common/Spinner"
import { ContactlessOutlined } from "@mui/icons-material";
import GetTaskDetailsAPI from "@/app/actions/api/Dashboard/getTaskDetails";
import { fetchAnnotationsTask } from "@/Lib/Features/projects/getAnnotationsTask";
import GetNextProjectAPI from "@/app/actions/api/Projects/GetNextProjectAPI";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";
import { setTaskDetails } from "@/Lib/Features/getTaskDetails";

const dummyInstruction =
  "Imagine you are having a conversation with a specialized Indian chatbot specifically designed to guide and assist you regarding activist matters in India. You can ask any question or seek any information related to various types of activism, campaigns, influential activists, etc. specific to Indian context. The more you interact and converse with the chatbot, the better it can understand your needs and provide precise assistance, advice or information. Use simple, clear language when addressing the chatbot, just as you would speak with another person.Please make your interactions in english.";

const InstructionDrivenChatPage = () => {
  let inputValue = "";
  const classes = headerStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projectId, taskId } = useParams();
  const user = useSelector((state) => state.getLoggedInData?.data);
  let labellingMode = localStorage.getItem("labellingMode");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [disableSkipButton, setdisableSkipButton] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);
  const [NextData, setNextData] = useState("");

  const [annotations, setAnnotations] = useState([]);

  const annotationNotesRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const reviewNotesRef = useRef(null);
  const [disableBtns, setDisableBtns] = useState(false);
  const [disableUpdateButton, setDisableUpdateButton] = useState(false);
  const [taskData, setTaskData] = useState()
  const AnnotationsTaskDetails = useSelector(
    (state) => state.getAnnotationsTask?.data
  );
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://backend.dev.anudesh.ai4bharat.org/task/10/annotations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem(
                "anudesh_access_token",
              )}`,
            },
          },
        );
        const data = await response.json();
        setChatHistory((prevChatHistory) => [...data[0].result]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    setShowChatContainer(true);
  }, []);
  const handleButtonClick = () => {
    fetch("https://backend.dev.anudesh.ai4bharat.org/annotation/7/", {
      method: "PATCH",
      body: JSON.stringify({
        annotation_notes: "This is a dummy note",
        annotation_status: "labeled",
        result: inputValue,
        lead_time: 0.0,
        auto_save: "True",
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("anudesh_access_token")}`,
      },
    }).then((res) => {
      res.json().then((data) => {
        if (inputValue) {
          if (data.result[data.result.length - 1].output) {
            console.log('response', data.result[data.result.length - 1].output, inputValue);
            setChatHistory((prev) => {
              [...prev,
              {
                "prompt": inputValue,
                "output": data.result[data.result.length - 1].output,
              }]
            });
            console.log("Chat history", chatHistory);
          }
        } else {
          alert("Please provide a prompt.");
        }
      });
    });
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
        <>
          <div className="w-[40vw] flex justify-start items-center space-x-6 rounded-lg py-7">
            <Avatar
              alt="user_profile_pic"
              variant="contained"
              src={
                loggedInUserData?.profile_photo
                  ? loggedInUserData.profile_photo
                  : ""
              }
              className={classes.avatar}
            />
            <div>{message.prompt}</div>
          </div>
          <div className="w-[40vw] flex justify-start items-center space-x-6 rounded-lg py-7 bg-orange-100">
            <Image
              width={50}
              height={50}
              src="https://i.imgur.com/56Ut9oz.png"
              alt="Bot Avatar"
            />
            <div>{message.output}</div>
          </div>
        </>,
      );
    }
    return chatElements;
  };

  return (

    <Grid container spacing={2}>
       {loading && <Spinner />} 
      <Grid item xs={12}>
        <Box
          sx={{
            // borderRadius: "20px",
            padding: "10px",
            backgroundColor: "#FFF",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              color: "#636363",
              fontSize: "2rem",
              fontWeight: "800",
            }}
          >
            {translate("typography.instructions")}
          </Typography>
          <Typography
            paragraph={true}
            align="left"
            sx={{
              fontSize: "1.2rem",
              padding: "0.5rem 1rem 0",
              maxHeight: "6rem",
              overflowY: "scroll",
            }}
          >
            {dummyInstruction}
          </Typography>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          marginTop: "0.8rem",
          overflowY: "scroll",
          minHeight: "38rem",
          maxHeight: "38rem",
          // borderRadius: "20px",
          backgroundColor: "#FFF",

        }}
      >
       
        <Box>
          {showChatContainer ? (
            <div className="flex flex-col items-center border-8">
              {renderChatHistory()}
            </div>
          ) : (
            <Grid>GIF</Grid>
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Textarea
          handleButtonClick={handleButtonClick}
          handleOnchange={handleOnchange}
        />
      </Grid>
    </Grid>
  );
};

export default InstructionDrivenChatPage;
