import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./styles.css";
import { Typography, Box } from "@mui/material";

const ItemTypes = {
  RESPONSE: "response",
};

const PreferenceRanking = () => {
  const [responses, setResponses] = useState([
    {
      id: 1,
      text: "Ancient Contributions: One of the earliest recorded mathematical texts, the Sulba Sutras, dating back to around 800 BCE, reveals that ancient Indians had a deep understanding of geometry and arithmetic. These texts contain methods for constructing altars and fire pits with precise geometric shapes. In the 5th century CE, Aryabhata, a brilliant mathematician and astronomer, formulated the concept of zero as a placeholder and made significant advancements in algebra and trigonometry. His work laid the foundation for the decimal system, which revolutionized mathematics and made complex calculations more efficient.",
      rank: 0,
    },
    {
      id: 2,
      text: "Medieval Period: During the medieval period, Indian mathematicians continued to make groundbreaking discoveries. Brahmagupta, in the 7th century CE, contributed to the fields of algebra and astronomy. He provided solutions to quadratic equations and introduced the concept of negative numbers. Indian astronomers such as Bhaskara II, in the 12th century CE, developed sophisticated theories of planetary motion and calculated the positions of celestial objects with remarkable accuracy. His work contributed to the understanding of calculus and the heliocentric model of the solar system.",
      rank: 0,
    },
    {
      id: 3,
      text: "Colonial Era: Despite the challenges of colonial rule, Indian scientists continued to make significant contributions to various fields. Srinivasa Ramanujan, a self-taught mathematical genius from Madras (now Chennai), made substantial contributions to number theory, infinite series, and mathematical analysis in the early 20th century. His collaboration with British mathematician G. H. Hardy led to groundbreaking discoveries in pure mathematics.",
      rank: 0,
    },
    {
      id: 4,
      text: "Modern India: In the post-independence era, India has emerged as a global leader in science and technology. The establishment of institutions like the Indian Institutes of Technology (IITs) and the Indian Space Research Organisation (ISRO) has fueled innovation and research in Boxerse fields. ISRO's achievements, including the launch of satellites, lunar missions, and Mars Orbiter Mission, have garnered international acclaim and showcased India's capabilities in space exploration.India's IT sector has experienced rapid growth, with companies like Infosys, TCS, and Wipro becoming global players in software development and IT services.In the realm of renewable energy, India has made significant strides in harnessing solar and wind power to meet its growing energy demands sustainably.",
      rank: 0,
    },
  ]);

  const moveResponse = (dragIndex, hoverIndex, rank) => {
    const dragResponse = responses[dragIndex];
    const newResponses = [...responses];
    newResponses.splice(dragIndex, 1);
    setResponses(newResponses);
    setResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses.splice(hoverIndex, 0, { ...dragResponse, rank });
      return updatedResponses;
    });
  };

  const Response = ({ id, text, index }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.RESPONSE,
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <Box
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        sx={{
          border: "1px solid #EE6633",
          borderRadius: "10px",
          maxWidth: "24%",
          maxHeight: "10rem",
          padding: "1rem",
          overflowY: "scroll",
          wordWrap: "break-word",
          marginRight: "12px",
          fontSize: "0.9rem",
        }}
      >
        {text}
      </Box>
    );
  };

  const ResponseList = () => {
    return (
      <Box className="response-list">
        {responses.map(
          (response, index) =>
            response.rank === 0 && (
              <Response
                key={response.id}
                id={response.id}
                text={response.text}
                index={index}
              />
            ),
        )}
      </Box>
    );
  };

  const RankContainer = ({ rank }) => {
    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.RESPONSE,
      drop: (item) =>
        moveResponse(
          item.index,
          responses.findIndex((p) => p.rank === 0),
          rank,
        ),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
      <Box
        ref={drop}
        sx={{ width: "20%", maxWidth: "20%", marginTop: "2rem" }}
        className={`rank-container ${isOver ? "highlight" : ""}`}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#EE6633",
            fontSize: "1rem",
          }}
        >
          Rank {rank}
        </Typography>
        {responses.map((response, index) => {
          if (response.rank === rank) {
            return (
              <Box
                sx={{
                  borderRadius: "10px",
                  maxHeight: "15rem",
                  padding: "0.6rem",
                  overflowY: "scroll",
                  wordWrap: "break-word",
                  marginTop: "1rem",
                  backgroundColor: "#FEF1EE",
                  fontSize: "0.8rem",
                }}
                key={response.id}
              >
                {response.text}
              </Box>
            );
          }
          return null;
        })}
      </Box>
    );
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
      <DndProvider backend={HTML5Backend}>
        <Box
          sx={{
            marginTop: "2rem",
          }}
        >
          <ResponseList />
          <Box
            sx={{
              display: "flex",
            }}
          >
            {["1(Best)", "2", "3", "4", "5(Worst)"].map((rank, index) => (
              <RankContainer key={index + 1} rank={rank} />
            ))}
          </Box>
        </Box>
      </DndProvider>
    </>
  );
};

export default PreferenceRanking;
