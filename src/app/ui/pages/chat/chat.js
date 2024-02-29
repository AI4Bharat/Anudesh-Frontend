"use client";
import "./chat.css";
import { useState } from "react";
import { Grid, IconButton, Avatar, Tooltip, Typography } from "@mui/material";
import { InfoOutlined } from "@material-ui/icons";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Image from "next/image";
import { useRouter } from "next/navigation";

const dummyData = [
    {
      "prompt": "Hii Anudesh",
      "output": "Hello! How can I assist you today?"
    },
    {
      "prompt": "What is a computer?",
      "output": "Computer is an electronic device"
    },
    {
      "prompt": "What is it used for?",
      "output": "It is used for computation"
    },
    {
      "prompt": "Thanks, any additional points?",
      "output": "No"
    }
  ];


const Chat = () =>{

    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [showChatContainer, setShowChatContainer] = useState(false);
    const router = useRouter();
    const handleButtonClick = () => {
        if (inputValue) {
          const response = dummyData.find(item => item.prompt === inputValue);
          if (response) {
            setChatHistory(prev => [...prev, { message: inputValue, isUser: true }, { message: response.output, isUser: false }]);
          } else {
            setChatHistory(prev => [...prev, { message: inputValue, isUser: true }, { message: "I'm sorry, I don't understand.", isUser: false }]);
          }
    
          setInputValue('');
          setShowChatContainer(true);
        } else {
          alert('Please provide a prompt.');
        }
      };

    const renderChatHistory = () => {
      const chatElements = [];
      for (let index = 0; index < chatHistory.length; index++) {
      const message = chatHistory[index];
      const isUser = message.isUser;
      const boxClassName = isUser
        ? "box1 flex w-[40vw] py-7 justify-start items-center space-x-6"
        : "box2 bg-orange-100 flex w-full py-7 justify-center items-center";

      chatElements.push(
        <div key={index} className={boxClassName}>
          {isUser ? (
            <>
              <div>
                <Avatar />
              </div>
              <div>{message.message}</div>
            </>
          ) : (
            <div className="w-[40vw] flex justify-start items-center space-x-6">
              <Image alt="Anudesh"
                src="https://i.imgur.com/56Ut9oz.png"
                className="w-10 h-10"
              />
              <div>{message.message}</div>
            </div>
          )}
        </div>,
      );
    }
    return chatElements;
  };

  return (
    <>
      <div className="relative z-0 flex flex-col h-full w-full overflow-hidden">
        <div className="flex justify-between w-full">
          <div>
            <Image alt="Anudesh"
              src="https://i.imgur.com/56Ut9oz.png"
              className="mt-4 ml-10 h-[61px] w-[60px]"
              onClick={() => router.push("/home")}
            ></Image>
          </div>
          <div className="flex">
            <Image alt="Anudesh"
              src="https://i.imgur.com/FGmAyjz.png"
              className="w-6 h-6 mt-11"
            />
            <Image alt="Anudesh"
              src="https://i.imgur.com/A3Rcbqe.jpeg"
              className="w-6 h-6 mt-11 ml-4"
            />
            <h3 className="text-orange-600 text-xs font-bold mt-14">100</h3>
            <InfoOutlined className="info-outline" />
            <SettingsOutlinedIcon className="settings" />
            <Avatar className="user-profile" />
          </div>
        </div>
        <div className="w-[98%] h-full overflow-hidden mx-auto bg-stone-600 bg-opacity-5 rounded-2xl flex flex-col mt-4">
          {showChatContainer ? (
            <>
              <div className="w-auto h-36 mt-12 mx-auto bg-white rounded-2xl flex flex-row gap-2">
                <Image alt="Anudesh"
                  src="https://i.imgur.com/56Ut9oz.png"
                  className="my-4 mx-5 h-[6.2rem] w-[6rem]"
                ></Image>
                <div>
                  <h3 className="text-3xl text-orange-600 font-bold mt-8">
                    Namaste
                  </h3>
                  <p className="text-sm text-[#6c5f5b] font-normal mr-16">
                    Tell me what’s on your mind or pick a suggestion. I have
                    limitations and won't always get it right, but your{" "}
                    <br></br> feedback will help me to improve.
                  </p>
                </div>
              </div>
              <div className="w-full flex items-center flex-col overflow-auto h-full">
                {renderChatHistory()}
              </div>
              <div className="w-auto mx-auto my-10 flex">
                <input
                  className="myInput"
                  value={inputValue}
                  placeholder="Enter a prompt here"
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <IconButton onClick={handleButtonClick}>
                  <Image 
                    src="https://i.imgur.com/2sWOT6F.png"
                    className=" w-5 h-4 mt-2"
                    alt="Send Icon"
                  />
                </IconButton>
              </div>
            </>
          ) : (
            <>
              <div className="w-auto h-36 mt-12 mx-auto bg-white rounded-2xl flex flex-row gap-2">
                <Image 
                  alt="anudesh"
                  src="https://i.imgur.com/56Ut9oz.png"
                  className="mt-6 mx-5 h-[6.2rem] w-[6rem]"
                ></Image>
                <div>
                  <h3 className="text-3xl text-orange-600 font-bold mt-8">
                    Namaste
                  </h3>
                  <p className="text-sm text-[#6c5f5b] font-normal mr-16">
                    Tell me what’s on your mind or pick a suggestion. I have
                    limitations and won't always get it right, but your{" "}
                    <br></br> feedback will help me to improve.
                  </p>
                </div>
              </div>
              <div className="w-auto mx-auto grid grid-cols-3 gap-9 mt-16">
                <div className="div-grid flex flex-col">
                  <h3 className="grid-heading">What is Anudesh?</h3>
                  <p className="text-xl mx-6">
                    data leta hai multilingual(indic), will be used for model
                    training for indic llms, 22, open source - model and data
                  </p>
                </div>
                <div className="div-grid">
                  <h3 className="grid-heading">How can you help?</h3>
                  <p className="text-xl mx-20 my-16">GIF</p>
                </div>
                <div className="div-grid">
                  <h3 className="grid-heading">Why Contribute?</h3>
                  <p className="text-xl mx-20 my-16">Graph</p>
                </div>
              </div>
              <div className="w-auto mx-auto mt-56 flex">
                <input
                  className="myInput"
                  value={inputValue}
                  placeholder="Enter a prompt here"
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <IconButton onClick={handleButtonClick}>
                  <Image alt="Anudesh"
                    src="https://i.imgur.com/2sWOT6F.png"
                    className=" w-5 h-4 mt-2"
                  />
                </IconButton>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
