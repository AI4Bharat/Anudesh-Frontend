"use client";
import "./chat.css";
import Link from "next/link";
import Image from "next/image";
import { welcomeText, cardData } from "./config";
import { useSelector } from "react-redux";
import headerStyle from "@/styles/Header";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import Textarea from "@/components/Chat/TextArea";
import { translate } from "@/config/localisation";
import { useState, useEffect, useRef } from "react";
import { Avatar, Box, Grid, Typography, Tooltip } from "@mui/material";
import PostChatLogAPI from "@/app/actions/api/UnauthUserManagement/PostChatLogAPI";
import PostChatInteractionAPI from "@/app/actions/api/UnauthUserManagement/PostChatInteractionAPI";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { makeStyles } from '@mui/styles';
import CustomizedSnackbars from "@/components/common/Snackbar";
import { motion } from "framer-motion";
import bgChat from "../../../../assets/chat-bg.jpg";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: '1rem !important', // Adjust the font size as needed
  },
}));

const codeStyle = {
  borderRadius: "0xp 0px 5px 5px",
  width: "45vw",
  overflowX: "scroll",
  fontSize: "1.1rem",
};

// Motion Variants for staggered animation
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.5, ease: "easeOut" },
  }),
};

const Chat = () => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const tooltipStyle = useStyles();
  const [inputValue, setInputValue] = useState("");
  const classes = headerStyle();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);


  const [showChatContainer, setShowChatContainer] = useState(
    chatHistory.length > 0 ? true : false,
  );

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);

  useEffect(() => {
    const storedHistory = JSON.parse(sessionStorage.getItem("interaction_json"));
    if (storedHistory && storedHistory.length > 0) {
      setChatHistory(JSON.parse(storedHistory));
      setShowChatContainer(true);
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      sessionStorage.setItem("interaction_json", JSON.stringify(chatHistory));
    }
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

  const formatPrompt = (prompt) => {
    const lines = prompt.split('\n');
    const markdownString = lines.join('  \n');
    return markdownString;
  }

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
            output: formatResponse(interactionData.message),
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
    setInputValue("");
    setShowChatContainer(true);
  };

  const handleOnchange = (prompt) => {
    setInputValue(prompt);
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
      })
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Failed to copy to clipboard!",
        variant: "error",
      });
    }
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
            <ReactMarkdown className="flex-col">{formatPrompt(message.prompt)}</ReactMarkdown>
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
              priority
            />
            <Box className="flex-col">
              {message.output.map((segment, index) =>
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
                      <Tooltip title="Copy code to clipboard" classes={{ tooltip: tooltipStyle.tooltip }}>
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

  return (
    <>
      {renderSnackBar()}
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
          priority
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
                priority
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
                  {translate("general_chat_namaste")}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  {translate("general_chat_welcome")}
                </Typography>

                <Typography
                  paragraph={true}
                  sx={{
                    fontSize: "1.2rem",
                    maxHeight: "6rem",
                    overflowY: "scroll",
                  }}
                >
                  {welcomeText.content}
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
              backgroundImage: `url(${bgChat})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              minHeight: "58vh",
            }}
          >
            {showChatContainer ? (
              renderChatHistory()
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 3,
                  width: "100%",
                  flexWrap: "wrap",
                  padding: "20px",
                }}
              >
                {cardData.map((card, index) => (
                  <motion.div
                    key={index}
                    custom={index} // Pass index for staggered delay
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "300px",
                      padding: "2rem",
                      borderRadius: "20px",
                      backgroundColor: "rgba(247, 184, 171, 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#E95923",
                        fontWeight: "600",
                        fontSize: "1.2rem",
                      }}
                    >
                      {card.heading}
                    </Typography>

                    <Typography sx={{ paddingTop: "0.8rem" }}>{card.content}</Typography>
                  </motion.div>
                ))}
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
            inputValue={inputValue}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Chat;
