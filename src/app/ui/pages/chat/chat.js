"use client";
import "./chat.css";
import Link from "next/link";
import Image from "next/image";
import { welcomeText, card1, card2, card3 } from './config';
import { useSelector } from "react-redux";
import headerStyle from "@/styles/Header";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import Textarea from "@/components/Chat/TextArea";
import { translate } from "@/config/localisation";
import { useState, useEffect, useRef } from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import PostChatLogAPI from "@/app/actions/api/UnauthUserManagement/PostChatLogAPI";
import PostChatInteractionAPI from "@/app/actions/api/UnauthUserManagement/PostChatInteractionAPI";

const Chat = () => {
  /* eslint-disable react-hooks/exhaustive-deps */
  let inputValue = "";
  const classes = headerStyle();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState(() => {
    return JSON.parse(sessionStorage.getItem("interaction_json")) || [];
  });
  const [showChatContainer, setShowChatContainer] = useState(
    chatHistory.length > 0 ? true : false,
  );
  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    window.sessionStorage.setItem(
      "interaction_json",
      JSON.stringify(chatHistory),
    );
  }, [chatHistory]);

  const handleButtonClick = async () => {
    if (inputValue) {
      setLoading(true);
      const body = {
        message: inputValue,
      };
      const ChatInteractionObj = new PostChatInteractionAPI(body);
      const interactionRes = await fetch(ChatInteractionObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(ChatInteractionObj.getBody()),
        headers: ChatInteractionObj.getHeaders().headers,
      });
      const interactionData = await interactionRes.json();
      interactionData &&
        setChatHistory((prev) => [
          ...prev,
          {
            prompt: inputValue,
            output: interactionData.message,
          },
        ]);

      const chatLogBody = {
        message: inputValue,
      };
      const ChatLogObj = new PostChatLogAPI(chatLogBody);
      const logRes = await fetch(ChatLogObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(ChatLogObj.getBody()),
        headers: ChatLogObj.getHeaders().headers,
      });
      const logData = await logRes.json();
      logData?.message.includes("successfully") ? setLoading(false) : null;
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

  return (
    <>
      <Box
        sx={{ alignItems: "center" }}
        className="pt-4 pb-2 flex justify-between px-20"
      >
        <Image
          onClick={() => navigate("/")}
          alt="Anudesh"
          src="https://i.imgur.com/56Ut9oz.png"
          width={90}
          height={90}
        />
        <Box className="flex gap-6">
          <Link
            className="text-xl font-medium hover:underline"
            href="https://github.com/AI4Bharat"
          >
            Codebase
          </Link>
          <Link className="text-xl font-medium hover:underline" href="#">
            Analytics
          </Link>
        </Box>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!showChatContainer && (
          <Grid item xs={8}>
            <Box
              sx={{
                borderRadius: "20px",
                padding: "10px",
                backgroundColor: "rgba(247, 184, 171, 0.2)",
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                paddingX: "4rem",
              }}
            >
              <Image
                alt="Anudesh"
                src="https://i.imgur.com/56Ut9oz.png"
                width={50}
                height={50}
                className="w-[8rem] h-[8rem]"
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "start",
                  marginLeft: "1rem",
                  paddingY: "1rem",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    color: "#E95923",
                  }}
                >
                  { translate('general_chat_namaste') }
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  { translate('general_chat_welcome') }
                </Typography>

                <Typography
                  paragraph={true}
                  sx={{
                    fontSize: "1.2rem",
                    maxHeight: "6rem",
                    overflowY: "scroll",
                  }}
                >
                  { welcomeText.content }
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}

        <Grid
          item
          xs={8}
          sx={{
            margin: "0.8rem 0",
            overflowY: "scroll",
            minHeight: showChatContainer ? "45rem" : "39rem",
            maxHeight: showChatContainer ? "45rem" : "39rem",
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
            {showChatContainer ? (
              renderChatHistory()
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "evenly",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    marginX: "10px",
                    width: "33%",
                    borderRadius: "20px",
                    backgroundColor: "rgba(247, 184, 171, 0.2)",
                    padding: "2.5rem",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#E95923",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    { card1.heading }
                  </Typography>

                  <Typography
                    sx={{
                      paddingTop: "0.8rem",
                    }}
                  >
                    { card1.content }
                  </Typography>
                </Box>
                <Box
                  sx={{
                    marginX: "10px",
                    width: "33%",
                    borderRadius: "20px",
                    backgroundColor: "rgba(247, 184, 171, 0.2)",
                    padding: "2.5rem",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#E95923",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    { card2.heading }
                  </Typography>

                  <Typography
                    sx={{
                      paddingTop: "0.8rem",
                    }}
                  >
                    { card2.content }
                  </Typography>
                </Box>
                <Box
                  sx={{
                    marginX: "10px",
                    width: "33%",
                    borderRadius: "20px",
                    backgroundColor: "rgba(247, 184, 171, 0.2)",
                    padding: "2.5rem",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#E95923",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    { card3.heading }
                  </Typography>

                  <Typography
                    sx={{
                      paddingTop: "0.8rem",
                    }}
                  >
                    { card3.content }
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          <div ref={bottomRef} />
        </Grid>

        <Grid item xs={8} sx={{ boxSizing: "border-box" }}>
          <Textarea
            handleButtonClick={handleButtonClick}
            handleOnchange={handleOnchange}
            size={8}
            grid_size={"100vw"}
            class_name="textarea_grid"
            loading={loading}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Chat;
