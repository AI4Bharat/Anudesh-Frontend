"use client";

import { useState, useEffect } from "react";
import Button from "../../../../components/common/Button";
import ReactMarkdown from "react-markdown";
import RefreshIcon from "@mui/icons-material/Refresh";
import Spinner from "@/components/common/Spinner";
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
import "../model_response_evaluation/model_response_evaluation.css";
import { Paper } from "@mui/material";
import Divider from "@mui/material/Divider";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { Resizable } from "re-resizable";
import { translate } from "@/config/localisation";
import GetTaskAnnotationsAPI from "@/app/actions/api/Dashboard/GetTaskAnnotationsAPI";
import GetTaskDetailsAPI from "@/app/actions/api/Dashboard/getTaskDetails";
import { useParams } from "react-router-dom";
// import { questions } from "./config";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";
import { output } from "../../../../../next.config";
import { fontSize } from "@mui/system";
// import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";

const PreferenceRanking = ({
  currentInteraction,
  setCurrentInteraction,
  interactions,
  setInteractions,
  forms,
  setForms,
  stage,
  answered,
  setAnswered,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { taskId } = useParams();
  const classes = ModelResponseEvaluationStyle();
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  // const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [blank, setBlank] = useState("");
  const questions =
    useSelector((state) => state.getProjectDetails.data.metadata_json) ?? [];
  console.log("questions that were fetched: " + typeof questions);
  const toggleLeftPanel = () => {
    setLeftPanelVisible(!leftPanelVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const taskAnnotationsObj = new GetTaskAnnotationsAPI(taskId);
      const response = await fetch(taskAnnotationsObj.apiEndPoint(), {
        method: "GET",
        headers: taskAnnotationsObj.getHeaders().headers,
      });
      const annotationForms = await response.json();
      let formsData = [];
      console.log(annotationForms[0].result?.length);

      if (
        annotationForms &&
        Array.isArray(annotationForms[0]?.result) &&
        [...annotationForms[0]?.result]?.length
      ) {
        console.log(stage);
        if (stage === "Review") {
          console.log("here in review if");
          let reviewData = annotationForms.find(
            (item) => item.annotation_type === 2,
          );
          if (reviewData.annotation_status === "unreviewed") {
            reviewData = annotationForms.find(
              (item) => item.annotation_type === 1,
            );
          }
          formsData = reviewData?.result;
          console.log("reviewdata: " + JSON.stringify(reviewData));
          console.log(formsData);
        } else if (stage === "SuperChecker") {
          console.log("here in sc if");
          let superCheckerData = annotationForms.filter(
            (data) => data.annotation_type == 3,
          );
          console.log(superCheckerData[0].annotation_status);
          console.log("supercheckdata: " + JSON.stringify(superCheckerData));
          formsData = superCheckerData[0]?.result;
          console.log(formsData);
        } else if (stage === "Annotation") {
          console.log("here in annotation if");
          let annotationData = annotationForms.filter(
            (data) => data.annotation_type == 1,
          );
          console.log("annotationdata: " + JSON.stringify(annotationData));
          formsData = annotationData[0]?.result;
          console.log(formsData);
        } else {
          console.log("here in else");
        }
      } else if (
        annotationForms &&
        Array.isArray(annotationForms[0]?.result) &&
        [...annotationForms[0]?.result]?.length === 0 &&
        stage === "SuperChecker"
      ) {
        console.log("here in sc if");
        let superCheckerData = annotationForms.filter(
          (data) => data.annotation_type == 3,
        );
        console.log(superCheckerData[0].annotation_status);
        if (superCheckerData[0].annotation_status === "unvalidated") {
          superCheckerData = annotationForms.find(
            (item) => item.annotation_type == 1,
          );
        }
        console.log("supercheckdata: " + JSON.stringify(superCheckerData));
        formsData = superCheckerData?.result;
        console.log(formsData);
      }
      setForms(formsData?.length ? [...formsData] : []);
      setLoading(false);
    };
    fetchData();
  }, [taskId, stage]);

  const handleReset = () => {
    setCurrentInteraction((prev) => ({
      ...prev,
      model_responses_json: prev.model_responses_json.map((response) => ({
        ...response,
        questions_response: Array(
          response.questions_response?.length || 0,
        ).fill(null),
      })),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const taskDetailsObj = new GetTaskDetailsAPI(taskId);
      const taskResponse = await fetch(taskDetailsObj.apiEndPoint(), {
        method: "GET",
        headers: taskDetailsObj.getHeaders().headers,
      });
      const taskData = await taskResponse.json();
      setInteractions(
        taskData ? [...taskData.data?.multiple_interaction_json] : [],
      );
      setLoading(false);
      console.log(interactions);
    };
    fetchData();
  }, [forms, taskId]);

  useEffect(() => {
    if (forms?.length === 0 && interactions?.length > 0) {
      const initialForms = interactions?.map((interaction) => {
        const modelResponses = interaction?.model_responses_json
          ?.map((modelResponse) => {
            return Object.values(modelResponse).map((response) => {
              return {
                ...response,
                questions_response: questions?.map((question) => ({
                  question,
                  response: [],
                })),
              };
            });
          })
          .flat();

        return {
          prompt: interaction?.prompt,
          model_responses_json: modelResponses,
          prompt_output_pair_id: interaction?.prompt_output_pair_id,
          additional_note: interaction?.additional_note,
        };
      });

      console.log("init forms: ", initialForms);
      setForms(initialForms);
    }
  }, [forms, interactions, taskId]);

  useEffect(() => {
    if (
      forms?.length > 0 &&
      interactions?.length > 0 &&
      !currentInteraction?.prompt
    ) {
      const defaultFormId = 1;

      const currentForm = forms?.find(
        (form) => form?.prompt_output_pair_id == defaultFormId,
      );
      if (currentForm) {
        console.log("current form: " + JSON.stringify(currentForm));
        const modelResponses = currentForm?.model_responses_json?.map(
          (modelResponse) => {
            return {
              ...modelResponse,
              output: Array.isArray(modelResponse.output)
                ? modelResponse.output.map((item) => item.value).join(", ")
                : modelResponse.output,
              questions_response:
                modelResponse?.questions_response?.map(
                  (questionResponse, index) => ({
                    ...questionResponse,
                    question: questions[index],
                    response: questionResponse?.response || [],
                  }),
                ) || [],
            };
          },
        );

        const newState = {
          prompt: currentForm?.prompt || "",
          model_responses_json: modelResponses,
          prompt_output_pair_id: currentForm?.prompt_output_pair_id,
          additional_note: currentForm?.additional_note || "",
        };
        setCurrentInteraction(newState);
        console.log(currentInteraction, "new");
      }
    }
  }, [forms, interactions, questions?.length, taskId]);

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
      console.log("mandatory questions: " + JSON.stringify(mandatoryQuestions));

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

      console.log("all answered for form: " + allMandatoryAnswered);
      return allMandatoryAnswered;
    });

    console.log("all forms answered?: " + allFormsAnswered);
    setAnswered(allFormsAnswered);
  }, [forms, taskId]);

  const styles = {
    responseContainer: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },
    responseBox: {
      flex: "1 1 45%",
      minWidth: "300px",
      border: "1px solid #ccc",
      fontSize: "16px",
      padding: "10px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "white",
    },
    response1Box: {
      flex: "1 1 45%",
      minWidth: "300px",
      border: "1px solid #ccc",
      padding: "10px",
      fontSize: "17px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "white",
    },
  };

  const handleRating = (rating, interactionIndex, outputIdx) => {
    setCurrentInteraction((prev) => {
      const selectedQuestion = questions[interactionIndex];
      const ratingArray = [String(rating)];
      const updatedModelResponses = prev?.model_responses_json?.map(
        (modelResponse, modelIdx) => {
          if (modelIdx === outputIdx) {
            const updatedQuestionsResponse =
              modelResponse?.questions_response?.map((q, index) => {
                if (index === interactionIndex) {
                  return {
                    ...q,
                    response: ratingArray,
                  };
                }
                return q;
              });

            return {
              ...modelResponse,
              questions_response: updatedQuestionsResponse,
            };
          }
          return modelResponse;
        },
      );

      const updatedInteraction = {
        ...prev,
        model_responses_json: updatedModelResponses,
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

  const handleMCQ = (event, selectedOption, interactionIndex, outputIdx) => {
    const answerArray = [String(selectedOption)];
    console.log(selectedOption);

    setCurrentInteraction((prev) => {
      const updatedModelResponses = prev?.model_responses_json?.map(
        (modelResponse, modelIdx) => {
          if (modelIdx === outputIdx) {
            const updatedQuestionsResponse =
              modelResponse?.questions_response?.map((q, index) => {
                if (index === interactionIndex) {
                  return {
                    ...q,
                    response: answerArray,
                  };
                }
                return q;
              });

            return {
              ...modelResponse,
              questions_response: updatedQuestionsResponse,
            };
          }
          return modelResponse;
        },
      );

      const updatedInteraction = {
        ...prev,
        model_responses_json: updatedModelResponses,
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

  const handleMultiSelect = (
    isChecked,
    selectedOption,
    interactionIndex,
    outputIdx,
  ) => {
    console.log("checked: " + isChecked);
    const selectedQuestion = questions[interactionIndex];
    console.log(interactionIndex, selectedQuestion);

    setCurrentInteraction((prev) => {
      const updatedModelResponses = prev?.model_responses_json?.map(
        (modelResponse, modelIdx) => {
          if (modelIdx === outputIdx) {
            const updatedQuestionsResponse =
              modelResponse?.questions_response?.map((q, index) => {
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
              });

            return {
              ...modelResponse,
              questions_response: updatedQuestionsResponse,
            };
          }
          return modelResponse;
        },
      );

      const updatedInteraction = {
        ...prev,
        model_responses_json: updatedModelResponses,
      };

      setForms((prevForms) =>
        prevForms.map((interaction) =>
          interaction.prompt_output_pair_id === prev.prompt_output_pair_id
            ? updatedInteraction
            : interaction,
        ),
      );

      return updatedInteraction;
    });
  };

  console.log(interactions);
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

  console.log(currentInteraction);
  console.log(interactions);
  console.log(forms);

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
  console.log(forms);
  const handleFormBtnClick = (e) => {
    const clickedPromptOutputPairId = parseInt(e.target.id);
    console.log(clickedPromptOutputPairId, forms);
    const currInteraction = forms?.find(
      (interaction) =>
        interaction?.prompt_output_pair_id == clickedPromptOutputPairId,
    );
    console.log(currInteraction);
    const modelResponses = currInteraction?.model_responses_json?.map(
      (modelResponse) => {
        return {
          ...modelResponse,
          output: Array.isArray(modelResponse.output)
            ? modelResponse.output.map((item) => item.value).join(", ")
            : modelResponse.output,
          questions_response:
            modelResponse?.questions_response?.map(
              (questionResponse, index) => ({
                ...questionResponse,
                question: questions[index],
                response: questionResponse?.response || [],
              }),
            ) || [],
        };
      },
    );

    if (currInteraction) {
      setCurrentInteraction({
        prompt: currInteraction?.prompt,
        model_responses_json: modelResponses,
        prompt_output_pair_id: currInteraction?.prompt_output_pair_id,
        additional_note: currInteraction?.additional_note || "",
      });
    }
  };
  const handleInputChange = (e, interactionIndex, blankIndex, outputIdx) => {
    console.log(outputIdx);

    const { value } = e.target;

    setCurrentInteraction((prev) => {
      const updatedModelResponses = prev.model_responses_json.map(
        (modelResponse, modelIdx) => {
          if (modelIdx === outputIdx) {
            const updatedQuestionsResponse =
              modelResponse.questions_response.map((q, index) => {
                if (index === interactionIndex) {
                  const updatedBlankAnswers = q?.response
                    ? [...q.response]
                    : [];
                  updatedBlankAnswers[blankIndex] = value;
                  return {
                    ...q,
                    response: updatedBlankAnswers,
                  };
                }
                return q;
              });

            return {
              ...modelResponse,
              questions_response: updatedQuestionsResponse,
            };
          }
          return modelResponse;
        },
      );

      const updatedInteraction = {
        ...prev,
        model_responses_json: updatedModelResponses,
      };

      setForms((prevForms) =>
        prevForms.map((form) =>
          form.prompt_output_pair_id === prev.prompt_output_pair_id
            ? { ...form, model_responses_json: updatedModelResponses }
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
          <div style={styles.response1Box}>
            <ReactMarkdown>
              {formatPrompt(currentInteraction?.prompt)}
            </ReactMarkdown>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          {currentInteraction?.model_responses_json?.map(
            (response, outputIdx) => (
              <div key={outputIdx} style={{ flex: 1 }}>
                <div className={classes.heading} style={{ fontSize: "20px" }}>
                  {translate("modal.output")}-{`${outputIdx + 1}`}
                </div>
                <div style={styles.responseBox}>
                  {/* {Object.keys(response).map((key) => ( */}
                  <div>
                    <h3 style={{ fontWeight: "700" }}>{response.model_name}</h3>
                    <p>{response?.output}</p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
        <hr
          style={{
            width: "100%",
            marginTop: "1rem",
            border: "1px solid #ccc",
          }}
        />
        {questions?.map((question, questionIdx) => (
          <div key={questionIdx} style={{ marginTop: "20px" }}>
            <div style={{ overflowY: "auto", maxHeight: "90vh" }}>
              {question.question_type === "fill_in_blanks" && (
                <div>
                  <p className={classes.inputQuestion}>
                    {questionIdx + 1}.{" "}
                    {question.input_question
                      .split("<blank>")
                      .map((part, index) => (
                        <span
                          style={{ fontSize: "18px" }}
                          key={`${questionIdx}-${index}`}
                        >
                          {part}
                          {index <
                            question.input_question.split("<blank>").length -
                              1 && (
                            <span
                              style={{
                                borderBottom: "1px solid black",
                                display: "inline-block",
                                width: "100px",
                                margin: "0 4px",
                                verticalAlign: "middle",
                              }}
                            >
                              &nbsp;
                            </span>
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

                  {currentInteraction?.model_responses_json?.map(
                    (response, outputIdx) => (
                      <div
                        key={outputIdx}
                        style={{
                          marginBottom: "10px",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        {question.input_question
                          .split("<blank>")
                          .slice(0, -1)
                          .map((_, index) => (
                            <input
                              key={`${outputIdx}-${index}`}
                              type="text"
                              value={
                                (currentInteraction?.model_responses_json &&
                                  currentInteraction?.model_responses_json[
                                    outputIdx
                                  ]?.questions_response[questionIdx]
                                    ?.response?.[index]) ||
                                ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  questionIdx,
                                  index,
                                  outputIdx,
                                )
                              }
                              style={{
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px",
                                fontSize: "14px",
                                lineHeight: "1.5",
                                width: "100%",
                                maxWidth: "200px",
                                margin: "4px 0",
                                boxSizing: "border-box",
                                backgroundColor: "white",
                                fontWeight: "normal",
                              }}
                              required={question.mandatory}
                            />
                          ))}
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            marginLeft: "15px",
                            marginTop: "0.7rem",
                          }}
                        >
                          {response?.model_name}
                        </Typography>
                      </div>
                    ),
                  )}
                </div>
              )}

              {question.question_type === "rating" && (
                <div>
                  <div className={classes.inputQuestion}>
                    <span style={{ fontSize: "18px" }}>
                      {questionIdx + 1}. {question.input_question}
                    </span>
                    {question.mandatory && (
                      <span style={{ color: "#d93025", fontSize: "25px" }}>
                        {" "}
                        *
                      </span>
                    )}
                  </div>
                  {currentInteraction?.model_responses_json?.map(
                    (response, outputIdx) => (
                      <div key={outputIdx} style={{ marginBottom: "20px" }}>
                        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                          {Array.from(
                            { length: question.rating_scale_list.length },
                            (_, index) => (
                              <Button
                                key={index + 1}
                                className={`${classes.numBtn} ${
                                  currentInteraction?.model_responses_json &&
                                  currentInteraction?.model_responses_json[
                                    outputIdx
                                  ].questions_response[questionIdx]
                                    ?.response[0] ==
                                    index + 1
                                    ? classes.selected
                                    : ""
                                }`}
                                label={index + 1}
                                onClick={() =>
                                  handleRating(
                                    index + 1,
                                    questionIdx,
                                    outputIdx,
                                  )
                                }
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
                          <Typography
                            variant="subtitle2"
                            sx={{
                              marginLeft: "5px",
                              marginTop: "0.5rem",
                              fontWeight: "bold",
                            }}
                          >
                            {response?.model_name}
                          </Typography>
                        </Box>
                      </div>
                    ),
                  )}
                </div>
              )}

              {question.question_type === "multi_select_options" && (
                <div>
                  <div
                    className={classes.inputQuestion}
                    style={{ fontSize: "18px" }}
                  >
                    {questionIdx + 1}. {question.input_question}
                    {question.mandatory && (
                      <span style={{ color: "#d93025", fontSize: "25px" }}>
                        {" "}
                        *
                      </span>
                    )}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    {question?.input_selections_list?.map(
                      (option, optionIdx) => (
                        <div key={optionIdx} style={{ marginBottom: "10px" }}>
                          <span>{option}</span>{" "}
                          {currentInteraction?.model_responses_json?.map(
                            (response, outputIdx) => (
                              <FormControl
                                component="fieldset"
                                style={{ display: "block", marginLeft: "20px" }}
                              >
                                <FormGroup>
                                  <FormControlLabel
                                    key={optionIdx}
                                    control={
                                      <Checkbox
                                        onChange={(e) =>
                                          handleMultiSelect(
                                            e.target.checked,
                                            option,
                                            questionIdx,
                                            outputIdx,
                                          )
                                        }
                                        checked={
                                          currentInteraction?.model_responses_json?.[
                                            outputIdx
                                          ]?.questions_response?.[
                                            questionIdx
                                          ]?.response?.includes(option) ?? false
                                        }
                                      />
                                    }
                                    label={
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: "bold" }}
                                      >
                                        {response?.model_name}
                                      </Typography>
                                    }
                                  />{" "}
                                </FormGroup>
                              </FormControl>
                            ),
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {question.question_type === "mcq" && (
                <div>
                  <div
                    className={classes.inputQuestion}
                    style={{ fontSize: "18px" }}
                  >
                    {questionIdx + 1}. {question.input_question}
                    {question.mandatory && (
                      <span style={{ color: "#d93025", fontSize: "25px" }}>
                        {" "}
                        *
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    {question?.input_selections_list?.map(
                      (option, optionIdx) => (
                        <div key={optionIdx} style={{ marginBottom: "10px" }}>
                          <span>{option}</span>{" "}
                          {currentInteraction?.model_responses_json?.map(
                            (response, outputIdx) => (
                              <FormControl
                                component="fieldset"
                                key={outputIdx}
                                style={{ display: "block", marginLeft: "20px" }}
                              >
                                <RadioGroup
                                  value={
                                    currentInteraction?.model_responses_json?.[
                                      outputIdx
                                    ]?.questions_response?.[questionIdx]
                                      ?.response?.[0] || ""
                                  }
                                  onChange={(e) =>
                                    handleMCQ(
                                      e.target.value,
                                      option,
                                      questionIdx,
                                      outputIdx,
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    key={optionIdx}
                                    value={option}
                                    control={<Radio />}
                                    label={
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: "bold" }}
                                      >
                                        {response?.model_name}
                                      </Typography>
                                    }
                                  />
                                </RadioGroup>
                              </FormControl>
                            ),
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {pairs.map((pair, index) => {
          return (
            <Accordion
              key={index}
              expanded={expanded[index]}
              onChange={handleAccordionChange(index)}
              className={classes.accordion}
              style={{
                height: expanded[index] ? "auto" : "4rem",

                borderRadius: expanded[index] ? "1rem" : null,
                boxShadow: expanded[index]
                  ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                  : null,
                borderBottom: "none",
                border: "none",
                margin: 2,
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
                    whiteSpace: expanded[index] ? "nowrap" : "nowrap",
                    maxWidth: "200px",
                    maxHeight: "3.5rem",
                    display: "flex",
                    flexDirection: "row",
                    position: "relative",
                    border: "none",
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
                    label="reset"
                    buttonVariant={"outlined"}
                    style={{
                      marginLeft: "1.5rem",
                      marginTop: "1rem",
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
      // <Resizable
      //   defaultSize={{
      //     width: "100%",
      //   }}
      //   // maxWidth={"70%"}
      //   enable={{ right: false, top: false, bottom: true, left: false }}
      // >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          className={classes.heading}
          style={{ fontSize: "20px", padding: "0", marginLeft: "2rem" }}
        >
          {translate("modal.interact")}
        </div>
        <Paper
          className={classes.interactionWindow}
          style={{
            border: "none",
            backgroundColor: "#F6F6F6",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {interactions && (
            <PairAccordion pairs={interactions} classes={classes} />
          )}
        </Paper>
        {/* <div className={classes.heading} style={{ margin: "1.5rem 0 0.5rem 1.5rem", fontSize: "20px" }}>
          {translate("modal.quelist")}
        </div>
        <QuestionList questions={questions} /> */}
      </div>
      // </Resizable>
    );
  };

  return (
    <>
      <div
        className={classes.container}
        style={{
          width: "100%",
          maxwidth: "2300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <IconButton onClick={toggleLeftPanel}>
          <MenuIcon />
        </IconButton>
        <div className={classes.leftPanel}>
          {leftPanelVisible && <InteractionDisplay />}
        </div>

        {leftPanelVisible && (
          <hr
            style={{
              width: "95%",
              margin: "0 2rem",
              border: "1px solid black",
            }}
          />
        )}

        {EvaluationForm()}
      </div>
    </>
  );
};

export default PreferenceRanking;
