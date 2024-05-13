"use client";

import { useState, useEffect } from "react";
import Button from "../../../../components/common/Button";
import ModelResponseEvaluationStyle from "@/styles/ModelResponseEvaluation";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Box,
} from "@mui/material";
import "./model_response_evaluation.css";
import { Paper } from "@mui/material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Resizable } from "re-resizable";
import { translate } from "@/config/localisation";
import GetTaskAnnotationsAPI from "@/app/actions/api/Dashboard/GetTaskAnnotationsAPI";
import GetTaskDetailsAPI from "@/app/actions/api/Dashboard/getTaskDetails";
import { useParams } from "react-router-dom";
import { questions } from "./config";

const ModelInteractionEvaluation = ({currentInteraction,setCurrentInteraction}) => {
    /* eslint-disable react-hooks/exhaustive-deps */

  const {taskId} = useParams();
  const classes = ModelResponseEvaluationStyle();
  const [interactions, setInteractions] = useState([]);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const taskAnnotationsObj = new GetTaskAnnotationsAPI(taskId);
      const response = await fetch(taskAnnotationsObj.apiEndPoint(), {
        method: "GET",
        headers: taskAnnotationsObj.getHeaders().headers,
      });
      const annotationForms = await response.json();
      console.log(annotationForms);
      setForms(annotationForms[0]?.result.length ? [...annotationForms[0]?.result] : [])
    };
    fetchData();
  }, [taskId]);

  useEffect(() => {
    const fetchData = async () => {
      const taskDetailsObj = new GetTaskDetailsAPI(taskId);
      const taskResponse = await fetch(taskDetailsObj.apiEndPoint(), {
        method: "GET",
        headers: taskDetailsObj.getHeaders().headers,
      });
      const taskData = await taskResponse.json();
      setInteractions(taskData ? [...taskData.data?.interactions_json] : []);
    };
    fetchData();
  }, [forms, taskId]);

  useEffect(() => {
    if (forms && interactions) {
      let defaultFormIndex = interactions[0]?.prompt_output_pair_id;
      let currentForm = forms.filter(
        (form) => form.prompt_output_pair_id == defaultFormIndex,
      );
      currentForm &&
        setCurrentInteraction((prev) => {
          return {
            prompt: interactions[0]?.prompt,
            output: interactions[0]?.output,
            prompt_output_pair_id: interactions[0]?.prompt_output_pair_id,
            rating: currentForm[0]?.form_output_json?.rating,
            additional_note: currentForm[0]?.form_output_json?.additional_note,
            questions_response:
              currentForm[0]?.form_output_json?.questions_response?.map(
                (obj) => {
                  let response = "";
                  if (obj) {
                    Object.entries(obj).forEach(([key, value]) => {
                      response = value;
                    });
                  }
                  return response;
                },
              ),
          };
        });
    }
  }, [forms, interactions]);

  const handleOptionChange = (index, answer) => {
    const newAnswers = currentInteraction.questions_response
      ? [...currentInteraction.questions_response]
      : [...Array(questions.length)].fill(null);
    newAnswers[index] = answer;
    setCurrentInteraction((prev) => {
      return {
        ...prev,
        questions_response: newAnswers,
      };
    });
  };

  const handleRating = (rating) => {
    setCurrentInteraction((prev) => {
      return {
        ...prev,
        rating: rating,
      };
    });
  };

  const handleNoteChange = (event) => {
    setCurrentInteraction((prev) => {
      return {
        ...prev,
        additional_note: event.target.value,
      };
    });
  };

  const handleFormBtnClick = (e) => {
    const currInteractionPair = interactions.filter(
      (interaction) => interaction.prompt_output_pair_id == e.target.id,
    )[0];
    const currFormResponse = forms.filter(
      (form) => form.prompt_output_pair_id == e.target.id,
    );
    setCurrentInteraction((prev) => ({
      prompt: currInteractionPair.prompt,
      output: currInteractionPair.output,
      prompt_output_pair_id: currInteractionPair.prompt_output_pair_id,
      rating: currFormResponse?.form_output_json?.rating,
      additional_note: currFormResponse?.form_output_json?.additional_note,
      questions_response:
        currFormResponse?.form_output_json?.questions_response?.map((obj) => {
          let response = "";
          if (obj) {
            Object.entries(obj).forEach(([key, value]) => {
              response = value;
            });
          }
          return response;
        }),
    }));
  };

  const EvaluationForm = () => {
    return (
      <div className={classes.rightPanel}>
        <div className={classes.promptContainer}>
          {currentInteraction.prompt}
        </div>
        <div className={classes.outputContainer}>
          {currentInteraction.output}
        </div>
        <div className={classes.ratingText}>
          {translate("model_evaluation_rating")}
        </div>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {Array.from({ length: 7 }, (_, index) => (
            <Button
              key={index + 1}
              className={`${classes.numBtn} ${
                currentInteraction.rating === index + 1 ? classes.selected : ""
              }`}
              label={index + 1}
              onClick={() => handleRating(index + 1)}
              style={{
                marginRight: "1rem",
                marginLeft: "0.9px",
                marginBottom: "2rem",
                borderRadius: "1rem",
                width: "47px",
                padding: "13px",
              }}
            />
          ))}
        </Box>
        <hr className={classes.hr} />
        <div style={{
          overflowY: 'scroll'
        }}>
        {questions.map((question, index) => (
          <div key={index} className={classes.questionContainer}>
            <div className={classes.questionText}>{question}</div>
            <div className={classes.radioGroupContainer}>
              <RadioGroup
                row
                value={
                  currentInteraction?.questions_response
                    ? currentInteraction.questions_response[index]
                    : null
                }
                onChange={(event) =>
                  handleOptionChange(index, event.target.value)
                }
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio className={classes.orangeRadio} />}
                  label={<span className={classes.yesText}>Yes</span>}
                />
                <FormControlLabel
                  value="No"
                  control={<Radio className={classes.orangeRadio} />}
                  label={<span className={classes.yesText}>No</span>}
                />
              </RadioGroup>
            </div>
          </div>
        ))}
        </div>
        <div className={classes.notesContainer}>
          {translate("model_evaluation_note")}
        </div>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          placeholder={translate("model_evaluation_notes_placeholder")}
          value={
            currentInteraction.additional_note
              ? currentInteraction.additional_note
              : null
          }
          onChange={handleNoteChange}
          className={classes.notesTextarea}
        />
      </div>
    );
  };

  const PairAccordion = ({ pairs, classes }) => {
    const [expanded, setExpanded] = useState(Array(pairs.length).fill(false));

    const handleAccordionChange = (index) => (event, isExpanded) => {
      setExpanded((prevExpanded) => {
        const newExpanded = [...prevExpanded];
        newExpanded[index] = isExpanded;
        return newExpanded;
      });
    };

    return (
      <div>
        {pairs.map((pair, index) => {
          return (
            <Accordion
              key={index}
              expanded={expanded[index]}
              onChange={handleAccordionChange(index)}
              className={classes.accordion}
              style={{
                borderRadius: expanded[index] ? "1rem" : "0",
                boxShadow: expanded[index]
                  ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                  : "none",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
                classes={{
                  content: "MuiAccordionSummary-content",
                  expanded: "Mui-expanded",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  className={classes.promptTile}
                >
                  {pair.prompt}
                </Box>
              </AccordionSummary>
              <AccordionDetails style={{ display: "block", cursor: "pointer" }}>
                <Box
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  className={classes.answerTile}
                >
                  {pair.output}
                </Box>
                <Button
                  label={translate("model_evaluation_btn")}
                  buttonVariant={"outlined"}
                  style={{
                    marginTop: "1rem",
                  }}
                  onClick={handleFormBtnClick}
                  id={pair.prompt_output_pair_id}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    );
  };

  const InteractionDisplay = () => {
    return (
      <Resizable
        defaultSize={{
          width: "30%",
          height: "100%",
        }}
        minWidth={"20%"}
        maxWidth={"70%"}
        enable={{ right: true, top: false, bottom: false, left: false }}
      >
        <Paper className={classes.interactionWindow}>
          {interactions && (
            <PairAccordion pairs={interactions} classes={classes} />
          )}
        </Paper>
      </Resizable>
    );
  };

  return (
    <>
      <div className={classes.container}>
        {InteractionDisplay()}
        {EvaluationForm()}
      </div>
    </>
  );
};

export default ModelInteractionEvaluation;
