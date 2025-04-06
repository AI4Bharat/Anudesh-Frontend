"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Button from "../../../../components/common/Button";
import ReactMarkdown from "react-markdown";
import ModelResponseEvaluationStyle from "@/styles/ModelResponseEvaluation";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControl,
  FormGroup,
} from "@mui/material";
import "../model_response_evaluation/model_response_evaluation.css";
import { Paper } from "@mui/material";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { translate } from "@/config/localisation";
import GetTaskDetailsAPI from "@/app/actions/api/Dashboard/getTaskDetails";
import { useParams } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";

import List from "@mui/material/List";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { styled, useTheme } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Slider from "@mui/material/Slider";
const labels = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const drawerWidth = 10;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({
  theme,
  open,
}) => {
  return {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? `${drawerWidth}px` : 0,
  };
});

const PreferenceRanking = ({
  key,
  currentInteraction,
  setCurrentInteraction,
  interactions,
  setInteractions,
  forms,
  setForms,
  stage,
  answered,
  setAnswered,
  annotation,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { taskId } = useParams();
  const classes = ModelResponseEvaluationStyle();
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);

  const [blank, setBlank] = useState("");
  const questions =
    useSelector((state) => state.getProjectDetails.data.metadata_json) ?? [];
  const toggleLeftPanel = () => {
    setLeftPanelVisible(!leftPanelVisible);
  };
  const [clickedPromptOutputPairId, setclickedPromptOutputPairId] = useState();

  const [isFormsInitialized, setIsFormsInitialized] = useState(false);
  const [isInteractionsFetched, setIsInteractionsFetched] = useState(false);
  const [isInitialFormsReady, setIsInitialFormsReady] = useState(false);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState({ top: 0, left: 0 });
  const [hover, setHover] = useState({});
  const [selectedRatings, setSelectedRatings] = useState({});

  const handleHover = (newHover, outputIdx) => {
    setHover((prev) => {
      const updated = {
        ...prev,
        [outputIdx]: newHover,
      };
      return updated;
    });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const toggleDrawer = (newOpen) => (event) => {
  //   const menuIconElement = event.currentTarget.getBoundingClientRect();
  //   setDrawerPosition({
  //     top: menuIconElement.top + window.scrollY + 20,
  //     left: menuIconElement.left + window.scrollX,
  //   });
  //   setOpen(newOpen);
  // };

  const parsedForms = useMemo(() => {
    if (annotation && annotation[0]?.result) {
      const result = annotation?.[0]?.result || [];

      const forms = result?.map((currentForm) => ({
        prompt: currentForm.prompt || "",
        model_responses_json: currentForm.model_responses_json?.map(
          (modelResponse) => ({
            ...modelResponse,
            output: modelResponse.output || "",
            model_name: modelResponse.model_name || "",
            questions_response: modelResponse.questions_response?.map(
              (questionResponse) => ({
                ...questionResponse,
                question: questionResponse?.question || {},
                response: questionResponse?.response || [],
              }),
            ),
          }),
        ),
        prompt_output_pair_id: currentForm?.prompt_output_pair_id || null,
        additional_note: currentForm?.additional_note || "",
      }));

      setForms(forms.length > 0 ? forms : []);
      setIsFormsInitialized(forms.length > 0);
      return forms;
    }
    setForms([]);
    setIsFormsInitialized(false);
    return [];
  }, [annotation, taskId]);

  useEffect(() => {
    setForms(parsedForms);
  }, [parsedForms, setForms]);

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

  const fetchInteractions = useCallback(async () => {
    try {
      const taskDetailsObj = new GetTaskDetailsAPI(taskId);
      const taskResponse = await fetch(taskDetailsObj.apiEndPoint(), {
        method: "GET",
        headers: taskDetailsObj.getHeaders().headers,
      });
      const taskData = await taskResponse.json();
      setInteractions(taskData?.data?.multiple_interaction_json || []);
    } catch (error) {
      console.error("Error fetching interactions:", error);
    }
  }, [taskId]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  useEffect(() => {
    if (forms?.length == 0 && interactions?.length > 0) {
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
      setForms(initialForms);
    }
  }, [forms, interactions, taskId]);

  useEffect(() => {
    if (forms?.length > 0 && interactions?.length > 0) {
      if (clickedPromptOutputPairId) {
        var defaultFormId = clickedPromptOutputPairId;
      } else {
        var defaultFormId = forms[0]?.prompt_output_pair_id;
      }

      const currentForm = forms?.find(
        (form) => form?.prompt_output_pair_id == defaultFormId,
      );

      if (currentForm) {
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
      }
    }
  }, [
    forms,
    setForms,
    clickedPromptOutputPairId,
    interactions,
    setCurrentInteraction,
  ]);

  useEffect(() => {
    if (!forms || forms.length === 0) {
      setAnswered(false);
      return;
    }
    const formStatuses = forms.map((form, formIndex) => {
      if (
        !form?.model_responses_json ||
        form.model_responses_json.length === 0
      ) {
        return false;
      }

      const formAnswered = form.model_responses_json.every(
        (modelResponse, modelIndex) => {
          const allMandatoryAnswered = questions.every(
            (question, questionIndex) => {
              let expectedParts = 0;
              if (question.question_type === "fill_in_blanks") {
                expectedParts =
                  question?.input_question?.split("<blank>")?.length - 1;
              }

              const responseForQuestion =
                modelResponse?.questions_response?.find(
                  (qr) =>
                    qr?.question?.input_question === question?.input_question &&
                    qr?.question?.question_type === question?.question_type,
                );

              if (!responseForQuestion?.response) {
                return false; // If the question is not answered, return false
              }

              if (question.question_type === "fill_in_blanks") {
                const isCorrectLength =
                  responseForQuestion.response.length === expectedParts;
                const hasNoEmptyResponse = !responseForQuestion.response.some(
                  (response) => response === "" || response === undefined,
                );
                if (!isCorrectLength || !hasNoEmptyResponse) {
                  return false;
                }
                return true;
              }

              const hasValidResponse =
                responseForQuestion.response.length > 0 &&
                !responseForQuestion.response.some(
                  (response) => response === "" || response === undefined,
                );
              return hasValidResponse;
            },
          );
          return allMandatoryAnswered; // If any model response doesn't pass, this will be false
        },
      );
      return formAnswered;
    });

    const allFormsAnswered = formStatuses.every((status) => status === true);

    setAnswered(allFormsAnswered);
  }, [forms, taskId]);

  const isMobile = window.innerWidth <= 425;

  const styles = {
    responseBox: {
      flex: "1 1 45%",
      width: "100%",
      overflow: "auto",
      fontSize: "16px",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#FFF1EF",
    },
    response1Box: {
      flex: "1 1 45%",
      width: "100%",
      whiteSpace: "normal",
      wordWrap: "break-word",
      overflowY: "hidden",
      padding: "20px",
      fontSize: "17px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#FFF1EF",
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
    const selectedQuestion = questions[interactionIndex];

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
    setclickedPromptOutputPairId(e.target.id);
    const currInteraction = forms?.find(
      (interaction) =>
        interaction?.prompt_output_pair_id == clickedPromptOutputPairId,
    );
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

  // const handleInputChange = (e, interactionIndex, blankIndex, outputIdx) => {
  //   const { value } = e.target;

  //   setCurrentInteraction((prev) => {
  //     const updatedModelResponses = prev.model_responses_json.map(
  //       (modelResponse, modelIdx) => {
  //         if (modelIdx === outputIdx) {
  //           const updatedQuestionsResponse =
  //             modelResponse.questions_response.map((q, index) => {
  //               if (index === interactionIndex) {
  //                 const updatedBlankAnswers = q?.response
  //                   ? [...q.response]
  //                   : [];
  //                 updatedBlankAnswers[blankIndex] = value;
  //                 return {
  //                   ...q,
  //                   response: updatedBlankAnswers,
  //                 };
  //               }
  //               return q;
  //             });

  //           return {
  //             ...modelResponse,
  //             questions_response: updatedQuestionsResponse,
  //           };
  //         }
  //         return modelResponse;
  //       },
  //     );

  //     const updatedInteraction = {
  //       ...prev,
  //       model_responses_json: updatedModelResponses,
  //     };

  //     setForms((prevForms) =>
  //       prevForms.map((form) =>
  //         form.prompt_output_pair_id === prev.prompt_output_pair_id
  //           ? { ...form, model_responses_json: updatedModelResponses }
  //           : form,
  //       ),
  //     );

  //     return updatedInteraction;
  //   });
  // };

  const handleSliderChange = (
    newValue,
    interactionIndex,
    blankIndex,
    outputIdx,
  ) => {
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
                  updatedBlankAnswers[blankIndex] = newValue; // Use newValue directly from slider
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

      // Update forms state to maintain sync
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
        <Accordion
          defaultExpanded
          sx={{
            backgroundImage: `url("https://i.postimg.cc/76Mw8q8t/chat-bg.webp")`,
            borderRadius: "20px",
            marginBottom: "2rem",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div className={classes.promptContainer}>
              <div className={classes.heading} style={{ fontSize: "20px" }}>
                {translate("modal.prompt")}
              </div>
              <div style={styles.response1Box}>
                <ReactMarkdown>
                  {formatPrompt(currentInteraction?.prompt)}
                </ReactMarkdown>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
              }}
              className={classes.outputWrpr}
            >
              {currentInteraction?.model_responses_json?.map(
                (response, outputIdx) => (
                  <div key={outputIdx} style={{ flex: 1, width: "100%" }}>
                    <div
                      className={classes.heading}
                      style={{ fontSize: "20px" }}
                    >
                      {translate("modal.output")}-{`${outputIdx + 1}`}
                    </div>
                    <div style={styles.responseBox}>
                      <div>
                        <h3 style={{ fontWeight: "700" }}>
                          {response.model_name}
                        </h3>
                        <p>{response?.output}</p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </AccordionDetails>
        </Accordion>

        {questions?.map((question, questionIdx) => (
          <div key={questionIdx}>
            <div style={{ overflowY: "auto", maxHeight: "90vh" }}>
              {question.question_type === "fill_in_blanks" && (
                <div>
                  <p className={classes.inputQuestion}>
                    {questionIdx + 1}.{" "}
                    {question.input_question
                      .split("<blank>")
                      .map((part, index) => (
                        <span key={`${questionIdx}-${index}`}>
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
                    <span style={{ color: "#d93025", fontSize: "25px" }}>
                      {" "}
                      *
                    </span>
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
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            marginRight: "15px",
                            marginTop: "0.7rem",
                          }}
                        >
                          {response?.model_name}
                        </Typography>
                        {question.input_question
                          .split("<blank>")
                          .slice(0, -1)
                          .map((_, index) => (
                            // <input
                            // key={`${outputIdx}-${index}`}
                            // type="text"
                            // value={
                            // (currentInteraction?.model_responses_json &&
                            // currentInteraction?.model_responses_json[
                            // outputIdx
                            // ]?.questions_response[questionIdx]
                            // ?.response?.[index]) ||
                            // ""
                            // }
                            // onChange={(e) =>
                            // handleInputChange(
                            // e,
                            // questionIdx,
                            // index,
                            // outputIdx,
                            // )
                            // }
                            // style={{
                            // border: "1px solid #ccc",
                            // borderRadius: "4px",
                            // padding: "4px",
                            // fontSize: "14px",
                            // lineHeight: "1.5",
                            // width: "100%",
                            // maxWidth: "200px",
                            // margin: "4px 0",
                            // boxSizing: "border-box",
                            // backgroundColor: "white",
                            // fontWeight: "normal",
                            // marginRight: "5px",
                            // }}
                            // required
                            // />
                            <Slider
                              color="warning"
                              valueLabelDisplay="auto"
                              key={`${outputIdx}-${index}`}
                              value={
                                (currentInteraction?.model_responses_json &&
                                  currentInteraction?.model_responses_json[
                                    outputIdx
                                  ]?.questions_response[questionIdx]
                                    ?.response?.[index]) ||
                                0 // Default value for the slider
                              }
                              onChange={(e, newValue) =>
                                handleSliderChange(
                                  newValue,
                                  questionIdx,
                                  index,
                                  outputIdx,
                                )
                              }
                              aria-labelledby={`slider-${outputIdx}-${index}`}
                              min={0} // Minimum slider value
                              max={100} // Maximum slider value (adjust as per your use case)
                              step={1} // Step size for slider movement
                              style={{
                                margin: "4px 0",
                                width: "200px", // Adjust width as needed
                                marginRight: "5px",
                              }}
                            />
                          ))}
                      </div>
                    ),
                  )}
                </div>
              )}

              {question.question_type === "rating" && (
                <div>
                  <div className={classes.inputQuestion}>
                    <span>
                      {questionIdx + 1}. {question.input_question}
                    </span>
                    <span style={{ color: "#d93025", fontSize: "25px" }}>
                      {" "}
                      *
                    </span>
                  </div>
                  {currentInteraction?.model_responses_json?.map(
                    (response, outputIdx) => {
                      return (
                        <div key={outputIdx}>
                          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                marginRight: "15px",
                                marginTop: "0.5rem",
                                fontWeight: "bold",
                              }}
                            >
                              {response?.model_name}
                            </Typography>
                            {/* {Array.from(
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
                                  marginRight: isMobile ? "0.5rem" : "1rem",
                                  marginLeft: "0.9px",
                                  marginBottom: isMobile ? "1rem" : "2rem",
                                  borderRadius: "1rem",
                                  width: "47px",
                                  padding: "13px",
                                }}
                                required
                              />
                            ),
                          )} */}
                            <Box
                              sx={{ display: "flex", alignItems: "center" }}
                              onMouseLeave={() => handleHover(null, outputIdx)}
                            >
                              <Rating
                                name={`rating-${outputIdx}`}
                                value={
                                  currentInteraction?.model_responses_json &&
                                  currentInteraction?.model_responses_json[
                                    outputIdx
                                  ].questions_response[questionIdx]?.response[0]
                                }
                                getLabelText={getLabelText}
                                onChange={(event, newValue) => {
                                  handleRating(
                                    newValue,
                                    questionIdx,
                                    outputIdx,
                                  );
                                  setSelectedRatings((prev) => ({
                                    ...prev,
                                    [`${outputIdx}-${questionIdx}`]: newValue,
                                  }));
                                }}
                                onChangeActive={(event, newHover) => {
                                  handleHover(newHover, outputIdx);
                                }}
                                sx={{
                                  color: "#ee6633",
                                  "& .MuiRating-iconFilled": {
                                    color: "#ee6633",
                                  },
                                  "& .MuiRating-iconHover": {
                                    color: "#ee6633",
                                  },
                                }}
                                emptyIcon={
                                  <StarIcon
                                    style={{ opacity: 0.55, color: "#EE6633" }}
                                    fontSize="inherit"
                                  />
                                }
                              />
                              {/* Display label for hover or selected value */}
                              <Box
                                sx={{
                                  ml: 2,
                                  color: "#EE6633",
                                  fontWeight: "bold",
                                }}
                              >
                                {(() => {
                                  const currentHover = hover[outputIdx];
                                  const currentSelection =
                                    selectedRatings[
                                      `${outputIdx}-${questionIdx}`
                                    ];

                                  return currentHover !== null
                                    ? labels[currentHover]
                                    : currentSelection
                                      ? labels[currentSelection]
                                      : "";
                                })()}
                              </Box>
                            </Box>
                          </Box>
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              {question.question_type === "multi_select_options" && (
                <div>
                  <div className={classes.inputQuestion}>
                    {questionIdx + 1}. {question.input_question}
                    <span style={{ color: "#d93025", fontSize: "25px" }}>
                      {" "}
                      *
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    {question?.input_selections_list?.map(
                      (option, optionIdx) => (
                        <div
                          key={optionIdx}
                          style={{
                            marginBottom: "10px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>{option} :</span>{" "}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            {currentInteraction?.model_responses_json?.map(
                              (response, outputIdx) => (
                                <div
                                  key={`${optionIdx}-${outputIdx}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <FormControl component="fieldset">
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
                                              ]?.response?.includes(option) ??
                                              false
                                            }
                                          />
                                        }
                                        labelPlacement="start"
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
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {question.question_type === "mcq" && (
                <div>
                  <div className={classes.inputQuestion}>
                    {questionIdx + 1}. {question.input_question}
                    <span style={{ color: "#d93025", fontSize: "25px" }}>
                      {" "}
                      *
                    </span>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    {question?.input_selections_list?.map(
                      (option, optionIdx) => (
                        <div
                          key={optionIdx}
                          style={{
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>{option} :</span>{" "}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexDirection: "row",
                              flexWrap: "wrap",
                            }}
                          >
                            {currentInteraction?.model_responses_json?.map(
                              (response, outputIdx) => (
                                <div
                                  key={`${optionIdx}-${outputIdx}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <FormControl
                                    component="fieldset"
                                    key={outputIdx}
                                  >
                                    <RadioGroup
                                      value={
                                        currentInteraction
                                          ?.model_responses_json?.[outputIdx]
                                          ?.questions_response?.[questionIdx]
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
                                        labelPlacement="start"
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
                                </div>
                              ),
                            )}
                          </div>
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
            currentInteraction?.additional_note != ""
              ? currentInteraction?.additional_note
              : ""
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
          width: "calc(100% - 0.1rem)",
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
                width: "inherit",
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
                    whiteSpace: expanded[index] ? "normal" : "normal",
                    maxWidth: "200px",
                    maxHeight: "3.5rem",
                    display: "block",
                    position: "relative",
                    border: "none",
                  }}
                  className={classes.promptTile}
                >
                  {pair?.prompt}
                  {
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
                  }
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
                    label="Reset"
                    buttonVariant={"outlined"}
                    onClick={handleReset}
                    style={{
                      marginTop: "1rem",
                    }}
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "60%",
        }}
      >
        <Paper
          className={classes.interactionWindow}
          style={{
            border: "none",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {interactions && (
            <PairAccordion pairs={interactions} classes={classes} />
          )}
        </Paper>
      </div>
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
          justifyContent: "flex-start",
          alignItems: "start",
        }}
      >
        <div style={{ width: "50% !important" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          {open && (
            <>
              <Box
                sx={{
                  border: "1px solid #E1E1E0",
                  width: "100% !important",
                  minWidth: "100% !important",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 1rem",
                  }}
                >
                  <Typography className={classes.heading}>
                    {translate("modal.interact")}
                  </Typography>
                  <ChevronLeftIcon onClick={handleDrawerClose} />
                </Box>
                <List>
                  <InteractionDisplay />
                </List>
              </Box>
            </>
          )}
        </div>
        <Main open={open}>{EvaluationForm()}</Main>
      </div>
    </>
  );
};

export default PreferenceRanking;
