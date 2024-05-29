import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

import { dummyData } from "./dummy_data";

const colors = ["#333", "#ee6633"];

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

const StackedBarChart = ({ data, title }) => (
  <Box style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4rem'
  }}>
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
    <ResponsiveContainer
      width="50%"
      height={500}
    >
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
      >
        <XAxis dataKey="language" angle={-45} textAnchor="end" interval={0} />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" />
        {renderBars(data)}
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

const PublicAnalytics = () => (
  <>
    <Typography
      variant="h2"
      style={{
        textAlign: "center",
        margin: "2rem 0 2rem",
        color: "#ee6633",
        fontWeight: "bold",
        textTransform: 'uppercase',
        fontSize: '2.5rem'
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

export default PublicAnalytics;
