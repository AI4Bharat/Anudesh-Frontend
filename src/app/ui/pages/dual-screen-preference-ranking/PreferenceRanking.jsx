import React, { useState } from "react";
import classNames from "classnames";
import { Box, FormControlLabel, Typography } from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";

import "./styles.css";
import { CheckBox } from "@mui/icons-material";
import configs from "@/config/config";

const orange = {
  200: "pink",
  400: "#EE6633", //hover-border
  600: "#EE663366",
};

const grey = {
  50: "#F3F6F9",
  200: "#DAE2ED",
  300: "#C7D0DD",
  700: "#434D5B",
  900: "#1C2025",
};

const OutputSelection = () => {
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [comment, setComment] = useState("");
  const targetLang = localStorage.getItem("language") || "en";
  const globalTransliteration =
    localStorage.getItem("globalTransliteration") === "true" ? true : false;
  const [response1Ranks, setResponse1Ranks] = useState({
    factualErrors: false,
    grammaticalErrors: false,
    culturallyInappropriate: false,
  });
  const [response2Ranks, setResponse2Ranks] = useState({
    factualErrors: false,
    grammaticalErrors: false,
    culturallyInappropriate: false,
  });

  const handleSelectOutput = (output) => {
    setSelectedOutput(output);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleMouseEnter = (event) => {
    event.target.style.borderColor = orange[400];
  };

  const handleMouseLeave = (event) => {
    event.target.style.borderColor = grey[200];
  };

  const handleFocus = (event) => {
    event.target.style.outline = "0px";
    event.target.style.borderColor = orange[400];
    event.target.style.boxShadow = `0 0 0 3px ${orange[200]}`;
  };

  const handleBlur = (event) => {
    event.target.style.boxShadow = `0px 2px 2px ${grey[50]}`;
  };

  return (
    <>
      <Box
        sx={{
          marginTop: "1rem",
          padding: "1.5rem",
          borderRadius: "20px",
          backgroundColor: "#FEF1EE",
        }}
      >
        <Typography
          style={{
            fontWeight: 800,
            fontSize: "1.1rem",
          }}
        >
          Prompt:{" "}
        </Typography>
        <Typography
          style={{
            fontWeight: "normal",
            fontSize: "1rem",
            maxHeight: "5rem",
            overflowY: "scroll",
          }}
        >
          Explore the rich tapestry of India's scientific heritage, spanning
          from ancient times to the modern era. Uncover the remarkable
          contributions of Indian mathematicians, astronomers, and philosophers,
          such as Aryabhata and Brahmagupta, who laid the foundation for
          algebra, trigonometry, and the concept of zero. Boxe into India's
          legacy of pioneering inventions and discoveries, including the
          invention of the decimal system and the discovery of the heliocentric
          model of the solar system. Delve into the contemporary landscape,
          where India stands as a global leader in space exploration,
          information technology, and renewable energy research, showcasing its
          enduring spirit of innovation and quest for knowledge.
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "1rem",
            paddingBottom: "0.8rem",
          }}
        >
          Make a selection of the better response:
        </Typography>
        <Box className="output-container">
          <Typography
            className={classNames("output", {
              selected: selectedOutput === "output1",
            })}
            onClick={() => handleSelectOutput("output1")}
            sx={{
              fontSize: "1rem",
              maxHeight: "80%",
              minHeight: "80%",
              overflowY: "scroll",
              width: "48%",
            }}
          >
            Ancient Contributions: One of the earliest recorded mathematical
            texts, the Sulba Sutras, dating back to around 800 BCE, reveals that
            ancient Indians had a deep understanding of geometry and arithmetic.
            These texts contain methods for constructing altars and fire pits
            with precise geometric shapes. In the 5th century CE, Aryabhata, a
            brilliant mathematician and astronomer, formulated the concept of
            zero as a placeholder and made significant advancements in algebra
            and trigonometry. His work laid the foundation for the decimal
            system, which revolutionized mathematics and made complex
            calculations more efficient.
          </Typography>
          <Typography
            className={classNames("output", {
              selected: selectedOutput === "output2",
            })}
            onClick={() => handleSelectOutput("output2")}
            sx={{
              fontSize: "1rem",
              maxHeight: "80%",
              minHeight: "80%",
              overflowY: "scroll",
              width: "48%",
            }}
          >
            Medieval Period: During the medieval period, Indian mathematicians
            continued to make groundbreaking discoveries. Brahmagupta, in the
            7th century CE, contributed to the fields of algebra and astronomy.
            He provided solutions to quadratic equations and introduced the
            concept of negative numbers. Indian astronomers such as Bhaskara II,
            in the 12th century CE, developed sophisticated theories of
            planetary motion and calculated the positions of celestial objects
            with remarkable accuracy. His work contributed to the understanding
            of calculus and the heliocentric model of the solar system.
          </Typography>
        </Box>
      </Box>
      {/* Ranking Section */}
      {/* Response 1 Rankings */}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: "17px", textAlign: "center" }}>
            Response 1{" "}
          </Typography>
        </Box>
        {/* Factual Errors */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            Factual Errors/Non-Sensical?
          </Typography>
          <CheckBox
            checked={response1Ranks.factualErrors}
            onChange={() => handleRankChange("response1", "factualErrors")}
          />
        </Box>
        {/* Grammatical Errors */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            Grammatical Errors / Typographical Error?
          </Typography>
          <CheckBox
            checked={response1Ranks.grammaticalErrors}
            onChange={() => handleRankChange("response1", "grammaticalErrors")}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            Asking for something illegal
          </Typography>
          <CheckBox
            checked={response1Ranks.grammaticalErrors}
            onChange={() => handleRankChange("response1", "grammaticalErrors")}
          />
        </Box>
        {/* Culturally Inappropriate */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            Culturally Inappropriate/Insensitive?
          </Typography>
          <CheckBox
            checked={response1Ranks.culturallyInappropriate}
            onChange={() =>
              handleRankChange("response1", "culturallyInappropriate")
            }
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            A valid question for migrant workers to ask?
          </Typography>
          <CheckBox
            checked={response1Ranks.culturallyInappropriate}
            onChange={() =>
              handleRankChange("response1", "culturallyInappropriate")
            }
          />
        </Box>
      </Box>

      {/* Response 2 Rankings */}

      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Box>
          <Typography>Response 2 </Typography>
        </Box>
        {/* Factual Errors */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            Factual Errors/Non-Sensical?
          </Typography>
          <CheckBox
            checked={response1Ranks.factualErrors}
            onChange={() => handleRankChange("response2", "factualErrors")}
          />
        </Box>
        {/* Grammatical Errors */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            Grammatical Errors / Typographical Error?
          </Typography>
          <CheckBox
            checked={response1Ranks.grammaticalErrors}
            onChange={() => handleRankChange("response2", "grammaticalErrors")}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            Asking for something illegal
          </Typography>
          <CheckBox
            checked={response1Ranks.grammaticalErrors}
            onChange={() => handleRankChange("response2", "grammaticalErrors")}
          />
        </Box>
        {/* Culturally Inappropriate */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            Culturally Inappropriate/Insensitive?
          </Typography>
          <CheckBox
            checked={response1Ranks.culturallyInappropriate}
            onChange={() =>
              handleRankChange("response2", "culturallyInappropriate")
            }
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "15px", textAlign: "center" }}>
            A valid question for migrant workers to ask?
          </Typography>
          <CheckBox
            checked={response1Ranks.culturallyInappropriate}
            onChange={() =>
              handleRankChange("response2", "culturallyInappropriate")
            }
          />
        </Box>
      </Box>
      <Box className="feedback-section">
        {globalTransliteration ? (
          <IndicTransliterate
            customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
            enableASR={true}
            asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
            apiKey={`JWT ${localStorage.getItem('anudesh_access_token')}`}
            renderComponent={(props) => (
              <textarea
                sx={{
                  whiteSpace: "pre-wrap",
                }}
                maxRows={10}
                aria-label="empty textarea"
                placeholder={
                  "Make a comment explaining why you selected the specific response(optional)..."
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
              />
            )}
            value={comment}
            onChangeText={(comment) => {
              setComment(comment);
            }}
            lang={targetLang}
            style={{
              resize: "none",
              fontSize: "1rem",
              width: "60vw",
              fontWeight: "400",
              lineHeight: "1.5",
              padding: "12px",
              borderRadius: "12px 12px 0 12px",
              color: grey[900],
              background: "#ffffff",
              border: `1px solid ${grey[200]}`,
              boxShadow: `0px 2px 2px ${grey[50]}`,
            }}
            horizontalView={true}
          />
        ) : (
          <textarea
            placeholder="Make a comment explaining why you selected the specific response(optional)..."
            value={comment}
            onChange={handleCommentChange}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              resize: "none",
              fontSize: "1rem",
              fontWeight: "400",
              lineHeight: "1.5",
              padding: "12px",
              borderRadius: "12px 12px 0 12px",
              color: grey[900],
              background: "#ffffff",
              border: `1px solid ${grey[200]}`,
              boxShadow: `0px 2px 2px ${grey[50]}`,
            }}
          />
        )}
      </Box>
    </>
  );
};

export default OutputSelection;
