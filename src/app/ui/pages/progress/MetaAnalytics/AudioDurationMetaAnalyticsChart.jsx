import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label } from "recharts";
import DatasetStyle from "@/styles/dataset";
import { useEffect, useState } from "react";
import ResponsiveChartContainer from "@/components/common/ResponsiveChartContainer";

export default function AudioDurationChart(props) {
     /* eslint-disable react-hooks/exhaustive-deps */

  const { analyticsData, graphCategory } = props;
  const classes = DatasetStyle();
  const [totalAudioHours, setTotalAudioHours] = useState();
  const [totalAnnotationAudioHours, setTotalAnnotationAudioHours] = useState();
  const [totalReviewAudioHours, setTotalReviewAudioHours] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (graphCategory=="rawAudioDuration"){
      analyticsData?.sort(
        (a, b) =>
          b.annotation_raw_aud_duration_tohour - a.annotation_raw_aud_duration_tohour
      );
      setData(analyticsData);
      let allAnnotatorAudioHours = 0;
      let allReviewAudioHours = 0;
      var languages;
      analyticsData?.map((element, index) => {
          allAnnotatorAudioHours +=
          (element.annotation_raw_aud_duration_tohour?element.annotation_raw_aud_duration_tohour:0);
          allReviewAudioHours += (element.review_raw_aud_duration_tohour?element.review_raw_aud_duration_tohour:0);
        languages = element.languages;
      });
      setTotalAnnotationAudioHours(allAnnotatorAudioHours);
      setTotalReviewAudioHours(allReviewAudioHours);
      setTotalAudioHours(
          allAnnotatorAudioHours + allReviewAudioHours
      );
    }
    else{
      analyticsData?.sort(
        (a, b) =>
          b.annotation_aud_duration_tohour - a.annotation_aud_duration_tohour
      );
      setData(analyticsData);
      let allAnnotatorAudioHours = 0;
      let allReviewAudioHours = 0;
      var languages;
      analyticsData?.map((element, index) => {
          allAnnotatorAudioHours +=
          element.annotation_aud_duration_tohour;
          allReviewAudioHours += element.review_aud_duration_tohour;
        languages = element.languages;
      });
      setTotalAnnotationAudioHours(allAnnotatorAudioHours);
      setTotalReviewAudioHours(allReviewAudioHours);
      setTotalAudioHours(
          allAnnotatorAudioHours + allReviewAudioHours
      );
    }
  }, [analyticsData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={classes.toolTips}>
          {graphCategory=='rawAudioDuration'?<p style={{ fontWeight: "bold" }}>
            {`${label}`}
            <p style={{ fontWeight: "normal" }}>
              {`Total hours : ${
                payload[0].payload.annotation_raw_aud_duration_tohour
                  ? new Intl.NumberFormat("en").format(
                      payload[0].payload.annotation_raw_aud_duration_tohour
                    )
                  : 0
              }`}
              <p style={{ fontWeight: "normal" }}>
              {`Total duration : ${payload[0].payload.annotation_raw_aud_duration}`}

             
              
              <p style={{ color: "rgba(243, 156, 18 )" }}>
                {`Annotation duration : ${
                  payload[0].payload.diff_annotation_review_raw_aud_duration_tohour
                    ? new Intl.NumberFormat("en").format(
                        payload[0].payload
                          .diff_annotation_review_raw_aud_duration_tohour
                      )
                    : 0
                }`}
                <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review duration : ${
                  payload[0].payload.review_raw_aud_duration_tohour
                    ? new Intl.NumberFormat("en").format(
                        payload[0].payload.review_raw_aud_duration_tohour
                      )
                    : 0
                }`}</p>
              </p>
              </p>
            </p>
          </p>:
          <p style={{ fontWeight: "bold" }}>
            {`${label}`}
            <p style={{ fontWeight: "normal" }}>
              {`Total hours : ${
                payload[0].payload.annotation_aud_duration_tohour
                  ? new Intl.NumberFormat("en").format(
                      payload[0].payload.annotation_aud_duration_tohour
                    )
                  : 0
              }`}
              <p style={{ fontWeight: "normal" }}>
              {`Total duration : ${payload[0].payload.annotation_aud_duration}`}
                <p style={{ color: "rgba(243, 156, 18 )" }}>
                  {`Annotation duration : ${
                    payload[0].payload.diff_annotation_review_aud_duration_tohour
                      ? new Intl.NumberFormat("en").format(
                          payload[0].payload
                            .diff_annotation_review_aud_duration_tohour
                        )
                      : 0
                  }`}
                  <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review duration : ${
                    payload[0].payload.review_aud_duration_tohour
                      ? new Intl.NumberFormat("en").format(
                          payload[0].payload.review_aud_duration_tohour
                        )
                      : 0
                  }`}</p>
                </p>
              </p>
            </p>
          </p>
        }
        </div>
      );
    }

    return null;
  };

  return (
    <Box className={classes.modelChartSection}>
      {/* Section Title */}
      <Typography 
        variant="h6" 
        sx={{
          mb: 2,
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#1a1a2e',
          letterSpacing: '-0.01em',
        }}
      >
        {`Audio Duration — ${analyticsData[0].projectType}`}
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.8125rem', 
            color: '#6b7280',
            fontWeight: 400,
            mt: 0.25,
          }}
        >
          Annotated vs Reviewed audio duration by language
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
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
              Dashboard
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>
              {graphCategory=="rawAudioDuration"?"Raw Audio":"Audio Duration"}
            </Typography>
          </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                Total Hours
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>
                {totalAudioHours &&
                  new Intl.NumberFormat("en").format(totalAudioHours)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                Annotated Hours
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#ea580c' }}>
                {totalAnnotationAudioHours &&
                  new Intl.NumberFormat("en").format(totalAnnotationAudioHours)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                Reviewed Hours
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>
                {totalReviewAudioHours &&
                  new Intl.NumberFormat("en").format(totalReviewAudioHours)}
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
              height={90}
              interval={0}
              position="insideLeft"
              type="category"
              angle={-30}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            >
              <Label
                value="Languages"
                position="insideBottom"
                fontWeight="600"
                fontSize={13}
                fill="#4b5563"
              ></Label>
            </XAxis>
            <YAxis
              tickInterval={10}
              allowDecimals={false}
              type="number"
              dx={0}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en", { notation: "compact" }).format(
                  value
                )
              }
            >
              <Label
                value="# Hours Completed"
                angle={-90}
                position="insideLeft"
                fontWeight="600"
                fontSize={13}
                fill="#4b5563"
                offset={-10}
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
              dataKey={graphCategory=="rawAudioDuration"?"review_raw_aud_duration_tohour":"review_aud_duration_tohour"}
              barSize={30}
              name="Review"
              stackId="a"
              fill="#16a34a"
              cursor="pointer"
            />
            <Bar
              dataKey={graphCategory=="rawAudioDuration"?"diff_annotation_review_raw_aud_duration_tohour":"diff_annotation_review_aud_duration_tohour"}
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
  );
}
