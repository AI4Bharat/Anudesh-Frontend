"use client";
import "./chat.css";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import React, { useState, useEffect, useRef } from "react";
import CustomizedSnackbars from "@/components/common/Snackbar";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import PatchAnnotationAPI from "@/app/actions/api/Dashboard/PatchAnnotations";
import ChatLang from "@/utils/Chatlang";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import configs from "@/config/config";
import ErrorIcon from "@mui/icons-material/Error";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import ModelResponseEvaluationStyle from "@/styles/ModelResponseEvaluation";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import LanguageCode from "@/utils/LanguageCode";

const orange = {
  200: "pink",
  400: "#EE6633",
  600: "#EE663366",
};

const grey = {
  50: "#F3F6F9",
  200: "#DAE2ED",
  300: "#C7D0DD",
  700: "#434D5B",
  900: "#1C2025",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const viewFullResponseModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
  padding: "2.4rem",
  backgroundImage: `url("https://i.postimg.cc/76Mw8q8t/chat-bg.webp")`,
};

const MultipleLLMInstructionDrivenChat = ({
  chatHistory,
  setChatHistory,
  handleClick,
  formatResponse,
  id,
  stage,
  notes,
  info,
  disableUpdateButton,
  annotation,
  evalFormResponse,
  setEvalFormResponse,
  setIsModelFailing,
  submittedEvalForms,
  setSubmittedEvalForms,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const [inputValue, setInputValue] = useState("");
  const { taskId } = useParams();
  const [annotationId, setAnnotationId] = useState();
  const bottomRef = useRef(null);
  const [showChatContainer, setShowChatContainer] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadtime, setloadtime] = useState(new Date());
  const [activeModalIdentifier, setActiveModalIdentifier] = useState(null); // For dynamic model responses
  const [visibleMessages, setVisibleMessages] = useState({});
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const questions = ProjectDetails?.metadata_json?.questions_json;
  const classes = ModelResponseEvaluationStyle();
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [targetLang, setTargetLang] = useState("");
  const [globalTransliteration, setGlobalTransliteration] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // if (typeof window !== "undefined") {
    //   const storedGlobalTransliteration = localStorage.getItem(
    //     "globalTransliteration",
    //   );
    //   const storedLanguage = localStorage.getItem("language");

    //   if (storedGlobalTransliteration !== null) {
    //     setGlobalTransliteration(storedGlobalTransliteration === "true");
    //   }
    //   if (storedLanguage !== null) {
    //     setTargetLang(storedLanguage);
    //   }
    // }

    const lc = LanguageCode.languages.find(
      (lang) => lang.label.toLowerCase() === ProjectDetails?.tgt_language?.toLowerCase()
    );
    if (Number(info.meta_info_language) < 3) {
      setTargetLang(lc.code);
    } else {
      setTargetLang("en");
    }

  }, [chatHistory]);

  useEffect(() => {
    setVisibleMessages((prev) => {
      const updated = { ...prev };
      chatHistory.forEach((chat, index) => {
        if (!(index in updated)) {
          updated[index] = true;
        }
      });
      return updated;
    });
  }, [chatHistory]);

  useEffect(() => {
    let modifiedChatHistory = [];
    if (
      annotation &&
      annotation?.[0] &&
      annotation?.[0]?.result &&
      Array.isArray(annotation?.[0]?.result) &&
      annotation?.[0]?.id &&
      annotation?.[0]?.result?.length > 0 &&
      annotation?.[0]?.result?.[0]?.model_interactions &&
      Array.isArray(annotation?.[0]?.result?.[0]?.model_interactions) &&
      annotation?.[0]?.result?.[0]?.model_interactions.length > 0
    ) {
      const allModelsInteractions =
        annotation[0].result[0].model_interactions;
      const interactions_length =
        allModelsInteractions[0]?.interaction_json?.length || 0;
      console.log("lead", allModelsInteractions);
      for (let i = 0; i < interactions_length; i++) {
        const prompt =
          allModelsInteractions[0]?.interaction_json[i]?.prompt;

        const modelOutputs = [];
        let turnPromptOutputPairId = null;

        allModelsInteractions.forEach((modelData, modelIdx) => {
          const interaction = modelData?.interaction_json?.[i];
          console.log("lead", interaction);

          if (interaction) {
            const response_valid = isString(interaction?.output);
            if (!response_valid) {
              setIsModelFailing(true);
            }
            if (modelIdx === 0) {
              turnPromptOutputPairId = interaction?.prompt_output_pair_id;
            }

            modelOutputs.push({
              model_name: modelData?.model_name,
              output: response_valid
                ? formatResponse(interaction?.output)
                : formatResponse(
                  `${modelData?.model_name} failed to generate a response`,
                ),
              status: response_valid ? "success" : "error",
              prompt_output_pair_id: interaction?.prompt_output_pair_id,
              output_error: response_valid
                ? null
                : JSON.stringify(interaction?.output),
            });
          }
        });


        if (turnPromptOutputPairId) {
          const eval_form = (
            Array.isArray(annotation?.[0]?.result?.[0]?.eval_form)
              ? annotation[0].result[0].eval_form
              : []
          ).find(
            (item) =>
              item.prompt_output_pair_id === turnPromptOutputPairId,
          );

          if (eval_form) {
            setEvalFormResponse((prev) => ({
              ...prev,
              [turnPromptOutputPairId]: eval_form,
            }));

            setSubmittedEvalForms((prev) => ({
              ...prev,
              [turnPromptOutputPairId]: eval_form,
            }));
          }
        }

        if (prompt !== undefined && modelOutputs.length > 0) {
          modifiedChatHistory?.push({
            prompt: prompt,
            output: modelOutputs,
            prompt_output_pair_id: turnPromptOutputPairId,
          });
        }
      }
      setChatHistory(modifiedChatHistory);
    } else {
      setChatHistory([]);
    }
    setAnnotationId(annotation?.[0]?.id);
    setShowChatContainer(!!annotation?.[0]?.result);
  }, [annotation]);

  const handleClosePreferredResponseModal = (index) => {
    setVisibleMessages((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const handleOpenPreferredResponseModal = (index) => {
    setVisibleMessages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const handleOpenViewFullResponse = (messageIndex, modelIndex) => {
    setActiveModalIdentifier(`${messageIndex}_${modelIndex}`);
  };

  const handleCloseViewFullResponse = () => {
    setActiveModalIdentifier(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  function isString(value) {
    return typeof value === "string" || value instanceof String;
  }

  const generateUniquePromptOutputPairId = () => {
    const time = Date.now();
    const rand = Math.floor(Math.random() * 1000);
    const deviceHash =
      window.navigator.userAgent
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
    return Number(`${time}${deviceHash}${rand}`);
  };

  const handleButtonClick = async (prompt_output_pair_id, modelResponses, index=null) => {
    if (inputValue || (modelResponses && prompt_output_pair_id >= 0)) {
      setLoading(true);
      const body = {
        result: modelResponses && prompt_output_pair_id >= 0 ? "" : inputValue,
        lead_time:
          (new Date() - loadtime) / 1000 +
          Number(id?.lead_time?.lead_time ?? 0),
        auto_save: true,
        task_id: taskId,
        prompt_output_pair_id:
          modelResponses && prompt_output_pair_id >= 0
            ? prompt_output_pair_id
            : generateUniquePromptOutputPairId(),
        ...(modelResponses &&
          prompt_output_pair_id >= 0 && {
          model_responses_json: modelResponses?.model_responses_json,
        }),
      };
      if (stage === "Alltask") {
        body.annotation_status = id?.annotation_status;
      } else {
        body.annotation_status = localStorage.getItem("labellingMode");
      }
      if (stage === "Review") {
        body.review_notes = JSON.stringify(
          notes?.current?.getEditor().getContents(),
        );
      } else if (stage === "SuperChecker") {
        body.superchecker_notes = JSON.stringify(
          notes?.current?.getEditor().getContents(),
        );
      } else {
        body.annotation_notes = JSON.stringify(
          notes?.current?.getEditor().getContents(),
        );
      }
      if (stage === "Review" || stage === "SuperChecker") {
        body.parentannotation = id?.parent_annotation;
      }
      const AnnotationObj = new PatchAnnotationAPI(id?.id, body);
      const res = await fetch(AnnotationObj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(AnnotationObj.getBody()),
        headers: AnnotationObj.getHeaders().headers,
      });
      const data = await res.json();
      console.log("hello", data);
      let errorMessage = null;

      for (const [modelName, modelResponse] of Object.entries(data.output)) {
        if (modelResponse?.error) {
          errorMessage = `${modelName} error: ${modelResponse.error}`;
          break; 
        }
      }

      if (errorMessage) {
        setSnackbarInfo({
          open: true,
          message: errorMessage,
          variant: "error",
        });
      }
      if (!inputValue && modelResponses && prompt_output_pair_id >= 0) {
        if (data.message === "Success") {
          setSubmittedEvalForms((prev) => ({
            ...prev,
            [prompt_output_pair_id]: modelResponses,
          }));
          setSnackbarInfo({
            open: true,
            message: "Preferred response saved successfully!",
            variant: "success",
          });
          handleClosePreferredResponseModal(index);
        } else {
          setSnackbarInfo({
            open: true,
            message: "Saving preferred response failed! Try again later.",
            variant: "error",
          });
        }
      }
      if (!inputValue && prompt_output_pair_id && modelResponses) {
        setSubmittedEvalForms((prev) => ({
          ...prev,
          [prompt_output_pair_id]: modelResponses,
        }));
      }
      let modifiedChatHistory = [];
      setChatHistory((prevChatHistory) => {
        data && data.result && setLoading(false);
        let modifiedChatHistory = [];

        if (data && data.result && data.result.length > 0 && data.result[0].model_interactions && Array.isArray(data.result[0].model_interactions) && data.result[0].model_interactions.length > 0) {
          const allModelsInteractions = data.result[0].model_interactions;
          const interactions_length =
            allModelsInteractions[0]?.interaction_json?.length || 0;

          for (let i = 0; i < interactions_length; i++) {
            const prompt =
              allModelsInteractions[0]?.interaction_json[i]?.prompt;

            const modelOutputs = [];
            let turnPromptOutputPairId = null;

            allModelsInteractions.forEach((modelData, modelIdx) => {
              const interaction = modelData?.interaction_json?.[i];
              console.log("lead", interaction,)

              if (interaction) {
                const response_valid = isString(interaction?.output);
                console.log("lead", response_valid, interaction)
                if (!response_valid) {
                  setIsModelFailing(true);
                }
                if (modelIdx === 0) {
                  turnPromptOutputPairId = interaction?.prompt_output_pair_id;
                }

                modelOutputs.push({
                  model_name: modelData?.model_name,
                  output: response_valid
                    ? formatResponse(interaction?.output)
                    : formatResponse(
                      `${modelData?.model_name} failed to generate a response`,
                    ),
                  status: response_valid ? "success" : "error",
                  prompt_output_pair_id: interaction?.prompt_output_pair_id,
                  output_error: response_valid
                    ? null
                    : JSON.stringify(interaction?.output),
                });
              }
            });

            if (turnPromptOutputPairId) {
              const eval_form = (
                Array.isArray(data?.result[0]?.eval_form)
                  ? data.result[0].eval_form
                  : []
              ).find(
                (item) =>
                  item.prompt_output_pair_id ===
                  turnPromptOutputPairId,
              );

              if (eval_form) {
                setEvalFormResponse((prev) => ({
                  ...prev,
                  [turnPromptOutputPairId]: eval_form,
                }));
              }
            }

            if (prompt !== undefined && modelOutputs.length > 0) {
              modifiedChatHistory.push({
                prompt: prompt,
                output: modelOutputs,
                prompt_output_pair_id: turnPromptOutputPairId,
              });
            }
          }
        } else {
          setLoading(false);
          setSnackbarInfo({
            open: true,
            message: data?.message,
            variant: "error",
          });
        }

        return data && data.result && data.result.length > 0
          ? [...modifiedChatHistory]
          : [...prevChatHistory];
      });

      setVisibleMessages((prev) => ({
        ...prev,
        [chatHistory.length]: true,
      }));
    } else {
      setSnackbarInfo({
        open: true,
        message: "Please provide a prompt",
        variant: "error",
      });
    }
    !(modelResponses && prompt_output_pair_id >= 0) &&
      setTimeout(() => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    setShowChatContainer(true);
    setInputValue("");
  };

  const handleOnchange = (prompt) => {
    setInputValue(prompt);
  };

  const handleTextChange = (newValue, currentMessage, modelIndexForOutput, segmentIndexForOutput, fieldType) => {
    setChatHistory(prevChatHistory => {
      return prevChatHistory.map(chatItem => {
        // Find the chat message being edited
        if (chatItem.prompt_output_pair_id === currentMessage.prompt_output_pair_id) {
          if (fieldType === "prompt") {
            return { ...chatItem, prompt: newValue };
          } else if (fieldType === "output") {
            // Update the specific model's output segments
            const newOutputArray = chatItem.output.map((modelOutput, idx) => {
              if (idx === modelIndexForOutput) {
                // If editable, we assume the entire output for this model becomes a single text segment
                // or, if segmentIndexForOutput is provided, we update that specific segment.
                // For simplicity matching original intent of editing "the output":
                // Let's assume formatResponse for an editable field for a model should ideally produce one text segment.
                // Or, if we want to allow editing only one segment among many, this logic would be different.
                // Given original calls, it seems it was replacing the whole output for the model.
                return {
                  ...modelOutput,
                  // Replace all segments with a single text segment containing the new value
                  output: [{ type: "text", value: newValue }],
                };
              }
              return modelOutput;
            });
            return { ...chatItem, output: newOutputArray };
          }
        }
        return chatItem;
      });
    });
  };

  const handleInputChange = (e, message, index, questionIdx, model_idx) => {
    const value = e.target.value;
    const blankIndex = Number(e.target.dataset.blankIndex);

    setEvalFormResponse((prev) => {
      const newState = { ...prev };
      if (!newState[index]) {
        newState[index] = {
          model_responses_json: [],
          prompt_output_pair_id: index,
        };
      }

      const modelResponses = [...newState[index].model_responses_json];
      const targetModel = message?.output?.[model_idx]?.model_name;
      let modelIndex = modelResponses.findIndex(
        (m) => m.model_name === targetModel,
      );

      if (modelIndex === -1) {
        modelResponses.push({
          model_name: targetModel,
          questions_response: [],
        });
        modelIndex = modelResponses.length - 1;
      }
      const questionResponses = [
        ...modelResponses[modelIndex].questions_response,
      ];
      const targetQuestion =
        ProjectDetails?.metadata_json?.questions_json?.[questionIdx]
          ?.input_question;
      let questionIndex = questionResponses.findIndex(
        (q) => q.question.input_question === targetQuestion,
      );

      if (questionIndex === -1) {
        questionResponses.push({
          question: ProjectDetails.metadata_json.questions_json[questionIdx],
          response: [],
        });
        questionIndex = questionResponses.length - 1;
      }

      const newResponse = [...questionResponses[questionIndex].response];
      newResponse[blankIndex] = value;

      return {
        ...newState,
        [index]: {
          ...newState[index],
          model_responses_json: [
            ...modelResponses.slice(0, modelIndex),
            {
              ...modelResponses[modelIndex],
              questions_response: [
                ...questionResponses.slice(0, questionIndex),
                {
                  ...questionResponses[questionIndex],
                  response: newResponse,
                },
                ...questionResponses.slice(questionIndex + 1),
              ],
            },
            ...modelResponses.slice(modelIndex + 1),
          ],
        },
      };
    });
  };

  const handleRating = (newValue, message, index, questionIdx, model_idx) => {
    setEvalFormResponse((prev) => {
      const targetModel = message?.output?.[model_idx]?.model_name;
      const targetQuestion =
        ProjectDetails?.metadata_json?.questions_json?.[questionIdx]
          ?.input_question;
      const newState = {
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          prompt_output_pair_id: index,
          model_responses_json: [
            ...(prev[index]?.model_responses_json || []).map((mr) => {
              if (mr.model_name === targetModel) {
                return {
                  ...mr,
                  questions_response: [
                    ...(mr.questions_response || []).map((qr) => {
                      if (qr.question.input_question === targetQuestion) {
                        return {
                          ...qr,
                          response: [newValue],
                        };
                      }
                      return qr;
                    }),
                    ...(!mr.questions_response?.some(
                      (qr) => qr.question.input_question === targetQuestion,
                    )
                      ? [
                        {
                          question:
                            ProjectDetails.metadata_json.questions_json[
                            questionIdx
                            ],
                          response: [newValue],
                        },
                      ]
                      : []),
                  ],
                };
              }
              return mr;
            }),
            ...(!prev[index]?.model_responses_json?.some(
              (mr) => mr.model_name === targetModel,
            )
              ? [
                {
                  model_name: targetModel,
                  questions_response: [
                    {
                      question:
                        ProjectDetails.metadata_json.questions_json[
                        questionIdx
                        ],
                      response: [newValue],
                    },
                  ],
                },
              ]
              : []),
          ],
        },
      };

      return newState;
    });
  };

  const handleMultiSelect = (
    index,
    message,
    option,
    questionIdx,
    model_idx,
  ) => {
    setEvalFormResponse((prev) => {
      const targetModel = message?.output?.[model_idx]?.model_name;
      const targetQuestion =
        ProjectDetails?.metadata_json?.questions_json?.[questionIdx]
          ?.input_question;
      const newState = {
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          prompt_output_pair_id: index,
          model_responses_json: [
            ...(prev[index]?.model_responses_json || []).map((mr) => {
              if (mr.model_name === targetModel) {
                return {
                  ...mr,
                  questions_response: [
                    ...(mr.questions_response || []).map((qr) => {
                      if (qr.question.input_question === targetQuestion) {
                        const currentResponses = qr.response || [];
                        const newResponses = currentResponses.includes(option)
                          ? currentResponses.filter((item) => item !== option)
                          : [...currentResponses, option];

                        return {
                          ...qr,
                          response: newResponses,
                        };
                      }
                      return qr;
                    }),
                    ...(!mr.questions_response?.some(
                      (qr) => qr.question.input_question === targetQuestion,
                    )
                      ? [
                        {
                          question:
                            ProjectDetails.metadata_json.questions_json[
                            questionIdx
                            ],
                          response: [option],
                        },
                      ]
                      : []),
                  ],
                };
              }
              return mr;
            }),
            ...(!prev[index]?.model_responses_json?.some(
              (mr) => mr.model_name === targetModel,
            )
              ? [
                {
                  model_name: targetModel,
                  questions_response: [
                    {
                      question:
                        ProjectDetails.metadata_json.questions_json[
                        questionIdx
                        ],
                      response: [option],
                    },
                  ],
                },
              ]
              : []),
          ],
        },
      };

      return newState;
    });
  };

  const handleMCQ = (index, message, option, questionIdx, model_idx) => {
    setEvalFormResponse((prev) => {
      const targetModel = message?.output?.[model_idx]?.model_name;
      const targetQuestion =
        ProjectDetails?.metadata_json?.questions_json?.[questionIdx]
          ?.input_question;
      const newState = {
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          prompt_output_pair_id: index,
          model_responses_json: [
            ...(prev[index]?.model_responses_json || []).map((mr) => {
              if (mr.model_name === targetModel) {
                // Update model response
                return {
                  ...mr,
                  questions_response: [
                    ...(mr.questions_response || []).map((qr) => {
                      if (qr.question.input_question === targetQuestion) {
                        return {
                          ...qr,
                          response: [option],
                        };
                      }
                      return qr;
                    }),
                    ...(!mr.questions_response?.some(
                      (qr) => qr.question.input_question === targetQuestion,
                    )
                      ? [
                        {
                          question:
                            ProjectDetails.metadata_json.questions_json[
                            questionIdx
                            ],
                          response: [option],
                        },
                      ]
                      : []),
                  ],
                };
              }
              return mr;
            }),
            ...(!prev[index]?.model_responses_json?.some(
              (mr) => mr.model_name === targetModel,
            )
              ? [
                {
                  model_name: targetModel,
                  questions_response: [
                    {
                      question:
                        ProjectDetails.metadata_json.questions_json[
                        questionIdx
                        ],
                      response: [option],
                    },
                  ],
                },
              ]
              : []),
          ],
        },
      };

      return newState;
    });
  };

  const handleComparison = (index, message, option, questionIdx, newValue) => {
    if (
      !index ||
      !message?.output ||
      !ProjectDetails?.metadata_json?.questions_json?.[questionIdx]
    ) {
      return;
    }

    setEvalFormResponse((prev) => {
      const safePrev = prev || {};

      const targetQuestion =
        ProjectDetails?.metadata_json?.questions_json?.[questionIdx]
          ?.input_question;
      const models = message?.output || [];

      const newState = {
        ...safePrev,
        [index]: {
          ...(safePrev[index] || {}),
          prompt_output_pair_id: index,
          model_responses_json: [
            ...(safePrev[index]?.model_responses_json || []).map(
              (existingModel) => {
                const messageModel = models.find(
                  (m) => m.model_name === existingModel.model_name,
                );

                if (messageModel) {
                  const isSelected = existingModel.model_name === newValue;

                  return {
                    ...existingModel,
                    questions_response: [
                      ...(existingModel.questions_response || []).filter(
                        (qr) =>
                          !(
                            qr.question?.question_type === "comparison" &&
                            qr.question?.input_question === targetQuestion
                          ),
                      ),
                      {
                        question:
                          ProjectDetails.metadata_json.questions_json[
                          questionIdx
                          ],
                        response: [isSelected ? newValue : "-1"],
                      },
                    ],
                  };
                }
                return existingModel;
              },
            ),
            ...models
              .filter(
                (model) =>
                  !safePrev[index]?.model_responses_json?.some(
                    (mr) => mr.model_name === model.model_name,
                  ),
              )
              .map((model) => {
                const isSelected = model.model_name === newValue;
                return {
                  model_name: model.model_name,
                  questions_response: [
                    {
                      question:
                        ProjectDetails.metadata_json.questions_json[
                        questionIdx
                        ],
                      response: [isSelected ? newValue : "-1"],
                    },
                  ],
                };
              }),
          ],
        },
      };
      return newState;
    });
  };

  const validateEvalFormResponse = (form, prompt_output_pair_id) => {
    if (!form?.model_responses_json) {
      return false;
    }

    const allModelsValid = form.model_responses_json.every((modelResponse) => {
      const allMandatoryAnswered = questions.every((question) => {
        let expectedParts = 0;
        if (question.question_type === "fill_in_blanks") {
          expectedParts =
            question?.input_question?.split("<blank>")?.length - 1;
        }

        const responseForQuestion = modelResponse?.questions_response?.find(
          (qr) =>
            qr?.question?.input_question === question?.input_question &&
            qr?.question?.question_type === question?.question_type,
        );

        if (!responseForQuestion?.response) {
          return false;
        }

        if (question.question_type === "fill_in_blanks") {
          const isCorrectLength =
            responseForQuestion.response.length === expectedParts;
          const hasNoEmptyResponse = !responseForQuestion.response.some(
            (response) => response === "" || response === undefined,
          );
          return isCorrectLength && hasNoEmptyResponse;
        }

        if (question.question_type === "comparison") {
          const isValidComparison =
            responseForQuestion.response.length === 1 &&
            responseForQuestion.response[0] !== "";
          return isValidComparison;
        }

        const hasValidResponse =
          responseForQuestion.response.length > 0 &&
          !responseForQuestion.response.some(
            (response) =>
              response === "" || response === undefined || response === null,
          );
        return hasValidResponse;
      });

      return allMandatoryAnswered;
    });

    return allModelsValid;
  };

  const renderChatHistory = () => {
    const chatElements = chatHistory?.map((message, index) => {
      return (
        <Grid
          container
          spacing={2}
          key={index}
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ marginLeft: "0.5rem" }}
        >
          <Grid
            item
            sx={{
              backgroundColor: "rgba(247, 184, 171, 0.2)",
              padding: "10px",
              borderRadius: "0.5rem",
              position: "relative",
              width: "100%",
              marginBottom: "0.6rem",
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar
                  alt="user_profile_pic"
                  src={loggedInUserData?.profile_photo || ""}
                  sx={{ marginRight: "1rem" }}
                />
              </Grid>
              <Grid item xs className="w-full">
                {ProjectDetails?.metadata_json?.editable_prompt ? (
                  globalTransliteration ? (
                    <IndicTransliterate
                      customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                      apiKey={`JWT ${localStorage.getItem(
                        "anudesh_access_token",
                      )}`}
                      renderComponent={(props) => (
                        <textarea
                          maxRows={10}
                          placeholder={translate("chat_placeholder")}
                          {...props}
                          className=""
                          style={{
                            fontSize: "1rem",
                            width: "100%",
                            padding: "12px",
                            borderRadius: "12px 12px 0 12px",
                            color: grey[900],
                            background: "#ffffff",
                            border: `1px solid ${grey[200]}`,
                            boxShadow: `0px 2px 2px ${grey[50]}`,
                            minHeight: "5rem",
                            resize: "none",
                          }}
                        />
                      )}
                      value={message.prompt}
                      onChangeText={(text) =>
                        handleTextChange(text, message, null, null, "prompt")
                      }
                      lang={targetLang}
                    />
                  ) : (
                    <textarea
                      value={message.prompt}
                      onChange={(e) =>
                        handleTextChange(e.target.value, message, null, null, "prompt")
                      }
                      style={{
                        fontSize: "1rem",
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px 12px 0 12px",
                        color: grey[900],
                        background: "#ffffff",
                        border: `1px solid ${grey[200]}`,
                        boxShadow: `0px 2px 2px ${grey[50]}`,
                        minHeight: "5rem",
                        resize: "none",
                      }}
                      rows={1}
                    />
                  )
                ) : (
                  <ReactMarkdown
                    className="flex-col"
                    children={message?.prompt?.replace(/\\n/gi, "&nbsp; \\n")}
                  />
                )}
              </Grid>
              {index === chatHistory.length - 1 &&
                stage !== "Alltask" &&
                !disableUpdateButton && (
                  <IconButton
                    size="large"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      marginTop: "1rem",
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      setEvalFormResponse((prev) => {
                        const newResponse = { ...prev };
                        delete newResponse[message?.output?.[0]?.prompt_output_pair_id];
                        return newResponse;
                      });

                      setVisibleMessages((prev) => {
                        const keys = Object.keys(prev);
                        delete prev[keys[keys.length - 1]];
                        return { ...prev };
                      });

                      setSubmittedEvalForms((prev) => {
                        const newResponse = { ...prev };
                        delete newResponse[message?.output?.[0]?.prompt_output_pair_id];
                        return newResponse;
                      });

                      handleClick(
                        "delete-pair",
                        id?.id,
                        0.0,
                        "MultipleLLMInstructionDrivenChat",
                      );
                    }}
                  >
                    <DeleteOutlinedIcon
                      sx={{ color: orange[400], fontSize: "1.2rem" }}
                    />
                  </IconButton>
                )}
            </Grid>
          </Grid>

          <Grid
            item
            sx={{
              textAlign: "left",
              position: "relative",
              width: "100%",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <Grid container alignItems="start" spacing={2}>
              <Grid item>
                <Image
                  width={50}
                  height={50}
                  src="https://i.postimg.cc/nz91fDCL/undefined-Imgur.webp"
                  alt="Bot Avatar"
                  priority
                />
              </Grid>

              <Grid
                item
                xs

                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  "-ms-overflow-style": "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  justifyContent: "flex-start",
                  gap: "0.5rem",
                  paddingBottom: "0.5rem",
                  cursor: "grab",
                  "&:active": {
                    cursor: "grabbing",
                  },
                }}

              >
                {message?.output?.map((modelOutput, modelIdx) => (
                  <React.Fragment key={modelIdx}>
                    {modelOutput?.status === "error" ? (
                      <Box
                        sx={{
                          border: "1px solid red",
                          width: "45%",
                          minWidth: "300px",
                          flexShrink: 0,
                          height: "10vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "10px",
                          color: "red",
                          fontWeight: "bold",
                          backgroundImage: `url("https://i.postimg.cc/76Mw8q8t/chat-bg.webp")`,
                        }}
                      >
                        <ErrorIcon
                          sx={{
                            marginRight: "10px",
                          }}
                        />
                        <Typography>
                          {modelOutput?.model_name} failed to load the
                          response!
                        </Typography>{" "}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          border: "1px solid #ccc",
                          width: "45%",
                          minWidth: "300px",
                          flexShrink: 0,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          borderRadius: "10px",
                          flexGrow: 1,
                        }}
                      >
                        <Tooltip
                          title={
                            <span style={{ fontFamily: "Roboto, sans-serif" }}>
                              Expand to view full response
                            </span>
                          }
                        >
                          <IconButton
                            onClick={() => handleOpenViewFullResponse(index, modelIdx)}
                          >
                            <OpenInFullIcon
                              sx={{
                                padding: "5px 5px 0 0",
                                color: orange[400],
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Modal
                          open={activeModalIdentifier === `${index}_${modelIdx}`}
                          onClose={handleCloseViewFullResponse}
                          closeAfterTransition
                          BackdropComponent={Backdrop}
                          BackdropProps={{
                            timeout: 500,
                            sx: {
                              backdropFilter: "blur(2px)",
                              backgroundColor: "rgba(0, 0, 0, 0.2)",
                            },
                          }}
                        >
                          <Fade in={activeModalIdentifier === `${index}_${modelIdx}`}>
                            <Box sx={viewFullResponseModalStyle}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  paddingBottom: "1.5rem",
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: "bold",
                                    color: orange[400],
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {"Model "+(modelIdx+1)}
                                </Typography>
                                <IconButton
                                  onClick={handleCloseViewFullResponse}
                                >
                                  <CloseIcon sx={{ color: orange[400] }} />
                                </IconButton>
                              </Box>
                              <Typography
                                component="div"
                                sx={{
                                  fontSize: "1.2rem",
                                  maxHeight: "60vh",
                                  overflowY: "scroll",
                                }}
                              >
                                {modelOutput?.output?.map(
                                  (segment, segmentIdx) =>
                                    segment.type === "text" ? (
                                      ProjectDetails?.metadata_json
                                        ?.editable_response ||
                                        segment.value == "" ? (
                                        globalTransliteration ? (
                                          <IndicTransliterate
                                            key={segmentIdx}
                                            value={segment.value}
                                            onChangeText={(text) =>
                                              handleTextChange(
                                                text,
                                                message,
                                                modelIdx,
                                                segmentIdx,
                                                "output",
                                              )
                                            }
                                            lang={targetLang}
                                            renderComponent={(props) => (
                                              <textarea
                                                {...props}
                                                style={{
                                                  fontSize: "1rem",
                                                  padding: "12px",
                                                  borderRadius: "12px 12px 0 12px",
                                                  color: grey[900],
                                                  background: "#ffffff",
                                                  border: `1px solid ${grey[200]}`,
                                                  boxShadow: `0px 2px 2px ${grey[50]}`,
                                                  minHeight: "5rem",
                                                  width: "100%",
                                                  resize: "none",
                                                }}
                                              />
                                            )}
                                          />
                                        ) : (
                                          <textarea
                                            key={segmentIdx}
                                            value={segment.value}
                                            onChange={(e) =>
                                              handleTextChange(
                                                e.target.value,
                                                message,
                                                modelIdx,
                                                segmentIdx,
                                                "output",
                                              )
                                            }
                                            style={{
                                              fontSize: "1rem",
                                              width: "100%",
                                              padding: "12px",
                                              borderRadius: "12px 12px 0 12px",
                                              color: grey[900],
                                              background: "#ffffff",
                                              border: `1px solid ${grey[200]}`,
                                              boxShadow: `0px 2px 2px ${grey[50]}`,
                                              minHeight: "5rem",
                                              resize: "none",
                                            }}
                                            rows={1}
                                          />
                                        )
                                      ) : (
                                        <ReactMarkdown
                                          key={segmentIdx}
                                          children={segment?.value?.replace(
                                            /\\n/gi,
                                            "&nbsp; \\n",
                                          )}
                                        />
                                      )
                                    ) : (
                                      <SyntaxHighlighter
                                        key={segmentIdx}
                                        language={segment.language}
                                        style={gruvboxDark}
                                        customStyle={{
                                          padding: "1rem",
                                          borderRadius: "5px",
                                        }}
                                      >
                                        {segment.value}
                                      </SyntaxHighlighter>
                                    ),
                                )}
                              </Typography>
                            </Box>
                          </Fade>
                        </Modal>
                        <Box
                          sx={{
                            overflowY: "auto",
                            maxHeight: "400px",
                            padding: "0 5px 0 20px",
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                        >
                          {modelOutput?.output?.map((segment, segmentIdx) =>
                            segment.type === "text" ? (
                              ProjectDetails?.metadata_json?.editable_response || segment.value == "" ? (
                                globalTransliteration ? (
                                  <IndicTransliterate
                                    key={segmentIdx}
                                    value={segment.value}
                                    onChangeText={(text) =>
                                      handleTextChange(
                                        text,
                                        message,
                                        modelIdx,
                                        segmentIdx,
                                        "output",
                                      )
                                    }
                                    lang={targetLang}
                                    renderComponent={(props) => (
                                      <textarea
                                        {...props}
                                        style={{
                                          fontSize: "1rem",
                                          padding: "12px",
                                          borderRadius: "12px 12px 0 12px",
                                          color: grey[900],
                                          background: "#ffffff",
                                          border: `1px solid ${grey[200]}`,
                                          boxShadow: `0px 2px 2px ${grey[50]}`,
                                          minHeight: "5rem",
                                          width: "100%",
                                          resize: "none",
                                        }}
                                      />
                                    )}
                                  />
                                ) : (
                                  <textarea
                                    key={segmentIdx}
                                    value={segment.value}
                                    onChange={(e) =>
                                      handleTextChange(
                                        e.target.value,
                                        message,
                                        modelIdx,
                                        segmentIdx,
                                        "output",
                                      )
                                    }
                                    style={{
                                      fontSize: "1rem",
                                      width: "100%",
                                      padding: "10px",
                                      borderRadius: "12px 12px 0 12px",
                                      color: grey[900],
                                      background: "#ffffff",
                                      border: `1px solid ${grey[200]}`,
                                      boxShadow: `0px 2px 2px ${grey[50]}`,
                                      minHeight: "5rem",
                                      resize: "none",
                                    }}
                                    rows={1}
                                  />
                                )
                              ) : (
                                <ReactMarkdown
                                  key={segmentIdx}
                                  children={segment?.value?.replace(
                                    /\\n/gi,
                                    "&nbsp; \\n",
                                  )}
                                />
                              )
                            ) : (
                              <SyntaxHighlighter
                                key={segmentIdx}
                                language={segment.language}
                                style={gruvboxDark}
                                customStyle={{
                                  padding: "1rem",
                                  borderRadius: "5px",
                                }}
                              >
                                {segment.value}
                              </SyntaxHighlighter>
                            ),
                          )}
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              backgroundColor: "#E8E6E6",
                              padding: "5px 10px 5px 10px",
                              borderRadius: "10px",
                              fontSize: "1rem",
                            }}
                          >
                            {"Model "+(modelIdx+1)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </React.Fragment>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {ProjectDetails?.metadata_json?.enable_preference_selection &&
            visibleMessages[index] ? (
              <Grid
                item
                sx={{
                  padding: " 1.5rem",
                  position: "relative",
                  width: "85%",
                  backgroundColor: "rgba(247, 184, 171, 0.2)",
                  borderRadius: "10px",
                  marginBottom: "2rem",
                }}
              >
                <Box
                  sx={{
                    maxHeight: "16rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                      onClick={() => handleClosePreferredResponseModal(index)}
                    >
                      <CloseIcon
                        sx={{
                          color: orange[400],
                        }}
                      />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      maxHeight: "15rem",
                      overflowY: "auto",
                    }}
                  >
                    {ProjectDetails?.metadata_json?.questions_json?.map(
                      (question, questionIdx) => (
                        <div key={questionIdx}>
                          {question.question_type === "comparison" && (
                            <div style={{ marginBottom: "5px" }}>
                              <div className={classes.inputQuestion}>
                                {questionIdx + 1}. {question.input_question}
                                <span
                                  style={{ color: "#d93025", fontSize: "25px" }}
                                >
                                  {" "}
                                  *
                                </span>
                              </div>
                              <div style={{ paddingLeft: "20px" }}>
                                {question.input_selections_list?.map(
                                  (option, optionIdx) => (
                                    <div
                                      key={optionIdx}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span>{option}:</span>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          flexWrap: "wrap",
                                          paddingRight: "1rem",
                                        }}
                                      >
                                        <FormControl>
                                          <RadioGroup
                                            name={`comparison-${questionIdx}-${optionIdx}`}
                                            sx={{
                                              display: "flex",
                                              flexDirection: "row",
                                            }}
                                            value={(() => {
                                              const responses =
                                                evalFormResponse?.[
                                                  message?.output?.[0]
                                                    ?.prompt_output_pair_id
                                                ]?.model_responses_json;

                                              if (
                                                !responses ||
                                                !Array.isArray(responses)
                                              ) {
                                                return "";
                                              }
                                              const matchingResponse =
                                                responses.find((model) =>
                                                  model.questions_response?.some(
                                                    (q) =>
                                                      q.question
                                                        ?.question_type ===
                                                      question.question_type &&
                                                      q.question
                                                        ?.input_question ===
                                                      question.input_question &&
                                                      q.response?.[0] !== "-1",
                                                  ),
                                                );

                                              const validResponse =
                                                matchingResponse?.questions_response?.find(
                                                  (q) =>
                                                    q.question
                                                      ?.question_type ===
                                                    question.question_type &&
                                                    q.question
                                                      ?.input_question ===
                                                    question.input_question &&
                                                    q.response?.[0] !== "-1",
                                                );

                                              return (
                                                validResponse?.response?.[0] ||
                                                ""
                                              );
                                            })()}
                                            onChange={(e) =>
                                              handleComparison(
                                                message?.output?.[0]
                                                  ?.prompt_output_pair_id,
                                                message,
                                                option,
                                                questionIdx,
                                                e.target.value,
                                              )
                                            }
                                          >
                                            {message?.output?.map(
                                              (response, outputIdx) => (
                                                <FormControlLabel
                                                  key={outputIdx}
                                                  value={response.model_name}
                                                  control={<Radio />}
                                                  label={"Model "+(outputIdx+1)}
                                                  labelPlacement="start"
                                                />
                                              ),
                                            )}
                                          </RadioGroup>
                                        </FormControl>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                          {question.question_type === "fill_in_blanks" && (
                            <div
                              style={{
                                marginBottom: "5px",
                              }}
                            >
                              <p className={classes.inputQuestion}>
                                {questionIdx + 1}.{" "}
                                {question.input_question
                                  .split("<blank>")
                                  .map((part, index) => (
                                    <span key={`${questionIdx}-${index}`}>
                                      {part}
                                      {index <
                                        question.input_question.split("<blank>")
                                          .length -
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
                                <span
                                  style={{
                                    color: "#d93025",
                                    fontSize: "25px",
                                  }}
                                >
                                  {" "}
                                  *
                                </span>
                              </p>

                              <div
                                style={{
                                  padding: "10px 0 0 20px",
                                  maxWidth: "80%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                {message?.output?.map((response, outputIdx) => (
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
                                        color: "#6C5F5B",
                                        marginRight: "15px",
                                        marginTop: "0.7rem",
                                      }}
                                    >
                                      {"Model "+(outputIdx+1)}
                                    </Typography>
                                    {question.input_question
                                      .split("<blank>")
                                      .slice(0, -1)
                                      .map((_, idx) => (
                                        <input
                                          key={`${outputIdx}-${idx}`}
                                          data-blank-index={idx}
                                          type="text"
                                          value={
                                            evalFormResponse?.[
                                              message?.output?.[0]
                                                ?.prompt_output_pair_id
                                            ]?.model_responses_json
                                              ?.find(
                                                (m) =>
                                                  m.model_name ===
                                                  response.model_name,
                                              )
                                              ?.questions_response?.find(
                                                (q) =>
                                                  q.question.question_type ===
                                                  question.question_type &&
                                                  q.question.input_question ===
                                                  question.input_question,
                                              )?.response?.[idx] || ""
                                          }
                                          onChange={(e) =>
                                            handleInputChange(
                                              e,
                                              message,
                                              message?.output?.[0]
                                                ?.prompt_output_pair_id,
                                              questionIdx,
                                              outputIdx,
                                            )
                                          }
                                          style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            maxWidth: "200px",
                                          }}
                                          required
                                        />
                                      ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {question.question_type === "rating" && (
                            <div
                              style={{
                                marginBottom: "5px",
                              }}
                            >
                              <div className={classes.inputQuestion}>
                                <span>
                                  {questionIdx + 1}. {question.input_question}
                                </span>
                                <span
                                  style={{
                                    color: "#d93025",
                                    fontSize: "25px",
                                  }}
                                >
                                  {" "}
                                  *
                                </span>
                              </div>
                              <div
                                style={{
                                  padding: "10px 0 0 20px",
                                  maxWidth: "70%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                {message?.output?.map((response, outputIdx) => {
                                  return (
                                    <div key={outputIdx}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                        }}
                                      >
                                        <Typography
                                          variant="subtitle2"
                                          sx={{
                                            marginRight: "15px",
                                            marginTop: "0.5rem",
                                            fontWeight: "bold",
                                            color: "#6C5F5B",
                                          }}
                                        >
                                          {response?.model_name}
                                        </Typography>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Rating
                                            name={`rating-${outputIdx}`}
                                            value={
                                              evalFormResponse?.[
                                                message?.output?.[0]
                                                  ?.prompt_output_pair_id
                                              ]?.model_responses_json
                                                ?.find(
                                                  (m) =>
                                                    m.model_name ===
                                                    response.model_name,
                                                )
                                                ?.questions_response?.find(
                                                  (q) =>
                                                    q.question.question_type ===
                                                    question.question_type &&
                                                    q.question
                                                      .input_question ===
                                                    question.input_question,
                                                )?.response?.[0] || 0
                                            }
                                            onChange={(event, newValue) => {
                                              handleRating(
                                                newValue,
                                                message,
                                                message?.output?.[0]
                                                  ?.prompt_output_pair_id, // index
                                                questionIdx,
                                                outputIdx, // model_idx
                                              );
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
                                                style={{
                                                  opacity: 0.55,
                                                  color: orange[400],
                                                }}
                                                fontSize="inherit"
                                              />
                                            }
                                          />
                                        </Box>
                                      </Box>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {question.question_type === "mcq" && (
                            <div
                              style={{
                                marginBottom: "5px",
                              }}
                            >
                              <div className={classes.inputQuestion}>
                                {questionIdx + 1}. {question.input_question}
                                <span
                                  style={{
                                    color: "#d93025",
                                    fontSize: "25px",
                                  }}
                                >
                                  {" "}
                                  *
                                </span>
                              </div>

                              <div
                                style={{
                                  paddingLeft: "20px",
                                }}
                              >
                                {question?.input_selections_list?.map(
                                  (option, optionIdx) => (
                                    <div
                                      key={optionIdx}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexDirection: "row",
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
                                        {message?.output?.map(
                                          (response, outputIdx) => (
                                            <div
                                              key={`${optionIdx}-${outputIdx}`}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                paddingRight: "2rem",
                                              }}
                                            >
                                              <FormControl
                                                component="fieldset"
                                                key={outputIdx}
                                              >
                                                <RadioGroup
                                                  name={`question-${questionIdx}-model-${outputIdx}`}
                                                  value={
                                                    evalFormResponse?.[
                                                      message
                                                        ?.prompt_output_pair_id
                                                    ]?.model_responses_json
                                                      ?.find(
                                                        (m) =>
                                                          m.model_name ===
                                                          response.model_name,
                                                      )
                                                      ?.questions_response?.find(
                                                        (q) =>
                                                          q.question
                                                            .question_type ===
                                                          question.question_type &&
                                                          q.question
                                                            .input_question ===
                                                          question.input_question,
                                                      )?.response?.[0] || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleMCQ(
                                                      message?.output?.[0]
                                                        ?.prompt_output_pair_id, // index
                                                      message,
                                                      option,
                                                      questionIdx,
                                                      outputIdx, // model_idx
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
                                                        sx={{
                                                          fontWeight: "bold",
                                                          color: "#6C5F5B",
                                                        }}
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
                          {question.question_type ===
                            "multi_select_options" && (
                              <div
                                style={{
                                  marginBottom: "5px",
                                }}
                              >
                                <div className={classes.inputQuestion}>
                                  {questionIdx + 1}. {question.input_question}
                                  <span
                                    style={{
                                      color: "#d93025",
                                      fontSize: "25px",
                                    }}
                                  >
                                    {" "}
                                    *
                                  </span>
                                </div>
                                <div
                                  style={{
                                    paddingLeft: "20px",
                                  }}
                                >
                                  {question?.input_selections_list?.map(
                                    (option, optionIdx) => (
                                      <div
                                        key={optionIdx}
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                          alignItems: "center",
                                          justifyContent: "space-between",
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
                                          {message?.output?.map(
                                            (response, outputIdx) => (
                                              <div
                                                key={`${optionIdx}-${outputIdx}`}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  paddingRight: "2rem",
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
                                                              message?.output?.[0]
                                                                ?.prompt_output_pair_id, // index
                                                              message,
                                                              option,
                                                              questionIdx,
                                                              outputIdx, // model_idx
                                                            )
                                                          }
                                                          checked={
                                                            evalFormResponse?.[
                                                              message?.output?.[0]
                                                                ?.prompt_output_pair_id
                                                            ]?.model_responses_json
                                                              ?.find(
                                                                (m) =>
                                                                  m.model_name ===
                                                                  response.model_name,
                                                              )
                                                              ?.questions_response?.find(
                                                                (q) =>
                                                                  q.question
                                                                    .question_type ===
                                                                  question.question_type &&
                                                                  q.question
                                                                    .input_question ===
                                                                  question.input_question,
                                                              )
                                                              ?.response?.includes(
                                                                option,
                                                              ) || false
                                                          }
                                                        />
                                                      }
                                                      labelPlacement="start"
                                                      label={
                                                        <Typography
                                                          variant="subtitle2"
                                                          sx={{
                                                            fontWeight: "bold",
                                                            color: "#6C5F5B",
                                                          }}
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
                        </div>
                      ),
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        width: "100%",


                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          border: "1.5px solid #EE6633",
                          color: orange[400],
                          backgroundColor: "#FFF",
                          borderRadius: "8px",
                          padding: "0.5rem 0.5rem",
                          "&:hover": {
                            backgroundColor: orange[400],
                            color: "#FFF",
                          },
                          maxWidth: "fit-content",
                          marginBottom: "20px",
                          marginRight: "20px",
                        }}
                        onClick={() => {
                          const isValid = validateEvalFormResponse(
                            evalFormResponse?.[
                            message?.output?.[0]?.prompt_output_pair_id
                            ],
                            message?.output?.[0]?.prompt_output_pair_id,
                          );
                          if (isValid) {
                            handleButtonClick(
                              message?.output?.[0]?.prompt_output_pair_id,
                              evalFormResponse?.[
                              message?.output?.[0]?.prompt_output_pair_id
                              ], index
                            );
                          } else {
                            setSnackbarInfo({
                              open: true,
                              message:
                                "Please ensure that all the fields in the form is filled before saving the evaluation!",
                              variant: "error",
                            });
                          }
                        }}
                      >
                        Save Evaluations
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
          ) : (<Grid
            item
            sx={{
              padding: " 1rem",
              position: "relative",
              width: "85%",
              backgroundColor: "rgba(247, 184, 171, 0.2)",
              borderRadius: "10px",
              marginBottom: "2rem",
            }}
          >
            <Box
              sx={{
                maxHeight: "16rem",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className={classes.inputQuestion}>Model Output Evaluation Form</div>
                <IconButton
                  onClick={() => handleOpenPreferredResponseModal(index)}
                >
                  <OpenInFullIcon sx={{color: orange[400]}}/>
                </IconButton>
              </Box>
            </Box>
          </Grid>)}
        </Grid>
      );
    });

    return chatElements;
  };

  const ChildModal = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Button
          sx={{
            marginTop: "1rem",
          }}
          variant="outlined"
          onClick={handleOpen}
        >
          {translate("modalButton.metaDataInfo")}
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: "40%" }}>
            <Typography
              id="child-modal-title"
              color={"#F18359"}
              fontWeight={"bold"}
              variant="h6"
            >
              {translate("modal.domain")}
            </Typography>
            <Typography variant="subtitle1" id="child-modal-description">
              {info.meta_info_domain}
            </Typography>

            <Typography
              color={"#F18359"}
              fontWeight={"bold"}
              variant="h6"
              id="child-modal-title"
            >
              {translate("modal.intent")}
            </Typography>
            <Typography variant="subtitle1" id="child-modal-description">
              {info.meta_info_intent}
            </Typography>

            <Typography
              id="child-modal-title"
              color={"#F18359"}
              fontWeight={"bold"}
              variant="h6"
            >
              {translate("modal.language")}
            </Typography>
            <Typography variant="subtitle1" id="child-modal-description">
              {ChatLang[info.meta_info_language]}
            </Typography>

            <Button variant="outlined" onClick={handleClose}>
              {translate("modalButton.close")}
            </Button>
          </Box>
        </Modal>
      </>
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {renderSnackBar()}
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              borderRadius: "10px",
              padding: "10px",
              backgroundColor: "rgba(247, 184, 171, 0.2)",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              margin: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h3"
                align="center"
                sx={{
                  color: "#636363",
                  fontSize: {
                    xs: "0.8125rem", // Small screens (mobile)
                    sm: "1rem", // Medium screens (tablet)
                    md: "1.5rem", // Large screens (laptops)
                    lg: "2rem", // Extra-large screens (desktops)
                  },
                  fontWeight: "800",
                }}
              >
                {translate("typography.instructions")}
              </Typography>
              <Tooltip
                title={
                  <span style={{ fontFamily: "Roboto, sans-serif" }}>
                    Hint and Metadata
                  </span>
                }
              >
                <IconButton onClick={handleOpen}>
                  <TipsAndUpdatesIcon color="primary.dark" fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography
              paragraph={true}
              sx={{
                fontSize: {
                  xs: "0.5rem", // Small screens (mobile)
                  sm: "0.75rem", // Medium screens (tablet)
                  md: ".8125rem", // Large screens (laptops)
                  lg: "1rem", // Extra-large screens (desktops)
                },
                padding: "0.5rem 1rem ",
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "pre-line",
              }}
            >
              {info.instruction_data}
            </Typography>
          </Box>
        </Box>
        <Grid
          item
          xs={12}
          sx={{
            margin: "0.8rem 0",
            overflowY: "scroll",
            borderRadius: "20px",
            backgroundColor: "#FFF",
            paddingLeft: "0px !important",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center !important",
              padding: "1rem 0",
            }}
          >
            {showChatContainer ? renderChatHistory() : null}
          </Box>
          <Box ref={bottomRef} />
          {stage !== "Alltask" && !disableUpdateButton ? (
            <Grid
              item
              xs={12}
              sx={{
                boxSizing: "border-box",
                width: "100%",
                height: "5rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Textarea
                handleButtonClick={handleButtonClick}
                handleOnchange={handleOnchange}
                size={12}
                sx={{
                  width: "100vw",
                }}
                class_name={"w-full"}
                loading={loading}
                inputValue={inputValue}
                defaultLang={targetLang}
              />
            </Grid>
          ) : null}
        </Grid>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "40%" }}>
          <Typography
            color={"#F18359"}
            fontWeight={"bold"}
            variant="h6"
            id="parent-modal-title"
          >
            {translate("modal.hint")}
          </Typography>
          <Typography variant="subtitle1" id="parent-modal-description">
            {info.hint}
          </Typography>
          <Typography
            color={"#F18359"}
            fontWeight={"bold"}
            variant="h6"
            id="parent-modal-title"
          >
            {translate("modal.examples")}
          </Typography>
          <Typography variant="subtitle1" id="parent-modal-description">
            {info.examples}
          </Typography>
          <ChildModal />
        </Box>
      </Modal>
    </>
  );
};

export default MultipleLLMInstructionDrivenChat;