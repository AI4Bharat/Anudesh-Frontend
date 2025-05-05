"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Button from "../../../../components/common/Button";
import ReactMarkdown from "react-markdown";
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
import { Divider } from "@material-ui/core";
import Spinner from "@/components/common/Spinner";

import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Resizable } from "re-resizable";
import { translate } from "@/config/localisation";
import GetTaskAnnotationsAPI from "@/app/actions/api/Dashboard/GetTaskAnnotationsAPI";
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
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState({});
  const [selectedRatings, setSelectedRatings] = useState({});
  const [expanded, setExpanded] = useState(
    Array(interactions.length).fill(false),
  );
  const [expandedCurrentFormAccordion, setExpandedCurrentFormAccordion] =
    useState(false);

  const handleAccordionChange = (index) => (event, isExpanded) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[index] = isExpanded;

      return newExpanded;
    });
  };

  const handleHover = (newHover, index) => {
    setHover((prev) => {
      const updated = {
        ...prev,
        [index]: newHover,
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

  const handleReset = (e, index) => {
    e.stopPropagation();
    setCurrentInteraction((prev) => ({
      ...prev,
      questions_response: Array(questions?.length).fill(null),
    }));
    setSelectedRatings({});
    setHover({});
  };

  const parsedForms = useMemo(() => {
    if (annotation && annotation[0]?.result) {
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
  }, [annotation, taskId]);

  useEffect(() => {
    setForms(parsedForms);
  }, [parsedForms, setForms]);

  const fetchInteractions = useCallback(async () => {
    try {
      const taskDetailsObj = new GetTaskDetailsAPI(taskId);
      const taskResponse = await fetch(taskDetailsObj.apiEndPoint(), {
        method: "GET",
        headers: taskDetailsObj.getHeaders().headers,
      });
      const taskData = await taskResponse.json();
      setInteractions(taskData?.data?.interactions_json || []);
    } catch (error) {
      console.error("Error fetching interactions:", error);
    }
  }, [annotation, taskId]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  useEffect(() => {
    if (forms?.length > 0 && interactions?.length > 0) {
      if (clickedPromptOutputPairId) {
        var defaultFormId = clickedPromptOutputPairId;
      } else {
        var defaultFormId = forms[0]?.prompt_output_pair_id;
      }
      const currentForm = forms.find(
        (form) => form?.prompt_output_pair_id == defaultFormId,
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
      setForms(initialForms);
    }
  }, [forms, interactions, taskId]);

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
      return allMandatoryAnswered;
    });

    setAnswered(allFormsAnswered);
  }, [forms, taskId]);

  useEffect(() => {
    if (!clickedPromptOutputPairId && forms?.length > 0) {
      setclickedPromptOutputPairId(forms[0].prompt_output_pair_id);
    }
  }, [forms]);

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
    if (!prompt) return "";
    const formattedText = prompt.replace(/(\r\n|\r|\n)/g, "  \n");
    return formattedText;
  };

  const handleFormBtnClick = (e) => {
    e.stopPropagation();
    setclickedPromptOutputPairId(e.target.id);
    const currInteraction = forms?.find(
      (interaction) =>
        interaction?.prompt_output_pair_id == clickedPromptOutputPairId,
    );
    if (currInteraction) {
      setCurrentInteraction({
        prompt: currInteraction?.prompt,
        output: Array.isArray(currInteraction.output)
          ? currInteraction?.output?.map((item) => item.value).join(", ")
          : currInteraction.output,
        prompt_output_pair_id: currInteraction?.prompt_output_pair_id,
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
    responseBox: {
      flex: "1 1 45%",
      fontSize: "16px",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#FFF1EF",
    },
    response1Box: {
      flex: "1 1 45%",
      whiteSpace: "normal",
      wordWrap: "break-word",
      padding: "20px",
      fontSize: "17px",
      borderRadius: "20px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#FFF1EF",
    },
  };

  const EvaluationForm = () => {
    return (
      <div className={classes.rightPanel}>
        <Accordion
          defaultExpanded
          expanded={expandedCurrentFormAccordion}
          onChange={() => {
            setExpandedCurrentFormAccordion((prev) => !prev);
          }}
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
              <div
                className={classes.promptContainer}
                style={{ maxHeight: "auto", overflowY: "auto" }}
              >
                <div
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    backgroundColor: "#FFF1EF",
                    padding: "0 20px 20px",
                    borderRadius: "20px",
                    ...(expandedCurrentFormAccordion
                      ? {}
                      : {
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }),
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkBreaks]}
                    children={currentInteraction?.prompt?.replace(
                      /\n/gi,
                      "&nbsp; \n",
                    )}
                  ></ReactMarkdown>
                </div>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
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
                  children={currentInteraction?.output?.replace(
                    /\n/gi,
                    "&nbsp; \n",
                  )}
                ></ReactMarkdown>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <div className={classes.heading}>{translate("modal.select_que")}</div>
        <div
          style={{
            overflowY: "auto",
            // maxHeight: "90vh",
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
                          style={{ fontSize: "16px" }}
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
                                // lineHeight: "1.5",
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
                      {
                        <span style={{ color: "#d93025", fontSize: "25px" }}>
                          {" "}
                          *
                        </span>
                      }
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
                      {
                        <span style={{ color: "#d93025", fontSize: "25px" }}>
                          {" "}
                          *
                        </span>
                      }
                    </div>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseLeave={() => handleHover(null)}
                      >
                        <Rating
                          name={`rating`}
                          value={
                            (currentInteraction?.questions_response &&
                              currentInteraction?.questions_response[i]
                                ?.response[0]) ||
                            0
                          }
                          getLabelText={getLabelText}
                          onChange={(event, newValue) => {
                            handleRating(newValue, i);
                            setSelectedRatings((prev) => ({
                              ...prev,
                              [i]: newValue,
                            }));
                            setHover({});
                          }}
                          onChangeActive={(event, newHover) => {
                            handleHover(newHover, i);
                          }}
                          sx={{
                            marginLeft: "18px",
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
                              style={{
                                opacity: 0.55,
                                color: "#EE6633",
                              }}
                              fontSize="inherit"
                            />
                          }
                        />
                        <Box
                          sx={{
                            ml: 2,
                            color: "#EE6633",
                            fontWeight: "bold",
                          }}
                        >
                          {(() => {
                            const currentHover = hover[i] || null;
                            const currentSelection =
                              Number(selectedRatings[i]) || null;
                            const initialResponse =
                              Number(
                                currentInteraction?.questions_response &&
                                  currentInteraction?.questions_response[i]
                                    ?.response[0],
                              ) || null;

                            return currentHover !== null && currentHover !== -1
                              ? labels[currentHover]
                              : initialResponse > 0
                                ? labels[initialResponse]
                                : initialResponse === null
                                  ? ""
                                  : currentSelection
                                    ? labels[currentSelection]
                                    : "";
                          })()}
                        </Box>
                      </Box>
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
                      {
                        <span style={{ color: "#d93025", fontSize: "25px" }}>
                          {" "}
                          *
                        </span>
                      }
                    </div>
                    <FormControl
                      component="fieldset"
                      sx={{
                        marginLeft: "18px",
                      }}
                    >
                      <FormGroup>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {question.input_selections_list.map((option, idx) => (
                            <div style={{ width: "50%" }} key={idx}>
                              <FormControlLabel
                                key={idx}
                                control={
                                  <Checkbox
                                    onChange={(e) =>
                                      handleMultiSelect(
                                        e.target.checked,
                                        option,
                                        i,
                                      )
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
                            </div>
                          ))}
                        </div>
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
                      {
                        <span style={{ color: "#d93025", fontSize: "25px" }}>
                          {" "}
                          *
                        </span>
                      }
                    </div>
                    <FormControl
                      component="fieldset"
                      required={true}
                      sx={{
                        marginLeft: "18px",
                      }}
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
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "16px",
                          }}
                        >
                          {question?.input_selections_list?.map(
                            (option, idx) => (
                              <div
                                key={idx}
                                style={{ width: "calc(50% - 8px)" }} // 2 per row with spacing
                              >
                                <FormControlLabel
                                  value={option}
                                  control={<Radio />}
                                  label={option}
                                />
                              </div>
                            ),
                          )}
                        </div>
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
          value={currentInteraction?.additional_note}
          style={{ minHeight: "50px", maxHeight: "10rem", height: "50px" }}
          onChange={handleNoteChange}
          className={classes.notesTextarea}
        />
      </div>
    );
  };

  const PairAccordion = ({ pairs, classes }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1rem",
          width: "calc(100% - 0.1rem)",
        }}
      >
        {pairs?.length == 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#C8C7C6",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "3rem",
              }}
            >
              {" "}
              \(^Д^)/
            </Typography>
            <Typography>Nothing to display here!</Typography>
          </Box>
        )}
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
                border: "none",
                margin: 2,
                width: "inherit",
                backgroundColor:
                  clickedPromptOutputPairId == pair.prompt_output_pair_id
                    ? "#FEF0EE"
                    : "transparent",
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
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {pair?.prompt}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ cursor: "pointer" }}>
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
                      marginLeft: "1rem",
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      handleFormBtnClick(event);
                    }}
                    id={pair?.prompt_output_pair_id}
                  />
                  {clickedPromptOutputPairId == pair.prompt_output_pair_id && (
                    <Button
                      label="Reset"
                      buttonVariant={"outlined"}
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        handleReset(event, index);
                      }}
                      sx={{
                        marginTop: "1rem",
                        marginLeft: "1rem",
                      }}
                    />
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    );
  };

  const InteractionDisplay = () => {
    return (
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
    );
  };

  return (
    <>
      <Box
        className={classes.container}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "start",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: open ? "30%" : "10%",
            minWidth: open ? "30%" : "10%",
            paddingTop: "24px",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                ml: 8,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          {open && (
            <Box
              sx={{
                border: "1px solid #E1E1E0",
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
          )}
        </Box>
        <Box
          sx={{
            width: open ? "70%" : "90%",
            minWidth: open ? "70%" : "90%",
          }}
        >
          <Main open={open}>{EvaluationForm()}</Main>
        </Box>
      </Box>
    </>
  );
};

export default memo(ModelInteractionEvaluation);
