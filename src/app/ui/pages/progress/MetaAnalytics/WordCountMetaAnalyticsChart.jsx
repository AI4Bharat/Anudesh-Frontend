import React from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Label,
  } from "recharts";
  import DatasetStyle from "@/styles/dataset";
  import { useEffect, useState } from "react";
  import ResponsiveChartContainer from "@/components/common/ResponsiveChartContainer"

export default function WordCountMetaAnalyticsChart(props) {
     /* eslint-disable react-hooks/exhaustive-deps */

    const {analyticsData,graphCategory} = props
    const classes = DatasetStyle();
    const [totalWordCount, setTotalWordCount] = useState();
    const [totalAnnotationWordCount, setTotalAnnotationWordCount] = useState();
    const [totalReviewWordCount, setTotalReviewWordCount] = useState();
    const [data, setData] = useState([]);

    useEffect(() => {
      if (graphCategory=="audioWordCount"){
        analyticsData?.sort(
          (a, b) =>
            b.annotation_audio_word_count -
            a.annotation_audio_word_count
        );
        setData(analyticsData);
        let allAnnotatorAudioWordCount = 0;
        let allReviewAudioWordCount = 0;
        var languages;
        analyticsData?.map((element, index) => {
            allAnnotatorAudioWordCount +=
            (element.annotation_audio_word_count?element.annotation_audio_word_count:0);
            allReviewAudioWordCount += (element.review_audio_word_count?element.review_audio_word_count:0);
          languages = element.languages;
        });
    
        setTotalAnnotationWordCount(allAnnotatorAudioWordCount);
        setTotalReviewWordCount(allReviewAudioWordCount);
        setTotalWordCount(
          allAnnotatorAudioWordCount + allReviewAudioWordCount
        );
      }
      else if (graphCategory=="ocrWordCount"){
        analyticsData?.sort(
          (a, b) =>
            b.ann_ocr_cumulative_word_count -
            a.ann_ocr_cumulative_word_count
        );
    
        setData(analyticsData);
        let allAnnotatorCumulativeWordCount = 0;
        let allReviewCumulativeWordCount = 0;
        var languages;
        analyticsData?.map((element, index) => {
            allAnnotatorCumulativeWordCount +=
            element.ann_ocr_cumulative_word_count;
            allReviewCumulativeWordCount += element.rew_ocr_cumulative_word_count;
          languages = element.languages;
        });
    
        setTotalAnnotationWordCount(allAnnotatorCumulativeWordCount);
        setTotalReviewWordCount(allReviewCumulativeWordCount);
        setTotalWordCount(
            allAnnotatorCumulativeWordCount + allReviewCumulativeWordCount
        );
      }
      else{
        analyticsData?.sort(
          (a, b) =>
            b.annotation_cumulative_word_count -
            a.annotation_cumulative_word_count
        );
        setData(analyticsData);
        let allAnnotatorCumulativeWordCount = 0;
        let allReviewCumulativeWordCount = 0;
        var languages;
        analyticsData?.map((element, index) => {
            allAnnotatorCumulativeWordCount +=
            element.annotation_cumulative_word_count;
            allReviewCumulativeWordCount += element.review_cumulative_word_count;
          languages = element.languages;
        });
    
        setTotalAnnotationWordCount(allAnnotatorCumulativeWordCount);
        setTotalReviewWordCount(allReviewCumulativeWordCount);
        setTotalWordCount(
            allAnnotatorCumulativeWordCount + allReviewCumulativeWordCount
        );
      }
    }, [analyticsData]);


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className={classes.toolTip}>
              <p style={{ fontWeight: "bold" }}>
                {`${label}`}
                {graphCategory=="audioWordCount"?<p style={{ fontWeight: "normal" }}>
                  {`Total count : ${
                    payload[0].payload.annotation_audio_word_count
                      ? new Intl.NumberFormat("en").format(
                          payload[0].payload.annotation_audio_word_count
                        )
                      : 0
                  }`}
                  <p style={{ color: "rgba(243, 156, 18 )" }}>
                    {`Annotation : ${
                      payload[0].payload.diff_annotation_review_audio_word
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.diff_annotation_review_audio_word
                          )
                        : 0
                    }`}
                    <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review : ${
                      payload[0].payload.review_audio_word_count
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.review_audio_word_count
                          )
                        : 0
                    }`}</p>
                  </p>  
                </p>
                :
                graphCategory=="ocrWordCount"?(<p style={{ fontWeight: "normal" }}>
                  {`Total count : ${
                    payload[0].payload.ann_ocr_cumulative_word_count
                      ? new Intl.NumberFormat("en").format(
                          payload[0].payload.ann_ocr_cumulative_word_count
                        )
                      : 0
                  }`}
                  <p style={{ color: "rgba(243, 156, 18 )" }}>
                    {`Annotation : ${
                      payload[0].payload.diff_annotation_review_ocr_word
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.diff_annotation_review_ocr_word
                          )
                        : 0
                    }`}
                    <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review : ${
                      payload[0].payload.rew_ocr_cumulative_word_count
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.rew_ocr_cumulative_word_count
                          )
                        : 0
                    }`}
                    </p>
                  </p>  
                </p>)
                :
                (<p style={{ fontWeight: "normal" }}>
                  {`Total count : ${
                    payload[0].payload.annotation_cumulative_word_count
                      ? new Intl.NumberFormat("en").format(
                          payload[0].payload.annotation_cumulative_word_count
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
                      payload[0].payload.review_cumulative_word_count
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.review_cumulative_word_count
                          )
                        : 0
                    }`}
                    </p>
                  </p>  
                </p>)
                }
              </p>
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
        {`Word Count — ${analyticsData[0].projectType}`}
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.8125rem', 
            color: '#6b7280',
            fontWeight: 400,
            mt: 0.25,
          }}
        >
          Annotated vs Reviewed word counts by language
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
              Word Count
            </Typography>
          </Box>
          <Box className={classes.topBarInnerBox}>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
              Total Words
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>
              {totalWordCount &&
                new Intl.NumberFormat("en").format(totalWordCount)}
            </Typography>
          </Box>
          <Box className={classes.topBarInnerBox}>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
              Annotated
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#ea580c' }}>
              {totalAnnotationWordCount &&
                new Intl.NumberFormat("en").format(totalAnnotationWordCount)}
            </Typography>
          </Box>
          <Box className={classes.topBarInnerBox}>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
              Reviewed
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>
              {totalReviewWordCount &&
                new Intl.NumberFormat("en").format(totalReviewWordCount)}
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
                  value="Language"
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
                  value="# Words Completed"
                  angle={-90}
                  position='insideLeft'
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
                dataKey={graphCategory=='audioWordCount'?"review_audio_word_count":graphCategory=="ocrWordCount"?"rew_ocr_cumulative_word_count":"review_cumulative_word_count"}
                barSize={30}
                name="Review"
                stackId="a"
                fill="#16a34a"
                cursor="pointer"
              />
              <Bar
                dataKey={graphCategory=='audioWordCount'?"diff_annotation_review_audio_word":graphCategory=="ocrWordCount"?"diff_annotation_review_ocr_word":"diff_annotation_review"}
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
  )
}
