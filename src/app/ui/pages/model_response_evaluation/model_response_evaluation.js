"use client";

import { useState, useEffect,useCallback,useMemo,memo } from "react";
import Button from "../../../../components/common/Button";
import ReactMarkdown from "react-markdown";
import RefreshIcon from "@mui/icons-material/Refresh";
import remarkBreaks from "remark-breaks";
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
import Spinner from "@/components/common/Spinner";

import MenuIcon from "@mui/icons-material/Menu";
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

const ModelInteractionEvaluation = ({
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
  const [loading, setLoading] = useState(true);
  const [formupdate, setformupdate] = useState();

  // const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [blank, setBlank] = useState("");
  const questions =
    useSelector((state) => state.getProjectDetails.data.metadata_json) ?? [];
  console.log("questions that were fetched: " + typeof questions);
  const toggleLeftPanel = () => {
    setLeftPanelVisible(!leftPanelVisible);
  };
  const [clickedPromptOutputPairId,setclickedPromptOutputPairId]=useState()
  const [isFormsInitialized, setIsFormsInitialized] = useState(false);
  const [isInteractionsFetched, setIsInteractionsFetched] = useState(false);
  const [isInitialFormsReady, setIsInitialFormsReady] = useState(false);

  console.log(annotation[0]);

  const handleReset = () => {
    setCurrentInteraction((prev) => ({
      ...prev,
      questions_response: Array(questions?.length).fill(null),
    }));
  };

  const parsedForms = useMemo(() => {
    if (annotation && annotation[0]?.result) {
      console.log("kek",annotation[0]);

      const result = annotation[0].result;
      return Array.isArray(result)
        ? result.map((item) => ({
            prompt: item.prompt || "",
            output: item.output || "",
            questions_response: item.questions_response || [],
            additional_note: item.additional_note || null,
            prompt_output_pair_id: item.prompt_output_pair_id || null,
          }))
        : [
            {
              prompt: result.prompt || "",
              output: result.output || "",
              questions_response: result.questions_response || [],
              additional_note: result.additional_note || null,
              prompt_output_pair_id: result.prompt_output_pair_id || null,
            },
          ];
    }
    
    return [];
  }, [annotation,taskId]);

  useEffect(() => {
    setForms(parsedForms);
    console.log("Forms updated:", parsedForms);
  }, [parsedForms, setForms]);

  const fetchInteractions = useCallback(async () => {
    try {
      const taskDetailsObj = new GetTaskDetailsAPI(taskId);
      const taskResponse = await fetch(taskDetailsObj.apiEndPointAuto(), {
        method: "GET",
        headers: taskDetailsObj.getHeaders().headers,
      });
      const taskData = await taskResponse.json();
      setInteractions(taskData?.data?.interactions_json || []);
    } catch (error) {
      console.error("Error fetching interactions:", error);
    }

  }, [annotation,taskId]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  useEffect(() => {
    if (forms?.length > 0 && interactions?.length > 0 ) {    
      if(clickedPromptOutputPairId){
        var defaultFormId = clickedPromptOutputPairId
      }
      else{
        var defaultFormId = forms[0]?.prompt_output_pair_id
      }
      const currentForm = forms.find(
        (form) => form?.prompt_output_pair_id == defaultFormId
      );
      if (currentForm) {
        const newState = {
          prompt: currentForm.prompt || "",
          output:
            typeof currentForm.output === "string"
              ? currentForm.output
              : currentForm.output?.map((item) => item.value).join(", ") || "",
          prompt_output_pair_id: currentForm.prompt_output_pair_id,
          additional_note: currentForm.additional_note || "",
          questions_response:
            currentForm.questions_response ||
            Array(questions?.length).fill(null),
        };
        setCurrentInteraction(newState);
        console.log("helo","2",forms);
      }
    }

  }, [forms,setForms,clickedPromptOutputPairId,interactions,setCurrentInteraction]);

  useEffect(() => {
    if (forms?.length == 0 && interactions?.length > 0) {
      const initialForms = interactions.map((interaction) => ({
        prompt: interaction.prompt,
        output: interaction.output,
        prompt_output_pair_id: interaction.prompt_output_pair_id,
        additional_note: null,
        questions_response: questions?.map((question) => ({
          question,
          response: [],
        })),
      }));
      console.log("Init forms:", initialForms); 
      setForms(initialForms); 
      console.log("helo",forms,interactions);
      }

  }, [forms, interactions, taskId]);
  useEffect(() => {
    console.log("Forms updated:", forms);
  }, [forms]);
  
  useEffect(() => {
    if (!forms || forms.length == 0) {
      setAnswered(false);
      return;
    }

    const allFormsAnswered = forms.every((form) => {
      if (!form) {
        return false;
      }
      const allMandatoryAnswered = questions.every((question) => {
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

  const handleRating = (rating, interactionIndex) => {
    
    setCurrentInteraction((prev) => {      
      const selectedQuestion = questions[interactionIndex];
      const ratingArray = [String(rating)];
      // const ratingScaleList = selectedQuestion?.rating_scale_list;
      const updatedQuestionsResponse = prev.questions_response?.map(
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
      console.log(currentInteraction);
      
      return updatedInteraction;
    });
  };

  const handleMCQ = (selectedOption, interactionIndex) => {
    const answerArray = [String(selectedOption)];

    setCurrentInteraction((prev) => {
      const updatedQuestionsResponse = prev.questions_response?.map(
        (q, index) => {
          if (index == interactionIndex) {
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
    console.log("checked: " + isChecked);
    const selectedQuestion = questions[interactionIndex];
    const indexInQuestions = questions?.findIndex(
      (q) => q.id === selectedQuestion?.id,
    );

    setCurrentInteraction((prev) => {
      const updatedQuestionsResponse = prev.questions_response?.map(
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


  const handleNoteChange = (event) => {
    const newNote = event.target.value;
    setCurrentInteraction((prev) => {
      const updatedInteraction = {
        ...prev,
        additional_note: newNote,
      };

      // setInteractions((prevInteractions) =>
      //   prevInteractions.map((interaction) =>
      //     interaction.prompt_output_pair_id === prev.prompt_output_pair_id
      //       ? updatedInteraction
      //       : interaction
      //   )
      // );

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
    if (!prompt) return "";
    const formattedText = prompt.replace(/(\r\n|\r|\n)/g, "  \n");  
    return formattedText;
  };
      console.log(forms);
  const handleFormBtnClick = (e) => {
    setclickedPromptOutputPairId(e.target.id);
    console.log("clicked id" + clickedPromptOutputPairId);
    const currInteraction = forms?.find(
      (interaction) =>
        interaction?.prompt_output_pair_id == clickedPromptOutputPairId,
    );
    console.log(currInteraction,"cuur");
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
      // setSelectedQuestions(currInteraction?.questions_response.map((response) => response.question));
    }
  };
  // const handleQuestionClick = (question) => {
  //   const isQuestionSelected = selectedQuestions?.some((selectedQ) => {
  //     return (
  //       selectedQ?.input_question === question?.input_question &&
  //       selectedQ?.question_type === question?.question_type
  //     );
  //   });

  //   if (!isQuestionSelected) {
  //     setSelectedQuestions([...selectedQuestions, question]);
  //     setCurrentInteraction((prev) => {
  //       const newResponse = {
  //         question: question,
  //         response: [],
  //       };

  //       const updatedQuestionsResponse = prev?.questions_response.some(
  //         (response) =>
  //           response.question?.input_question === question?.input_question &&
  //           response.question?.question_type === question?.question_type
  //       )
  //         ? prev?.questions_response
  //         : [...prev?.questions_response, newResponse];

  //       const updatedInteraction = {
  //         ...prev,
  //         questions_response: updatedQuestionsResponse,
  //       };

  //       setForms((prevForms) =>
  //         prevForms.map((form) =>
  //           form?.prompt_output_pair_id === updatedInteraction.prompt_output_pair_id
  //             ? {
  //                 ...form,
  //                 questions_response: updatedQuestionsResponse,
  //               }
  //             : form
  //         )
  //       );

  //       return updatedInteraction;
  //     });
  //   } else {
  //     removeElement(question);
  //   }
  // };

  // const removeElement = (questionToRemove) => {
  //   setSelectedQuestions((prevQuestions) => {
  //     const filteredQuestions = prevQuestions?.filter(
  //       (q) =>
  //         q?.input_question !== questionToRemove?.input_question ||
  //         q?.question_type !== questionToRemove?.question_type
  //     );
  //     return filteredQuestions;
  //   });

  //   setCurrentInteraction((prev) => {
  //     const updatedQuestionsResponse = prev?.questions_response.filter((response) => {
  //       return (
  //         response.question?.input_question !== questionToRemove?.input_question ||
  //         response.question?.question_type !== questionToRemove?.question_type
  //       );
  //     });

  //     const updatedInteraction = {
  //       ...prev,
  //       questions_response: updatedQuestionsResponse,
  //     };

  //     setForms((prevForms) =>
  //       prevForms.map((form) =>
  //         form?.prompt_output_pair_id === updatedInteraction.prompt_output_pair_id
  //           ? {
  //               ...form,
  //               questions_response: updatedQuestionsResponse,
  //             }
  //           : form
  //       )
  //     );

  //     return updatedInteraction;
  //   });
  // };

  // console.log("Selected : q" + JSON.stringify(selectedQuestions));
  const handleInputChange = (e, interactionIndex, blankIndex) => {
    const { value } = e.target;

    setCurrentInteraction((prev) => {
      const updatedQuestionsResponse = prev.questions_response?.map(
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
  const styles = {
    responseContainer: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },
    responseBox: {
      flex: "1 1 45%",
      minWidth: "100px",
      border: "1px solid #ccc",
      fontSize: "16px",
      padding: "10px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "white",
    },
    response1Box: {
      flex: "1 1 45%",
      maxWidth: "100%",
      border: "1px solid #ccc",
      padding: "7px",
      height:"auto",
      fontSize: "17px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "white",
      wordWrap: "break-word",
        },
  };

  const EvaluationForm = () => {
    return (
      <div className={classes.rightPanel}>
        <div className={classes.promptContainer} style={{ overflowY: "auto" }}>
          <div className={classes.heading} style={{ fontSize: "20px" }}>
            {translate("modal.prompt")}
          </div>
          <div style={styles.response1Box}>
            <ReactMarkdown style={{ overflow: "hidden",height:"auto" }}
              remarkPlugins={[remarkBreaks]}

              children={currentInteraction?.prompt?.replace(/\n/gi, "&nbsp; \n")}

            >
            </ReactMarkdown>
          </div>
        </div>
        <div className={classes.heading} style={{ fontSize: "20px" }}>
          {translate("modal.output")}
        </div>
        <div
          className={classes.outputContainer}
          style={{ maxHeight: "auto", overflowY: "auto" }}
        >
          <div style={styles.response1Box}>
            <ReactMarkdown
                          remarkPlugins={[remarkBreaks]}

                          children={currentInteraction?.output?.replace(/\n/gi, "&nbsp; \n")}
>
            </ReactMarkdown>
          </div>
        </div>
        {/* <div className={classes.ratingText}>
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
              className={`${classes.numBtn} ${currentInteraction.rating === index + 1 ? classes.selected : ""
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
        </Box> */}
        <hr className={classes.hr} />
        <div className={classes.heading}>{translate("modal.select_que")}</div>
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
                        <span
                          key={`${i}-${index}`}
                          style={{fontSize:"16px"}}
                        >
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
                              required={true}
                            />
                          )}
                        </span>
                      ))}
                      { (
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
                      <span style={{ fontSize: "16px" }}>
                        {i + 1}. {question.input_question}
                      </span>
                      { (
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
                            className={`${classes.numBtn} ${
                              currentInteraction?.questions_response
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
                            required={true}
                          />
                        ),
                      )}
                    </Box>
                  </div>
                );

              case "multi_select_options":
                return (
                  <div key={i}>
                    <div
                      className={classes.inputQuestion}
                      style={{ fontSize: "16px" }}
                    >
                      {i + 1}. {question.input_question}
                      { (
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
                    <div
                      className={classes.inputQuestion}
                      style={{ fontSize: "16px" }}
                    >
                      {i + 1}. {question.input_question}
                      { (
                        <span style={{ color: "#d93025", fontSize: "25px" }}>
                          {" "}
                          *
                        </span>
                      )}
                    </div>
                    <FormControl
                      component="fieldset"
                      required={true}
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
        }}
      >
        {pairs?.map((pair, index) => {
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

  // const QuestionList = ({ questions }) => {
  //   return (
  //     <div style={{ height: "25rem", overflowY: "scroll", margin: "1.5rem 1.5rem 2rem 1.5rem" }}>
  //       <div className={classes.questionList}>
  //         {questions?.map((question, index) => (
  //           <Box
  //             key={index}
  //             sx={{
  //               padding: "10px",
  //               margin: "5px 0",
  //               backgroundColor: selectedQuestions.some((selectedQ) =>
  //                 selectedQ?.input_question === question?.input_question &&
  //                 selectedQ?.question_type === question?.question_type
  //               ) ? "#d3d3d3" : "#fff",
  //               cursor: "pointer",
  //             }}
  //             onClick={() => handleQuestionClick(question)}
  //           >
  //             {question.input_question}
  //           </Box>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  const InteractionDisplay = () => {
    return (
      // <Resizable
      //   defaultSize={{
      //     width: "30%",
      //     height: "100%",
      //   }}
      //   minWidth={"20%"}
      //   // maxWidth={"70%"}
      //   enable={{ right: true, top: false, bottom: false, left: false }}
      // >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          className={classes.heading}
          style={{ margin: "2rem 0 0.5rem 1.5rem", fontSize: "20px" }}
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
          <Divider
            variant="middle"
            style={{
              width: "95%",
              margin: "0 2rem 0 2rem",
              backgroundColor: "black",
            }}
          />
        )}

        {EvaluationForm()}
      </div>
    </>
  );
};

export default memo(ModelInteractionEvaluation);
