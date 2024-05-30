import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import { dummyData } from "./dummy_data";

const colors = ["#479C57", "#F29C2D"];

const PublicAnalytics = () => {
  const navigate = useNavigate();

  const renderBars = (data) => {
    return (
      data[0] &&
      Object.keys(data[0])
        .filter((key) => key !== "language")
        .map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={colors[index % colors.length]}
          />
        ))
    );
  };

  const formatYAxis = (tickItem) => {
    return `${Math.round(tickItem / 1000)}K`;
  };

  const StackedBarChart = ({ data, title }) => (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "4rem",
      }}
    >
      <Typography
        style={{
          color: "#3a3a3a",
          fontWeight: 800,
          fontSize: "1.5rem",
        }}
      >{`Tasks Dashboard-${title}`}</Typography>
      <Typography
        style={{
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.5,
        }}
      >{`Count of Annotated and Reviewed ${title} Tasks`}</Typography>
      <ResponsiveContainer width="50%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        >
          <XAxis dataKey="language" angle={-45} dy={35} interval={0}>
            <Label
              value="Languages"
              position="insideBottom"
              style={{ fontWeight: "800", fill: "#000" }}
              dy={95}
            />
          </XAxis>
          <YAxis tickFormatter={formatYAxis} padding={{ top: 20 }}>
            <Label
              value="# of Completed Tasks"
              angle={-90}
              position="insideLeft"
              style={{ fontWeight: "800", fill: "#000" }}
              dx={-15}
              dy={100}
            />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" />
          {renderBars(data)}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
  return (
    <>
      <Box className="pt-8 pb-8 flex justify-between px-16">
        <Image
          alt="Anudesh"
          src="https://i.imgur.com/56Ut9oz.png"
          width={90}
          height={90}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        ></Image>
        <Box className="flex gap-6">
          <button className="text-xl font-medium hover:underline">
            Codebase
          </button>
          <button
            onClick={() => navigate("/public-analytics")}
            className="text-xl font-medium hover:underline"
          >
            Analytics
          </button>
        </Box>
      </Box>
      <Typography
        variant="h2"
        style={{
          textAlign: "center",
          margin: "0 0 2rem",
          color: "#ee6633",
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: "2.5rem",
          color: "#3A3A3A",
        }}
      >
        Public Analytics
      </Typography>
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <StackedBarChart
          data={dummyData.InstructionDrivenChat}
          title="Instruction Driven Chat"
        />
        <StackedBarChart
          data={dummyData.ModelInteractionEvaluation}
          title="Model Interaction Evaluation"
        />
      </Box>
    </>
  );
};

export default PublicAnalytics;
