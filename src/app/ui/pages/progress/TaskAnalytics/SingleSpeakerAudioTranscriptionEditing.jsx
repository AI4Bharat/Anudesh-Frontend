import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
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
import ResponsiveChartContainer from "@/component/common/ResponsiveChartContainer"


function SingleSpeakerAudioTranscriptionEditing(props) {
    /* eslint-disable react-hooks/exhaustive-deps */

  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const { taskAnalyticsData } = props;
  const [totalTaskCount, setTotalTaskCount] = useState();
  const [totalAnnotationTasksCount, setTotalAnnotationTasksCount] = useState();
  const [totalReviewTasksCount, setTotalReviewTasksCount] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    taskAnalyticsData[3]?.sort(
      (a, b) =>
        b.annotation_cumulative_tasks_count -
        a.annotation_cumulative_tasks_count
    );
    setData(taskAnalyticsData[3]);

    let allAnnotatorCumulativeTasksCount = 0;
    let allReviewCumulativeTasksCount = 0;
    var languages;
    taskAnalyticsData[3]?.map((element, index) => {
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
  }, [taskAnalyticsData[3]]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={classes.toolTip}>
          <p style={{ fontWeight: "bold" }}>
            {`${label}`}
            <p style={{ fontWeight: "normal" }}>
              {`Total count : ${
                payload[0].payload.annotation_cumulative_tasks_count
                  ? new Intl.NumberFormat("en").format(
                      payload[0].payload.annotation_cumulative_tasks_count
                    )
                  : 0
              }`}
              <p style={{ color: "rgba(243, 156, 18 )" }}>
                {`Annotation : ${
                  payload[0].payload.diff_annotation_review
                    ? new Intl.NumberFormat("en").format(
                        payload[0].payload.diff_annotation_review
                      )
                    : 0
                }`}
                <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review : ${
                  payload[0].payload.review_cumulative_tasks_count
                    ? new Intl.NumberFormat("en").format(
                        payload[0].payload.review_cumulative_tasks_count
                      )
                    : 0
                }`}</p>
              </p>
            </p>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Box className={classes.modelChartSection}>
        <Typography variant="h2" style={{marginBottom:"35px"}} className={classes.heading}>
          Tasks Dashboard - Audio Transcription Editing
          <Typography variant="body1">
            Count of Annotated and Reviewed Audio Transcription Editing
          </Typography>
        </Typography>
       
        <Paper>
          <Box className={classes.topBar}>
            <Box className={classes.topBarInnerBox}>
              <Typography
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  padding: "16px 0",
                }}
              >
                Tasks Dashboard
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
              Total Annotated Tasks
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalTaskCount &&
                  new Intl.NumberFormat("en").format(totalTaskCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
              Pending Review Tasks

              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalAnnotationTasksCount &&
                  new Intl.NumberFormat("en").format(totalAnnotationTasksCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
              Review Completed Tasks
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalReviewTasksCount &&
                  new Intl.NumberFormat("en").format(totalReviewTasksCount)}
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
                height={70}
                interval={0}
                position="insideLeft"
                type="category"
                angle={-30}
              >
                <Label
                  value="Language"
                  position="insideBottom"
                  fontWeight="bold"
                  fontSize={16}
                ></Label>
              </XAxis>
              <YAxis
                tickInterval={10}
                allowDecimals={false}
                type="number"
                dx={0}
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
                ></Label>
              </YAxis>
              {/* <Label value="Count" position="insideLeft" offset={15} /> */}
              <Tooltip
                contentStyle={{ fontFamily: "Roboto", fontSize: "14px" }}
                formatter={(value) => new Intl.NumberFormat("en").format(value)}
                cursor={{ fill: "none" }}
                content={<CustomTooltip />}
              />
              <Legend verticalAlign="top" />
              <Bar
                dataKey="review_cumulative_tasks_count"
                barSize={30}
                name="Review"
                stackId="a"
                fill="rgba(35, 155, 86 )"
                cursor="pointer"
              />
              <Bar
                dataKey="diff_annotation_review"
                barSize={30}
                name="Annotation"
                stackId="a"
                fill="rgba(243, 156, 18 )"
              />
            </BarChart>
            </ResponsiveChartContainer>
          </Grid>
        </Paper>
      </Box>
    </>
  );
}
export default SingleSpeakerAudioTranscriptionEditing;
