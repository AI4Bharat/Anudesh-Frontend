"use client";
import "./home.css";
import { useEffect } from "react";
import Image from "next/image";
import { Link, useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import RateReviewIcon from "@mui/icons-material/RateReview";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CompareIcon from "@mui/icons-material/Compare";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import { Box, Grid, Stack, Card, CardContent, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Carousel from "react-material-ui-carousel";
import IntroStyle from "@/styles/IntroStyle";
import {
  dynamicCard,
  footer,
  operationalModes,
  info,
  banner,
  operationalDynamics,
} from "./config";
import Svg from "@/assets/home_page1.svg";

const DynamicCards = ({ card }) => {
  const classes = IntroStyle();
  const imageSrc = card.src;

  const DynamicIcon = () => {
    switch (imageSrc) {
      case "Chat":
        return (
          <ChatIcon
            sx={{
              color: "#EA5923",
              fontSize: "8rem",
              paddingRight: "1rem",
            }}
          />
        );
      case "IntegrationInstructions":
        return (
          <IntegrationInstructionsIcon
            sx={{
              color: "#EA5923",
              fontSize: "8rem",
              paddingRight: "1rem",
            }}
          />
        );
      case "RateReview":
        return (
          <RateReviewIcon
            sx={{
              color: "#EA5923",
              fontSize: "8rem",
              paddingRight: "1rem",
            }}
          />
        );
      case "QuestionAnswer":
        return (
          <QuestionAnswerIcon
            sx={{
              color: "#EA5923",
              fontSize: "8rem",
              paddingRight: "1rem",
            }}
          />
        );
      case "Compare":
        return (
          <CompareIcon
            sx={{
              color: "#EA5923",
              fontSize: "8rem",
              paddingRight: "1rem",
            }}
          />
        );
      case "PsychologyAlt":
        return (
          <PsychologyAltIcon
            sx={{
              color: "#EA5923",
              fontSize: "8rem",
              paddingRight: "1rem",
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card
      variant="outlined"
      className={classes.dynamicCardsWrapper}
      sx={{ cursor: "pointer" }}
    >
      <CardContent
        sx={{
          padding: "32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: { lg: "block", sm: "none", xs: "none" } }}>
          <DynamicIcon />
        </Box>
        <Box>
          <Typography className={classes.heading} fontWeight="bold">
            {card.name}
          </Typography>
          <Typography
            className={classes.dynamicContent}
            sx={{ fontSize: "small" }}
          >
            {card.content}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("interaction_json", JSON.stringify([]));
    }
  }, []);

  return (
    // {page div}
    <>
      {/* {header and first page} */}
      <div className="pb-40 bg-gradient-to-tl from-orange-light to-orange-dark-100 h-full flex   flex-col">
        <div className="py-8 flex justify-between px-10 top-0 lg:px-20">
          <img
            alt="Anudesh"
            src="https://i.imgur.com/56Ut9oz.png"
            className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24"
          />

          <div className="flex gap-4 md:gap-6 lg:gap-8">
            <button
              onClick={() => navigate("/login")}
              className="text-base font-medium hover:underline text-xs md:text-lg lg:text-2xl"
            >
              {banner.logIn}
            </button>
            <button
              onClick={() =>
                window.open("https://github.com/AI4Bharat/Anudesh", "_blank")
              }
              className="text-base font-medium hover:underline text-xs md:text-lg lg:text-2xl"
            >
              Codebase
            </button>
            <button className="text-base font-medium hover:underline text-xs md:text-lg lg:text-2xl">
              Analytics
            </button>
          </div>
        </div>

        <div className="w-full px-10 py-10 flex items-center justify-center flex-col-reverse gap-8 md:flex-row lg:px-20 md:pt-40 lg:pt-0">
          <div className="w-full md:w-3/5">
            <div className="text-orange-600 mb-8 text-2xl font-semibold md:text-4xl md:font-bold lg:text-5xl">
              {banner.heading}
            </div>
            <div className="text-orange-600 text-base mb-8 md:text-xl lg:text-2xl">
              {banner.subheading}
            </div>
            <div className="flex gap-8">
              <Link to={"https://www.youtube.com/watch?v=6k7fk3mCk9A"}>
                <button className="bg-orange-600 text-white text-l p-4 rounded-md hover:bg-white hover:text-orange-600 border border-orange-600">
                  {banner.demo}
                </button>
              </Link>

              {/* <button
                onClick={() => navigate("/login")}
                className="text-orange-600 bg-white text-xl p-4 rounded-md border border-orange-600 hover:bg-orange-600 hover:text-white"
              >
                {banner.logIn}
              </button> */}
              <button
                onClick={() => navigate("/chat")}
                className="text-orange-600 bg-white text-l p-4 rounded-md border border-orange-600 hover:bg-orange-600 hover:text-white"
              >
                {banner.chat}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center md:w-2/5">
            <img
              alt="Anudesh"
              src="https://i.imgur.com/56Ut9oz.png"
              className="w-[150px] h-[150px] md:w-full md:h-full lg:w-full lg:h-full" // had to use custom, bcz tailwind directly jumps after 24 to 28
            ></img>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center text-center py-10 px-10 md:py-20 lg:py-40 gap-10">
        <Image
          className="hideOnMobile md:w-2/5"
          alt="Anudesh"
          src={Svg}
          width={400}
          height={400}
        ></Image>
        <div className="w-full lg:w-3/5">
          <div className="text-orange-600 text-2xl font-semibold md:text-4xl md:font-bold lg:text-5xl">
            {info.question}
          </div>
          <div className="pt-8">
            <div className="text-xl font-semibold text-gray-700 pb-4 md:text-xl lg:text-3xl">
              {info.subquestion}
            </div>
            <Typography
              variant="body1"
              color="rgb(107 114 128)"
              fontWeight={300}
              sx={{
                fontSize: {
                  xs: "18px", // Font size for small screens
                  sm: "22px", // Font size for ≥ 600px
                  md: "24px", // Font size for ≥ 900px
                  lg: "26px", // Font size for ≥ 1200px
                },
              }}
              className="w-full"
            >
              {info.content}
            </Typography>
          </div>
        </div>
      </div>

      <div className="xl: text-center pb-12 px-10">
        <div className="text-gray-700 text-2xl  font-semibold md:text-4xl md:font-bold lg:text-5xl">
          {operationalModes.heading}
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={12} lg={6}>
              <Stack
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AdminPanelSettingsIcon
                  sx={{
                    paddingTop: "2rem",
                    color: "#EA5923",
                    fontSize: "12rem",
                  }}
                />
                <Typography color="rgb(55 65 81)" variant="h3" fontWeight={500}>
                  {operationalModes.admin_mode}
                </Typography>
                <Typography
                  color="rgb(107 114 128)"
                  fontWeight={300}
                  sx={{
                    fontSize: {
                      xs: "18px", // Font size for small screens
                      sm: "22px", // Font size for ≥ 600px
                      md: "24px", // Font size for ≥ 900px
                      lg: "26px", // Font size for ≥ 1200px
                    },
                  }}
                  variant="body1"
                >
                  {operationalModes.admin_content}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <Stack
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SupervisorAccountIcon
                  sx={{
                    color: "#EA5923",
                    fontSize: "12rem",
                  }}
                />
                <Typography color="rgb(55 65 81)" variant="h3" fontWeight={500}>
                  {operationalModes.user_mode}
                </Typography>
                <Typography
                  color="rgb(107 114 128)"
                  fontWeight={300}
                  variant="body1"
                  sx={{
                    fontSize: {
                      xs: "18px", // Font size for small screens
                      sm: "22px", // Font size for ≥ 600px
                      md: "24px", // Font size for ≥ 900px
                      lg: "26px", // Font size for ≥ 1200px
                    },
                  }}
                >
                  {operationalModes.user_content}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </div>

      <div clasNsame="text-center py-10 ">
        <div className="text-center text-gray-700 text-2xl pb-10 font-semibold md:text-4xl md:font-bold lg:text-5xl">
          {operationalDynamics.heading}
        </div>
        <Carousel
          stopAutoPlayOnHover
          animation="slide"
          navButtonsAlwaysVisible
          duration="1200"
          interval="2800"
          fullHeightHover
          navButtonsProps={{
            style: { borderRadius: "50%", width: "35px", height: "35px" },
          }}
          navButtonsWrapperProps={{
            style: { top: "-35px" },
          }}
          NextIcon={<ArrowForwardIosIcon />}
          PrevIcon={<ArrowBackIosNewIcon />}
          sx={{
            width: "90%",
            margin: "auto",
            height: "auto",
          }}
        >
          {dynamicCard.map((item, i) => (
            <DynamicCards key={i} card={item} />
          ))}
        </Carousel>
      </div>

      <div className="text-center bg-stone-800 py-6">
        <Typography
          className="text-white"
          sx={{ fontWeight: "bold", fontSize: "small" }}
        >
          {footer.content}
        </Typography>
      </div>
    </>
  );
};
export default Home;
