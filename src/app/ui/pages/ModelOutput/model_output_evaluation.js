"use client";

import { useState, useEffect } from "react";
import Button from "../../../../components/common/Button";
import ReactMarkdown from "react-markdown";
import RefreshIcon from "@mui/icons-material/Refresh";
import ModelResponseEvaluationStyle from "@/styles/ModelResponseEvaluation";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Box,
  Typography,
  Icon,
  IconButton,
  Grid,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
} from "@mui/material";
import "./model_response_evaluation.css";
import { Paper } from "@mui/material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Resizable } from "re-resizable";
import { translate } from "@/config/localisation";
import GetTaskAnnotationsAPI from "@/app/actions/api/Dashboard/GetTaskAnnotationsAPI";
import GetTaskDetailsAPI from "@/app/actions/api/Dashboard/getTaskDetails";
import { useParams } from "react-router-dom";
// import { questions } from "./config";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
// import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";

const ModelOutputEvaluation = ({
  currentInteraction,
  setCurrentInteraction,
  interactions,
  setInteractions,
  forms,
  setForms,
  stage,
  answered,
  setAnswered,
  setLoading,
  loading,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { taskId } = useParams();
  const classes = ModelResponseEvaluationStyle();
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  // const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [blank, setBlank] = useState("");
  const questions =
    useSelector((state) => state.getProjectDetails.data.metadata_json) ?? [];
  const toggleLeftPanel = () => {
    setLeftPanelVisible(!leftPanelVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      const taskAnnotationsObj = new GetTaskAnnotationsAPI(taskId);
      const response = await fetch(taskAnnotationsObj.apiEndPoint(), {
        method: "GET",
        headers: taskAnnotationsObj.getHeaders().headers,
      });
      const annotationForms = await response.json();
      let formsData = [];

      if (
        annotationForms &&
        Array.isArray(annotationForms[0]?.result) &&
        [...annotationForms[0]?.result]?.length
      ) {
        if (stage === "Review") {
          let reviewData = annotationForms.find(
            (item) => item.annotation_type === 2,
          );
          if (reviewData.annotation_status === "unreviewed") {
            reviewData = annotationForms.find(
              (item) => item.annotation_type === 1,
            );
          }
          formsData = reviewData?.result;
        } else if (stage === "SuperChecker") {
          let superCheckerData = annotationForms.filter(
            (data) => data.annotation_type == 3,
          );
          formsData = superCheckerData[0]?.result;
        } else if (stage === "Annotation") {
          let annotationData = annotationForms.filter(
            (data) => data.annotation_type == 1,
          );
          formsData = annotationData[0]?.result;
        }
      } else if (
        annotationForms &&
        Array.isArray(annotationForms[0]?.result) &&
        [...annotationForms[0]?.result]?.length === 0 &&
        stage === "SuperChecker"
      ) {
        let superCheckerData = annotationForms.filter(
          (data) => data.annotation_type == 3,
        );
        if (superCheckerData[0].annotation_status === "unvalidated") {
          superCheckerData = annotationForms.find(
            (item) => item.annotation_type == 1,
          );
        }
        formsData = superCheckerData?.result;
        setForms(formsData?.length ? [...formsData] : []);
      };
      fetchData();
    }, [taskId, stage]);

  const handleReset = () => {
    setCurrentInteraction((prev) => ({
      ...prev,
      // rating: null,
      questions_response: Array(questions?.length).fill(null),
    }));
  };

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
    if (forms?.length > 0 && interactions?.length > 0) {
      const defaultFormId = 1;
      const currentForm = forms.find(
        (form) => form?.prompt_output_pair_id === defaultFormId,
      );

      if (
        currentForm &&
        (!currentInteraction ||
          currentInteraction?.prompt !== currentForm?.prompt)
      ) {
        const questionsResponse =
          currentForm?.questions_response ||
          Array(questions?.length).fill(null);

        const newState = {
          prompt: currentForm?.prompt || "",
          output:
            typeof currentForm?.output === "string"
              ? currentForm.output
              : currentForm?.output?.map((item) => item.value).join(", ") || "",
          prompt_output_pair_id: currentForm?.prompt_output_pair_id,
          additional_note: currentForm?.additional_note || "",
          questions_response: questionsResponse,
        };

        setCurrentInteraction(newState);
      }
    }
  }, [forms, interactions, questions?.length, taskId]);

  useEffect(() => {
    if (forms?.length === 0 && interactions?.length > 0) {
      const initialForms = interactions?.map((interaction) => ({
        prompt: interaction?.prompt,
        output: interaction?.output,
        prompt_output_pair_id: interaction?.prompt_output_pair_id,
        additional_note: null,
        questions_response: questions?.map((question) => ({
          question,
          response: [],
        })),
      }));
      setForms(initialForms);
    }
  }, [forms, interactions, taskId]);

  useEffect(() => {
    if (!forms || forms.length === 0) {
      setAnswered(false);
      return;
    }

    const allFormsAnswered = forms.every((form) => {
      if (!form) {
        return false;
      }

      const mandatoryQuestions = questions.filter((question) => {
        return question.mandatory && question.mandatory === true;
      });

      const allMandatoryAnswered = mandatoryQuestions.every((question) => {
        let parts = 0;
        if (question.question_type === "fill_in_blanks") {
          parts = question?.input_question?.split("<blank>")?.length;
        }
        const mandatoryQuestion = form?.questions_response?.find(
          (qr) =>
            qr?.question?.input_question === question?.input_question &&
            qr?.question?.question_type === question?.question_type,
        );
        if (!mandatoryQuestion?.response) {
          return false;
        }
        if (question.question_type === "fill_in_blanks") {
          if (mandatoryQuestion?.response?.length !== parts - 1) {
            return false;
          }
          return !mandatoryQuestion.response.some(
            (response) => response === "" || response === undefined,
          );
        }
        return (
          mandatoryQuestion.response.length > 0 &&
          !mandatoryQuestion.response.some(
            (response) => response === "" || response === undefined,
          )
        );
      });

      return allMandatoryAnswered;
    });
    setAnswered(allFormsAnswered);
  }, [forms, taskId]);

  const handleRating = (rating, interactionIndex) => {
    setCurrentInteraction((prev) => {
      const selectedQuestion = questions[interactionIndex];
      const ratingArray = [String(rating)];
      // const ratingScaleList = selectedQuestion?.rating_scale_list;
      const updatedQuestionsResponse = prev.questions_response.map(
        (q, index) => {
          if (index === interactionIndex) {
            return {
              ...q,
              response: ratingArray,
            };
          }
          return q;
        },
      );
      const updatedInteraction = {
        ...prev,
        questions_response: updatedQuestionsResponse,
      };
      setForms((prevInteractions) =>
        prevInteractions.map((interaction) =>
          interaction.prompt_output_pair_id === prev.prompt_output_pair_id
            ? updatedInteraction
            : interaction,
        ),
      );

      return updatedInteraction;
    });
  };

  const handleMCQ = (selectedOption, interactionIndex) => {
    // const selectedQuestion = selectedQuestions[interactionIndex];
    const answerArray = [String(selectedOption)];

    setCurrentInteraction((prev) => {
      const updatedQuestionsResponse = prev.questions_response.map(
        (q, index) => {
          if (index === interactionIndex) {
            return {
              ...q,
              response: answerArray,
            };
          }
          return q;
        },
      );

      const updatedInteraction = {
        ...prev,
        questions_response: updatedQuestionsResponse,
      };

      setForms((prevInteractions) =>
        prevInteractions.map((interaction) =>
          interaction.prompt_output_pair_id === prev.prompt_output_pair_id
            ? updatedInteraction
            : interaction,
        ),
      );

      return updatedInteraction;
    });
  };
  const handleMultiSelect = (isChecked, selectedOption, interactionIndex) => {
    const selectedQuestion = questions[interactionIndex];
    const indexInQuestions = questions?.findIndex(
      (q) => q.id === selectedQuestion?.id,
    );

    setCurrentInteraction((prev) => {
      const updatedQuestionsResponse = prev.questions_response.map(
        (q, index) => {
          if (index === interactionIndex) {
            const updatedAnswers = isChecked
              ? [...(q?.response || []), selectedOption]
              : q?.response.filter((answer) => answer !== selectedOption);

            return {
              ...q,
              response: updatedAnswers,
            };
          }
          return q;
        },
      );

      const updatedInteraction = {
        ...prev,
        questions_response: updatedQuestionsResponse,
      };

      setForms((prevInteractions) =>
        prevInteractions.map((interaction) =>
          interaction.prompt_output_pair_id === prev.prompt_output_pair_id
            ? updatedInteraction
            : interaction,
        ),
      );

      return updatedInteraction;
    });
  };
  const handleOptionChange = (selectedIndex, answer) => {
    setCurrentInteraction((prev) => {
      const newAnswers = questions?.map((question, i) => {
        if (questions[selectedIndex] === question) {
          return { question, answer: answer || null };
        } else {
          return (
            prev.questions_response?.find(
              (response) => response?.question === question,
            ) || { question, answer: null }
          );
        }
      });

      const updatedInteraction = {
        ...prev,
        questions_response: newAnswers,
      };
      setForms((prevForms) =>
        prevForms.map((form) =>
          form?.prompt_output_pair_id === prev.prompt_output_pair_id
            ? updatedInteraction
            : form,
        ),
      );

      return updatedInteraction;
    });
  };

  const handleNoteChange = (event) => {
    const newNote = event.target.value;
    setCurrentInteraction((prev) => {
      const updatedInteraction = {
        ...prev,
        additional_note: newNote,
      };
      setForms((prevForms) =>
        prevForms.map((form) =>
          form?.prompt_output_pair_id === prev.prompt_output_pair_id
            ? updatedInteraction
            : form,
        ),
      );

      return updatedInteraction;
    });
  };
  const formatPrompt = (prompt) => {
    const lines = prompt?.split("\n");
    const markdownString = lines?.join("  \n");
    return markdownString;
  };
  const handleFormBtnClick = (e) => {
    const clickedPromptOutputPairId = parseInt(e.target.id);
    const currInteraction = forms?.find(
      (interaction) =>
        interaction?.prompt_output_pair_id === clickedPromptOutputPairId,
    );
    if (currInteraction) {
      setCurrentInteraction({
        prompt: currInteraction?.prompt,
        output: Array.isArray(currInteraction.output)
          ? currInteraction?.output?.map((item) => item.value).join(", ")
          : currInteraction.output,
        prompt_output_pair_id: currInteraction?.prompt_output_pair_id,
        // rating: currInteraction?.rating || null,
        additional_note: currInteraction?.additional_note || "",
        questions_response:
          currInteraction?.questions_response ||
          Array(questions.length).fill(null),
      });
    }
  };

  const handleInputChange = (e, interactionIndex, blankIndex) => {
    const { value } = e.target;

    setCurrentInteraction((prev) => {
      const updatedQuestionsResponse = prev.questions_response.map(
        (q, index) => {
          if (index === interactionIndex) {
            const updatedBlankAnswers = q?.response ? [...q?.response] : [];
            updatedBlankAnswers[blankIndex] = value;
            return {
              ...q,
              response: updatedBlankAnswers,
            };
          }
          return q;
        },
      );

      const updatedInteraction = {
        ...prev,
        questions_response: updatedQuestionsResponse,
      };

      setForms((prevForms) =>
        prevForms.map((form) =>
          form?.prompt_output_pair_id === prev.prompt_output_pair_id
            ? { ...form, questions_response: updatedQuestionsResponse }
            : form,
        ),
      );

      return updatedInteraction;
    });
  };

  const EvaluationForm = () => {
    return (
      <div className={classes.rightPanel}>
        <div className={classes.promptContainer} style={{ overflowY: "auto" }}>
          <div className={classes.heading} style={{ fontSize: "20px" }}>
            {translate("modal.prompt")}
          </div>
          <ReactMarkdown>
            {formatPrompt(currentInteraction?.prompt)}
          </ReactMarkdown>
        </div>
        <div className={classes.heading} style={{ fontSize: "20px" }}>
          {translate("modal.output")}
        </div>
        <div
          className={classes.outputContainer}
          style={{ maxHeight: "auto", overflowY: "auto" }}
        >
          <ReactMarkdown>
            {formatPrompt(currentInteraction?.output)}
          </ReactMarkdown>
        </div>
        <hr className={classes.hr} />
        {questions?.length > 0 ? (
          <div className={classes.heading}>{translate("modal.select_que")}</div>
        ) : (
          <div className={classes.heading}>
            {translate("modal.pls_select_que")}
          </div>
        )}
        <div
          style={{
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          {questions?.map((question, i) => {
            switch (question?.question_type) {
              case "fill_in_blanks":
                const splitQuestion = question?.input_question.split("<blank>");
                return (
                  <div key={i}>
                    <p className={classes.inputQuestion}>
                      {i + 1}.{" "}
                      {splitQuestion?.map((part, index) => (
                        <span key={`${i}-${index}`}>
                          {part}
                          {index < splitQuestion.length - 1 && (
                            <input
                              type="text"
                              value={
                                currentInteraction?.questions_response &&
                                  currentInteraction?.questions_response[i]
                                    ?.response.length > 0
                                  ? currentInteraction?.questions_response[i]
                                    ?.response[index]
                                  : ""
                              }
                              onChange={(e) => handleInputChange(e, i, index)}
                              style={{
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px",
                                fontSize: "14px",
                                lineHeight: "1.5",
                                verticalAlign: "middle",
                                width: "100%",
                                maxWidth: "200px",
                                margin: "4px 0",
                                boxSizing: "border-box",
                                backgroundColor: "white",
                                fontWeight: "normal",
                              }}
                              required={question.mandatory}
                            />
                          )}
                        </span>
                      ))}
                      {question.mandatory && (
                        <span style={{ color: "#d93025", fontSize: "25px" }}>
                          {" "}
                          *
                        </span>
                      )}
                    </p>
                  </div>
                );

              case "rating":
                return (
                  <div key={i}>
                    <div className={classes.inputQuestion}>
                      <span>
                        {i + 1}. {question.input_question}
                      </span>
                      {question.mandatory && (
                        <span style={{ color: "#d93025", fontSize: "25px" }}>
                          {" "}
                          *
                        </span>
                      )}
                    </div>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {Array.from(
                        { length: question.rating_scale_list.length },
                        (_, index) => (
                          <Button
                            key={index + 1}
                            className={`${classes.numBtn} ${currentInteraction?.questions_response
                              ? currentInteraction?.questions_response[i]
                                ?.response ==
                                index + 1
                                ? classes.selected
                                : ""
                              : ""
                              }`}
                            label={index + 1}
                            onClick={() => handleRating(index + 1, i)}
                            style={{
                              marginRight: "1rem",
                              marginLeft: "0.9px",
                              marginBottom: "2rem",
                              borderRadius: "1rem",
                              width: "47px",
                              padding: "13px",
                            }}
                            required={question.mandatory}
                          />
                        ),
                      )}
                    </Box>
                  </div>
                );

              case "multi_select_options":
                return (
                  <div key={i}>
                    <div className={classes.inputQuestion}>
                      {i + 1}. {question.input_question}
                      {question.mandatory && (
                        <span style={{ color: "#d93025", fontSize: "25px" }}>
                          {" "}
                          *
                        </span>
                      )}
                    </div>
                    <FormControl component="fieldset">
                      <FormGroup>
                        {question.input_selections_list.map((option, idx) => (
                          <FormControlLabel
                            key={idx}
                            control={
                              <Checkbox
                                onChange={(e) =>
                                  handleMultiSelect(e.target.checked, option, i)
                                }
                                checked={
                                  currentInteraction?.questions_response
                                    ? currentInteraction?.questions_response[
                                      i
                                    ]?.response?.includes(option) ?? false
                                    : ""
                                }
                              />
                            }
                            label={option}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </div>
                );

              case "mcq":
                return (
                  <div key={i}>
                    <div className={classes.inputQuestion}>
                      {i + 1}. {question.input_question}
                      {question.mandatory && (
                        <span style={{ color: "#d93025", fontSize: "25px" }}>
                          {" "}
                          *
                        </span>
                      )}
                    </div>
                    <FormControl
                      component="fieldset"
                      required={question.mandatory}
                    >
                      <RadioGroup
                        value={
                          currentInteraction?.questions_response
                            ? currentInteraction?.questions_response[i]
                              ?.response
                            : ""
                        }
                        onChange={(e) => handleMCQ(e.target.value, i)}
                      >
                        {question?.input_selections_list?.map((option, idx) => (
                          <FormControlLabel
                            key={idx}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
        <hr className={classes.hr} />
        <div className={classes.notesContainer}>
          {translate("model_evaluation_note")}
        </div>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          defaultSize="50px"
          placeholder={translate("model_evaluation_notes_placeholder")}
          value={
            currentInteraction?.additional_note
              ? currentInteraction?.additional_note
              : null
          }
          style={{ minHeight: "50px", maxHeight: "10rem", height: "50px" }}
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
                borderRadius: expanded[index] ? "1rem" : "1rem",
                boxShadow: expanded[index]
                  ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                  : "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderBottom: "none",
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
                    whiteSpace: expanded[index] ? "normal" : "nowrap",
                    maxWidth: "200px",
                    maxHeight: "3rem",
                    position: "relative",
                  }}
                  className={classes.promptTile}
                >
                  {pair?.prompt}
                  {expanded[index] && (
                    <Tooltip title={pair.prompt} placement="bottom">
                      <span
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        }}
                      >
                        {pair.text}
                      </span>
                    </Tooltip>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails style={{ display: "block", cursor: "pointer" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    marginTop: "1rem",
                  }}
                >
                  <Button
                    label={translate("model_evaluation_btn")}
                    buttonVariant={"outlined"}
                    style={{
                      marginTop: "1rem",
                      padding: "0.5rem",
                    }}
                    onClick={handleFormBtnClick}
                    id={pair?.prompt_output_pair_id}
                  />
                  <Button
                    label="Reset"
                    buttonVariant={"outlined"}
                    style={{
                      marginTop: "1rem",
                      marginLeft: "1.5rem",
                    }}
                    onClick={handleReset}
                  />
                </Box>
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
        // maxWidth={"70%"}
        enable={{ right: true, top: false, bottom: false, left: false }}
      >
        <div
          className={classes.heading}
          style={{ margin: "2rem 0 0.5rem 1.5rem", fontSize: "20px" }}
        >
          {translate("modal.interact")}
        </div>
        <Paper
          className={classes.interactionWindow}
          style={{ border: "none", backgroundColor: "#f0f0f0" }}
        >
          {interactions && (
            <PairAccordion pairs={interactions} classes={classes} />
          )}
        </Paper>
      </Resizable>
    );
  };

  return (
    <>
      <div className={classes.container} style={{ width: "2300px" }}>
        <IconButton onClick={toggleLeftPanel}>
          <ExpandMoreIcon />
        </IconButton>
        {leftPanelVisible && <InteractionDisplay />}
        <Divider orientation="vertical" flexItem />
        {EvaluationForm()}
      </div>
    </>
  );
};

export default ModelOutputEvaluation;
