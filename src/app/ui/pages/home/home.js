"use client";
import "./home.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Link, useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import RateReviewIcon from "@mui/icons-material/RateReview";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CompareIcon from "@mui/icons-material/Compare";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import { Box, Card, CardContent, Typography, Dialog, DialogContent, IconButton, Divider } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";
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
              fontSize: { xs: "3rem", md: "4rem" },
            }}
          />
        );
      case "IntegrationInstructions":
        return (
          <IntegrationInstructionsIcon
            sx={{
              color: "#EA5923",
              fontSize: { xs: "3rem", md: "4rem" },
            }}
          />
        );
      case "RateReview":
        return (
          <RateReviewIcon
            sx={{
              color: "#EA5923",
              fontSize: { xs: "3rem", md: "4rem" },
            }}
          />
        );
      case "QuestionAnswer":
        return (
          <QuestionAnswerIcon
            sx={{
              color: "#EA5923",
              fontSize: { xs: "3rem", md: "4rem" },
            }}
          />
        );
      case "Compare":
        return (
          <CompareIcon
            sx={{
              color: "#EA5923",
              fontSize: { xs: "3rem", md: "4rem" },
            }}
          />
        );
      case "PsychologyAlt":
        return (
          <PsychologyAltIcon
            sx={{
              color: "#EA5923",
              fontSize: { xs: "3rem", md: "4rem" },
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card
      variant="elevation"
      elevation={0}
      className={classes.dynamicCardsWrapper}
      sx={{ cursor: "pointer", backgroundColor: "transparent" }}
    >
      <CardContent
        sx={{
          padding: { xs: "6px 12px", md: "8px 16px" },
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: { xs: 1, md: 2 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <DynamicIcon />
        </Box>
        <Box>
          <Typography className={classes.heading} fontWeight="bold" sx={{ fontSize: { xs: "14px", md: "16px" } }}>
            {card.name}
          </Typography>
          <Typography
            className={classes.dynamicContent}
            sx={{ fontSize: { xs: "12px", md: "13px" } }}
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
  const [aboutUsOpen, setAboutUsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("interaction_json", JSON.stringify([]));
    }
  }, []);

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-tl from-orange-light to-orange-dark-100 flex flex-col relative pt-1">

      <Dialog
        open={aboutUsOpen}
        onClose={() => setAboutUsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "bg-gradient-to-tl from-orange-light to-orange-dark-100",
          sx: {
            borderRadius: "16px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          },
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
          <Image
            alt="Anudesh"
            src="https://i.imgur.com/56Ut9oz.png"
            width={400}
            height={400}
            className="w-[400px] h-[400px]"
          />
        </div>

        <IconButton
          onClick={() => setAboutUsOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#EA5923",
            zIndex: 50,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#C2410C",
              fontWeight: "bold",
              mb: 2,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            {info.question}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#EA5923",
              fontWeight: 600,
              mb: 3,
              textAlign: "center",
              opacity: 0.95,
            }}
          >
            {info.subquestion}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#4B5563",
              lineHeight: 1.8,
              textAlign: "justify",
              fontSize: "16px",
            }}
          >
            {info.content}
          </Typography>

          <Divider sx={{ my: 4, borderColor: "rgba(234, 89, 35, 0.3)" }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-xl p-3 border border-orange-200 flex flex-col items-center text-center">
              <AdminPanelSettingsIcon sx={{ color: "#EA5923", fontSize: "2.5rem", mb: 1 }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: "#374151", fontSize: "1rem", mb: 0.5 }}>
                {operationalModes.admin_mode}
              </Typography>
              <Typography variant="body2" sx={{ color: "#4B5563", fontSize: "0.9rem" }}>
                {operationalModes.admin_content}
              </Typography>
            </div>
            <div className="bg-white/50 rounded-xl p-3 border border-orange-200 flex flex-col items-center text-center">
              <SupervisorAccountIcon sx={{ color: "#EA5923", fontSize: "2.5rem", mb: 1 }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: "#374151", fontSize: "1rem", mb: 0.5 }}>
                {operationalModes.user_mode}
              </Typography>
              <Typography variant="body2" sx={{ color: "#4B5563", fontSize: "0.9rem" }}>
                {operationalModes.user_content}
              </Typography>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="h-12 md:h-14 lg:h-16 flex justify-between items-center px-4 md:px-6 lg:px-10 border-b border-orange-400/20 relative z-10 shrink-0 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <Image
            alt="Anudesh"
            src="https://i.imgur.com/56Ut9oz.png"
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain"
            priority
            width={400}
            height={400}
          />
          <Typography variant="h4" fontWeight={800} sx={{ color: "#EA5923", letterSpacing: "-0.03em", fontSize: { xs: "1.25rem", md: "1.5rem", lg: "2rem" } }}>
            Anudesh
          </Typography>
        </div>
        <div className="flex gap-2 md:gap-3 lg:gap-4">
          <button
            onClick={() => setAboutUsOpen(true)}
            className="text-xs md:text-sm lg:text-base font-medium hover:underline transition-all"
          >
            About Us
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-xs md:text-sm lg:text-base font-medium hover:underline transition-all"
          >
            {banner.logIn}
          </button>
          <button
            onClick={() =>
              window.open("https://github.com/AI4Bharat/Anudesh", "_blank")
            }
            className="text-xs md:text-sm lg:text-base font-medium hover:underline transition-all"
          >
            Codebase
          </button>
          <button className="text-xs md:text-sm lg:text-base font-medium hover:underline transition-all">
            Analytics
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1 px-4 md:px-12 lg:px-24 py-1 relative z-10 overflow-hidden">

        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-2 grid grid-cols-2 gap-2 items-center border border-orange-400/20 relative w-full overflow-hidden content-center">

          <div className="flex flex-col justify-center text-left max-h-full overflow-y-auto custom-scrollbar">
            <div className="text-orange-600 mb-2 md:mb-3 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight" style={{ letterSpacing: '-0.02em' }}>
              {banner.heading}
            </div>
            <div className="text-orange-600/90 text-xs md:text-sm lg:text-base mb-4 md:mb-6 leading-relaxed font-medium opacity-90">
              {banner.subheading}
            </div>
            <div className="flex gap-2 md:gap-4 flex-wrap">
              <Link to={"https://www.youtube.com/watch?v=6k7fk3mCk9A"}>
                <button className="bg-orange-600 text-white text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg hover:bg-white hover:text-orange-600 border-2 border-orange-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg">
                  {banner.demo}
                </button>
              </Link>
              <button
                onClick={() => navigate("/chat")}
                className="text-orange-600 bg-white text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg border-2 border-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                {banner.chat}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center p-2 md:p-4 lg:p-6 h-full">
            <Image
              alt="Anudesh Logo"
              src="https://i.imgur.com/56Ut9oz.png"
              width={600}
              height={600}
              className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] lg:w-[280px] lg:h-[280px] xl:w-[360px] xl:h-[360px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              priority={true}
            />
          </div>
        </div>

        {/* Operational Dynamics Section */}
        <div className="bg-white rounded-xl p-1 md:p-1.5 border border-gray-200 shadow-sm flex flex-col overflow-hidden shrink-0 mt-auto">
          <div className="text-gray-800 font-bold mb-1 text-center shrink-0 text-sm md:text-base lg:text-lg" style={{ letterSpacing: '-0.02em' }}>
            {operationalDynamics.heading}
          </div>
          <div className="overflow-hidden flex items-center justify-center relative">
            <Carousel
              stopAutoPlayOnHover
              animation="slide"
              duration={800}
              interval={4000}
              navButtonsAlwaysVisible
              navButtonsProps={{
                style: { borderRadius: "50%", width: "20px", height: "20px", backgroundColor: "rgba(0,0,0,0.1)", color: "#000" },
              }}
              navButtonsWrapperProps={{
                style: { top: "0" },
              }}
              indicatorContainerProps={{
                style: { marginTop: '10px', textAlign: 'center', width: '100%', position: 'absolute', bottom: '0px', zIndex: 10 }
              }}
              NextIcon={<ArrowForwardIosIcon sx={{ fontSize: "10px" }} />}
              PrevIcon={<ArrowBackIosNewIcon sx={{ fontSize: "10px" }} />}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {dynamicCard.map((item, i) => (
                <DynamicCards key={i} card={item} />
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      <div className="h-10 bg-stone-800 flex items-center justify-center relative z-10">
        <Typography className="text-white" sx={{ fontSize: "11px", fontWeight: "bold" }}>
          {footer.content}
        </Typography>
      </div>
    </div>
  );
};
export default Home;
