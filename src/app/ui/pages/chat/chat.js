"use client";
import "./chat.css";
import Link from "next/link";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Spinner from "@/components/common/Spinner";
import Textarea from "@/components/Chat/TextArea";
import headerStyle from "@/styles/Header";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const navigate = useNavigate();
  let inputValue = "";
  const classes = headerStyle();
  const { taskId } = useParams();
  const [chatHistory, setChatHistory] = useState([{}]);
  const [annotationId, setAnnotationId] = useState();
  const bottomRef = useRef(null);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [loading, setLoading] = useState(false);
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
  const taskList = useSelector(
    (state) => state.GetTasksByProjectId?.data?.result,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

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

  return (
    <>
      <Box
        sx={{ alignItems: "center" }}
        className="pt-4 pb-2 flex justify-between px-20">
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
        { !showChatContainer && <Grid item xs={8}>
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
                {"Namaste"}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                {"Welcome to Anudesh"}
              </Typography>

              <Typography
                paragraph={true}
                sx={{
                  fontSize: "1.2rem",
                  // minHeight: "6rem",
                  maxHeight: "6rem",
                  overflowY: "scroll",
                }}
              >
                {
                  "This page allows users to engage with the model freely, capturing interactions efficiently in an ordered tree format."
                }
              </Typography>
            </Box>
          </Box>
        </Grid>
        }

        <Grid
          item
          xs={8}
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
                    backgroundColor: 'rgba(247, 184, 171, 0.2)',
                    padding: '2.5rem',
                  }}
                >
                  <Typography sx={{
                    color: '#E95923',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                    What is Anudesh?
                  </Typography>

                  <Typography sx={{
                    paddingTop: '0.8rem',
                  }}>
                    Anudesh is an open-source platform dedicated to advancing the development of state-of-the-art Language Model Models for Indian languages. Our mission is to democratize access to advanced natural language processing technologies by creating high-quality conversational data. Create an account and get started today!
                  </Typography>
                </Box>
                <Box
                  sx={{
                    marginX: "10px",
                    width: "33%",
                    borderRadius: "20px",
                    backgroundColor: 'rgba(247, 184, 171, 0.2)',
                    padding: '2.5rem',
                  }}
                >
                  <Typography sx={{
                    color: '#E95923',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                    How Can You Help?
                  </Typography>

                  <Typography sx={{
                    paddingTop: '0.8rem',
                  }}>
                    You can help us by getting by exploring our projects and contributing to our repositories. We look forward to collaborating with you! You can help us collect data based on instructiional prompts, rate the performance of models, evaluate model responses, do preferential ranking amongst models used, and analyse data using various metrics.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    marginX: "10px",
                    width: "33%",
                    borderRadius: "20px",
                    backgroundColor: 'rgba(247, 184, 171, 0.2)',
                    padding: '2.5rem',
                  }}
                >
                  <Typography sx={{
                    color: '#E95923',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                    Why Should You Contribute?
                  </Typography>

                  <Typography sx={{
                    paddingTop: '0.8rem',
                  }}>
                    By contributing to Anudesh, you can play a vital role in enhancing language understanding and generation capabilities in Indian languages. Whether you are a linguist, developer, or language enthusiast, there are many ways to get involved and make an impact. Join us in our journey to empower individuals and communities.
                  </Typography>
                </Box>
              </Box>
            )}
            {loading && <Spinner />}
          </Box>
          <div ref={bottomRef} />
        </Grid>

        <Grid item xs={8} sx={{ boxSizing: "border-box" }}>
          <Textarea
            handleButtonClick={handleButtonClick}
            handleOnchange={handleOnchange}
            size={8}
            grid_size={'100vw'}
            class_name='textarea_grid'
          />
        </Grid>
        
      </Grid>
    </>
  );
};

export default Chat;
