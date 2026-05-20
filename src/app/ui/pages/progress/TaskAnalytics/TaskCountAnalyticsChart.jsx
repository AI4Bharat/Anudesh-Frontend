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
        {/* Section Title */}
        <Typography 
          variant="h6" 
          sx={{
            mb: 2,
            fontSize: getResponsiveFontSize(18),
            fontWeight: 600,
            color: '#1a1a2e',
            letterSpacing: '-0.01em',
          }}
        >
          {`Tasks — ${analyticsData[0]?.projectType}`}
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: getResponsiveFontSize(13), 
              color: '#6b7280',
              fontWeight: 400,
              mt: 0.25,
            }}
          >
            Annotated vs Reviewed task counts by language
          </Typography>
        </Typography>

        {/* Chart Card */}
        <Paper sx={{
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04) !important',
        }}>
          {/* Stat Bar */}
          <Box className={classes.topBar}>
            <Box className={classes.topBarInnerBox}>
              <Typography sx={{ fontSize: getResponsiveFontSize(11), fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                Dashboard
              </Typography>
              <Typography sx={{ fontSize: getResponsiveFontSize(13), fontWeight: 600, color: '#1a1a2e' }}>
                Tasks
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography sx={{ fontSize: getResponsiveFontSize(11), fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                Annotated
              </Typography>
              <Typography sx={{ fontSize: getResponsiveFontSize(16), fontWeight: 700, color: '#1a1a2e' }}>
                {totalAnnotationTasksCount &&
                  new Intl.NumberFormat("en").format(totalAnnotationTasksCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography sx={{ fontSize: getResponsiveFontSize(11), fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                Pending Review
              </Typography>
              <Typography sx={{ fontSize: getResponsiveFontSize(16), fontWeight: 700, color: '#ea580c' }}>
                {difftotal &&
                  new Intl.NumberFormat("en").format(difftotal)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography sx={{ fontSize: getResponsiveFontSize(11), fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                Review Done
              </Typography>
              <Typography sx={{ fontSize: getResponsiveFontSize(16), fontWeight: 700, color: '#16a34a' }}>
                {totalReviewTasksCount &&
                  new Intl.NumberFormat("en").format(totalReviewTasksCount)}
              </Typography>
            </Box>
          </Box>

          {/* Chart */}
          <Grid sx={{ p: { xs: 1, sm: 2 } }}>
          <ResponsiveChartContainer>
            <BarChart
              width={1100}
              height={600}
              data={data}
              fontSize="13px"
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
                tick={{ fontSize: getResponsiveFontSize(12), fill: '#6b7280' }}
              >
                <Label
                  value="Language"
                  position="insideBottom"
                  fontWeight="600"
                  fontSize={getResponsiveFontSize(13)}
                  fill="#4b5563"
                ></Label>
              </XAxis>
              <YAxis
                tickInterval={10}
                allowDecimals={false}
                type="number"
                dx={0}
                tick={{ fontSize: getResponsiveFontSize(12), fill: '#6b7280' }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en", { notation: "compact" }).format(
                    value
                  )
                }
              >
                <Label
                  value="# Completed Tasks"
                  angle={-90}
                  position="insideLeft"
                  fontWeight="600"
                  fontSize={getResponsiveFontSize(13)}
                  fill="#4b5563"
                  offset={-15}
                ></Label>
              </YAxis>
              <Tooltip
                contentStyle={{ fontFamily: "Roboto", fontSize: "13px" }}
                formatter={(value) => new Intl.NumberFormat("en").format(value)}
                cursor={{ fill: "rgba(249, 115, 22, 0.04)" }}
                content={<CustomTooltip />}
              />
              <Legend 
                verticalAlign="top" 
                wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }}
              />
              <Bar
                dataKey="review_cumulative_tasks_count"
                barSize={30}
                name="Review"
                stackId="a"
                fill="#16a34a"
                radius={[0, 0, 0, 0]}
                cursor="pointer"
              />
              <Bar
                dataKey="diff_annotation_review"
                barSize={30}
                name="Annotation"
                stackId="a"
                fill="#f97316"
                radius={[3, 3, 0, 0]}
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
