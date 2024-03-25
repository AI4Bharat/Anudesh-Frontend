"use client";
import "./home.css";
import { useEffect } from "react";
import Image from "next/image";
import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import RateReviewIcon from "@mui/icons-material/RateReview";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CompareIcon from "@mui/icons-material/Compare";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import {
  Box,
  Grid,
  Stack,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Carousel from "react-material-ui-carousel";
import IntroStyle from "@/styles/IntroStyle";
import { dynamicCard, footer, operationalModes, info, banner, operationalDynamics } from "./config";
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
        <Box sx={{ display: { lg: "block", sm: "none" } }}>
          <DynamicIcon />
        </Box>
        <Box>
          <Typography className={classes.heading} fontWeight="bold">
            {card.name}
          </Typography>
          <Typography className={classes.dynamicContent}>
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
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('interaction_json', JSON.stringify([]));
    }
  }, []);
  

  return (
    <>
      <div className="pb-40 bg-gradient-to-tl from-orange-light to-orange-dark-100 h-auto">
        <div className="pt-8 pb-16 flex justify-between px-16">
          <Image
            alt="Anudesh"
            src="https://i.imgur.com/56Ut9oz.png"
            width={90}
            height={90}
          ></Image>
          <div className="flex gap-6">
            <button className="text-xl font-medium hover:underline">
              Codebase
            </button>
            <button className="text-xl font-medium hover:underline">
              Analytics
            </button>
          </div>
        </div>

        <div className="flex items-center align-middle h-full">
          <div className="px-40">
            <div className="text-orange-600 text-6xl mb-16 font-medium">
              { banner.heading }
            </div>
            <div className="text-orange-600 text-3xl mb-16">
              {banner.subheading}
            </div>
            <div className="flex gap-8">
              <button className="bg-orange-600 text-white text-xl p-4 rounded-md hover:bg-white hover:text-orange-600 border border-orange-600">
                {banner.demo}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="text-orange-600 bg-white text-xl p-4 rounded-md border border-orange-600 hover:bg-orange-600 hover:text-white"
              >
                {banner.logIn}
              </button>
              <button
                onClick={() => navigate("/chat")}
                className="text-orange-600 bg-white text-xl p-4 rounded-md border border-orange-600 hover:bg-orange-600 hover:text-white"
              >
                {banner.chat}
              </button>
            </div>
          </div>
          <div className="pr-40">
            <Image
              alt="Anudesh"
              className="hideOnMobile"
              src="https://i.imgur.com/56Ut9oz.png"
              width={900}
              height={900}
            ></Image>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center text-center py-32 px-60">
        <Image className="hideOnMobile" alt="Anudesh" src={Svg} width={400} height={400}></Image>
        <div className="pl-20">
          <div className="text-orange-600 text-6xl font-medium">
            { info.question }
          </div>
          <div className="pt-10">
            <div className="text-4xl font-semibold text-gray-700 pb-10">
              { info.subquestion }
            </div>
            <Typography
              variant="body1"
              color="rgb(107 114 128)"
              fontWeight={300}
            >
              { info.content }
            </Typography>
          </div>
        </div>
      </div>

      <div className="text-center pb-32 px-64">
        <div className="text-gray-700 text-6xl font-medium">
          { operationalModes.heading }
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
                >
                  {operationalModes.user_content}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </div>

      <div clasNsame="text-center pb-32">
        <div className="text-gray-700 text-6xl font-medium py-20">
          { operationalDynamics.heading }
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
            width: "70%",
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
        <Typography className="text-white" sx={{fontWeight: 'bold'}}>
          {footer.content}
        </Typography>
      </div>
    </>
  );
};
export default Home;
