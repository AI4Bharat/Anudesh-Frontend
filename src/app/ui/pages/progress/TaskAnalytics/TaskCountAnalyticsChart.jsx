import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";
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


function TaskCountAnalyticsChart(props) {
  console.log(props);
  const classes = DatasetStyle();
  const { analyticsData } = props;

  const isSmallScreen = useMediaQuery('(max-width:600px)'); 
  const isMediumScreen = useMediaQuery('(max-width:960px)');

  const getResponsiveFontSize = (baseSize) => {
    if (isSmallScreen) return baseSize * 0.8;
    if (isMediumScreen) return baseSize * 0.9;
    return baseSize;
  };

  const [totalTaskCount, setTotalTaskCount] = useState();
  const [totalAnnotationTasksCount, setTotalAnnotationTasksCount] = useState();
  const [totalReviewTasksCount, setTotalReviewTasksCount] = useState();
  const [difftotal,setdifftotal] =useState()
  const [data, setData] = useState([]);
  useEffect(() => {
    if (analyticsData.length > 0) {
      // Create a copy of analyticsData before sorting
      const sortedData = [...analyticsData];
  
      // Sort the copied array
      sortedData.sort((a, b) => b.annotation_cumulative_tasks_count - a.annotation_cumulative_tasks_count);
  
      // Update state with sorted data
      setData(sortedData);
  
      // Calculate totals
      let allAnnotatorCumulativeTasksCount = 0;
      let allReviewCumulativeTasksCount = 0;
      let languages = '';
  
      sortedData.forEach((element, index) => {
        allAnnotatorCumulativeTasksCount += element.annotation_cumulative_tasks_count;
        allReviewCumulativeTasksCount += element.review_cumulative_tasks_count;
        languages = element.languages; 
      });
      setdifftotal(allAnnotatorCumulativeTasksCount-allReviewCumulativeTasksCount)
      setTotalAnnotationTasksCount(allAnnotatorCumulativeTasksCount);
      setTotalReviewTasksCount(allReviewCumulativeTasksCount);
      setTotalTaskCount(allAnnotatorCumulativeTasksCount + allReviewCumulativeTasksCount);
    }
  }, [analyticsData]);

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
        <Typography 
          variant="h2" 
          style={{ marginBottom: "35px", fontSize: getResponsiveFontSize(32), padding: "10px" }} 
          className={classes.heading}
        >
          {`Tasks Dashboard - ${analyticsData[0]?.projectType}`}
          <Typography variant="body1" style={{ fontSize: getResponsiveFontSize(16), padding: "5px" }}>
            Count of Annotated and Reviewed Data
          </Typography>
        </Typography>
        <Paper>
          <Box className={classes.topBar}>
            <Box className={classes.topBarInnerBox}>
              <Typography
                style={{
                  fontSize: getResponsiveFontSize(16),
                  fontWeight: "600",
                  padding: "5px",
                }}
              >
                Tasks Dashboard
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: getResponsiveFontSize(14), fontWeight: "500", padding: "5px" }}>
                Total Annotated Tasks
              </Typography>
              <Typography style={{ fontSize: getResponsiveFontSize(18), fontWeight: "500", padding: "5px" }}>
                {totalAnnotationTasksCount &&
                  new Intl.NumberFormat("en").format(totalAnnotationTasksCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: getResponsiveFontSize(14), fontWeight: "500", padding: "5px" }}>
                Pending Review Tasks
              </Typography>
              <Typography style={{ fontSize: getResponsiveFontSize(18), fontWeight: "500", padding: "5px" }}>
                {difftotal &&
                  new Intl.NumberFormat("en").format(difftotal)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: getResponsiveFontSize(14), fontWeight: "500", padding: "5px" }}>
                Review Completed Tasks
              </Typography>
              <Typography style={{ fontSize: getResponsiveFontSize(18), fontWeight: "400", padding: "5px" }}>
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
              <XAxis
                dataKey="languages"
                textAnchor={"end"}
                // tick={<CustomizedAxisTick />}
                height={90}
                interval={0}
                position="insideLeft"
                type="category"
                angle={-30}
              >
                <Label
                  value="Language"
                  position="insideBottom"
                  fontWeight="bold"
                  fontSize={getResponsiveFontSize(16)}
                  padding="5px"
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
                  fontSize={getResponsiveFontSize(16)}
                  offset={-15}
                  padding="5px"
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
export default TaskCountAnalyticsChart;
