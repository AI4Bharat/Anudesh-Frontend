import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DatasetStyle from "@/styles/dataset";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import ResponsiveChartContainer from "@/components/common/ResponsiveChartContainer"
import { useTheme } from "@/context/ThemeContext";


function ContextualSentenceVerificationChart(props) {
     /* eslint-disable react-hooks/exhaustive-deps */
const { dark } = useTheme();
const darkPaper = dark
  ? { backgroundColor: "#2a2a2a", color: "#ececec" }
  : {};

const darkText = dark ? { color: "#ececec" } : {};
const darkSubText = dark ? { color: "#a0a0a0" } : {};

const axisColor = dark ? "#a0a0a0" : "#000";
  const classes = DatasetStyle();
  const { taskAnalyticsData } = props;

  const [data, setData] = useState([]);
  const [totalTaskCount, setTotalTaskCount] = useState();
  const [totalAnnotationTasksCount, setTotalAnnotationTasksCount] = useState();
  const [totalReviewTasksCount, setTotalReviewTasksCount] = useState();
  useEffect(() => {
    taskAnalyticsData[1]?.sort(
      (a, b) =>
        b.annotation_cumulative_tasks_count -
        a.annotation_cumulative_tasks_count
    );
    setData(taskAnalyticsData[1]);
    let allAnnotatorCumulativeTasksCount = 0;
    let allReviewCumulativeTasksCount = 0;
    var languages;
    taskAnalyticsData[1]?.map((element, index) => {
      allAnnotatorCumulativeTasksCount +=
        element.annotation_cumulative_tasks_count;
      allReviewCumulativeTasksCount += element.review_cumulative_tasks_count;
      languages = element.languages;
    });

    setTotalAnnotationTasksCount(allAnnotatorCumulativeTasksCount);
    setTotalReviewTasksCount(allReviewCumulativeTasksCount);
    setTotalTaskCount(
      allAnnotatorCumulativeTasksCount + allReviewCumulativeTasksCount
    );
  }, [taskAnalyticsData[1]]);

  return (
    <>
      <Box className={classes.modelChartSection}>
        <Typography variant="h2" style={{ marginBottom: "35px", ...darkText }} className={classes.heading} >
          Tasks Dashboard - Sentence Verification
          <Typography variant="body1" style={darkSubText}>
            Count of Annotated Sentence Verification
          </Typography>
        </Typography>
        <Paper sx={darkPaper}>
          <Box className={classes.topBar}>
            <Box className={classes.topBarInnerBox}>
              <Typography
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  padding: "16px 0",
                  ...darkText
                }}
              >
                Tasks Dashboard
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400", ...darkSubText }}>
              Total Annotated Tasks

              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400", ...darkText }}>
                {totalTaskCount &&
                  new Intl.NumberFormat("en").format(totalTaskCount)}
              </Typography>
            </Box>
          </Box>
          <Grid>
          <ResponsiveChartContainer>
            <BarChart
              width={1100}
              height={600}
              data={data}
              fontSize="14px"
              fontFamily="Roboto"
              margin={{
                top: 20,
                right: 60,
                left: 40,
                bottom: 20,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis
                dataKey="languages"
                textAnchor={"end"}
                // tick={<CustomizedAxisTick />}
                height={90}
                interval={0}
                position="insideLeft"
                type="category"
                angle={-30}
                 stroke={axisColor}
                tick={{ fill: axisColor }}
              >
                <Label
                  value="Languages"
                  position="insideBottom"
                  fontWeight="bold"
                  fontSize={16}
                  fill={axisColor}
                ></Label>
              </XAxis>
              <YAxis
                tickInterval={10}
                allowDecimals={false}
                type="number"
                dx={0}
                stroke={axisColor}
                tick={{ fill: axisColor }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en", { notation: "compact" }).format(
                    value
                  )
                }
              >
                <Label
                  value="# of Completed Tasks"
                  angle={-90}
                  position="insideLeft"
                  fontWeight="bold"
                  fontSize={16}
                  offset={-15}
                  fill={axisColor}
                ></Label>
              </YAxis>
              {/* <Label value="Count" position="insideLeft" offset={15} /> */}
              <Tooltip
              contentStyle={{
                fontFamily: "Roboto",
                fontSize: "14px",
                backgroundColor: dark ? "#2a2a2a" : "#fff",
                border: dark ? "1px solid #3a3a3a" : "1px solid #ccc",
                color: dark ? "#ececec" : "#000"
  }}
                //content={<CustomTooltip />}
              />
              <Legend verticalAlign="top" />
              <Bar
                dataKey="annotation_cumulative_tasks_count"
                barSize={30}
                name="Annotation"
                stackId="a"
                fill="rgba(243, 156, 18 )"
                cursor="pointer"
              />
            </BarChart>
            </ResponsiveChartContainer>
          </Grid>
        </Paper>
      </Box>
    </>
  );
}
export default ContextualSentenceVerificationChart;
