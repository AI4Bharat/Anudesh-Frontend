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
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import headerStyle from "@/styles/Header";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import { useState, useEffect, useRef } from "react";
import CustomizedSnackbars from "@/components/common/Snackbar";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import TextareaAutosize from "@mui/material/TextareaAutosize";
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
  formsAnswered,
  setFormsAnswered, // [ {prompt_output_pair_id: true/false}, {..}, {..}, ...]
  evalFormResponse, // [ {prompt_output_pair_id: corres_form}, {..}, {..}, ... ]
  setEvalFormResponse,
  setIsModelFailing, // true/false
  setSubmittedEvalForms, // [ {prompt_output_pair_id: corres_form}, {..}, {..}, ... ]
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  // console.log("annotation", annotation);
  const [inputValue, setInputValue] = useState("");
  const { taskId } = useParams();
  const [annotationId, setAnnotationId] = useState();
  const bottomRef = useRef(null);
  const [showChatContainer, setShowChatContainer] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadtime, setloadtime] = useState(new Date());
  const [activeModalIndex1, setActiveModalIndex1] = useState(null); // For Model 1 responses
  const [activeModalIndex2, setActiveModalIndex2] = useState(null); // For Model 2 responses
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
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [globalTransliteration, setGlobalTransliteration] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const storedGlobalTransliteration = localStorage.getItem(
        "globalTransliteration",
      );
      const storedLanguage = localStorage.getItem("language");

      if (storedGlobalTransliteration !== null) {
        setGlobalTransliteration(storedGlobalTransliteration === "true");
      }
      if (storedLanguage !== null) {
        setTargetLang(storedLanguage);
      }
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
      annotation?.[0]?.result?.length > 0
    ) {
      const interactions_length =
        annotation?.[0]?.result?.[0]?.model_interactions?.[0]?.interaction_json
          ?.length;

      for (let i = 0; i < interactions_length; i++) {
        const prompt =
          annotation?.[0]?.result?.[0]?.model_interactions?.[0]
            ?.interaction_json[i]?.prompt;

        // Get responses from both models
        const model1_interaction =
          annotation?.[0]?.result?.[0]?.model_interactions?.[0]
            ?.interaction_json?.[i];
        const model2_interaction =
          annotation?.[0]?.result?.[0]?.model_interactions?.[1]
            ?.interaction_json?.[i];

        const response_valid_1 = isString(model1_interaction?.output);
        const response_valid_2 = isString(model2_interaction?.output);
        if (!response_valid_1 || !response_valid_2) {
          setIsModelFailing(true);
        }

        const eval_form = (
          Array.isArray(annotation?.[0]?.result?.[0]?.eval_form)
            ? annotation[0].result[0].eval_form
            : []
        ).find(
          (item) =>
            item.prompt_output_pair_id ===
            model1_interaction?.prompt_output_pair_id,
        )?.model_responses_json;

        eval_form &&
          setEvalFormResponse((prev) => ({
            ...prev,
            [model1_interaction?.prompt_output_pair_id]: eval_form,
          }));

        eval_form &&
          setSubmittedEvalForms((prev) => ({
            ...prev,
            [model1_interaction?.prompt_output_pair_id]: eval_form,
          }));

        setFormsAnswered((prev) => ({
          ...prev,
          [model1_interaction?.prompt_output_pair_id]: eval_form ? true : false,
        }));

        modifiedChatHistory?.push({
          prompt: prompt,
          output: [
            {
              model_name:
                annotation?.[0]?.result?.[0]?.model_interactions?.[0]
                  ?.model_name,
              output: response_valid_1
                ? formatResponse(model1_interaction?.output)
                : formatResponse(
                    `${annotation?.[0]?.result?.[0]?.model_interactions?.[0]?.model_name} failed to generate a response`,
                  ),
              status: response_valid_1 ? "success" : "error",
              prompt_output_pair_id: model1_interaction?.prompt_output_pair_id,
              output_error: response_valid_1
                ? null
                : JSON.stringify(model1_interaction?.output),
            },
            {
              model_name:
                annotation?.[0]?.result?.[0]?.model_interactions?.[1]
                  ?.model_name,
              output: response_valid_2
                ? formatResponse(model2_interaction?.output)
                : formatResponse(
                    `${annotation?.[0]?.result?.[0]?.model_interactions?.[1]?.model_name} failed to generate a response`,
                  ),
              status: response_valid_2 ? "success" : "error",
              prompt_output_pair_id: model2_interaction?.prompt_output_pair_id,
              output_error: response_valid_2
                ? null
                : JSON.stringify(model2_interaction?.output),
            },
          ],
          prompt_output_pair_id: model1_interaction?.prompt_output_pair_id,
        });
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

  const handleOpenViewFullResponse1 = (index) => {
    setActiveModalIndex1(index);
  };

  const handleCloseViewFullResponse1 = () => {
    setActiveModalIndex1(null);
  };

  const handleOpenViewFullResponse2 = (index) => {
    setActiveModalIndex2(index);
  };

  const handleCloseViewFullResponse2 = () => {
    setActiveModalIndex2(null);
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

  const handleButtonClick = async (prompt_output_pair_id, modelResponses) => {
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
            model_responses_json: modelResponses,
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
        } else {
          setSnackbarInfo({
            open: true,
            message: "Saving preferred response failed! Try again later.",
            variant: "error",
          });
        }
      }
      if (!inputValue && prompt_output_pair_id && modelResponses) {
        setFormsAnswered((prev) => ({
          ...prev,
          [prompt_output_pair_id]: false,
        }));
      }
      let modifiedChatHistory = [];
      setChatHistory((prevChatHistory) => {
        data && data.result && setLoading(false);

        // Initialize modifiedChatHistory inside the function
        let modifiedChatHistory = [];

        if (data && data.result && data.result.length > 0) {
          const interactions_length =
            data?.result?.[0]?.model_interactions?.[0]?.interaction_json
              ?.length;

          for (let i = 0; i < interactions_length; i++) {
            const prompt =
              data?.result?.[0]?.model_interactions?.[0]?.interaction_json[i]
                ?.prompt;

            // Get interactions from both models
            const model1_interaction =
              data?.result?.[0]?.model_interactions?.[0]?.interaction_json?.[i];
            const model2_interaction =
              data?.result?.[0]?.model_interactions?.[1]?.interaction_json?.[i];

            const response_valid_1 = isString(model1_interaction?.output);
            const response_valid_2 = isString(model2_interaction?.output);

            if (!response_valid_1 || !response_valid_2) {
              setIsModelFailing(true);
            }

            const eval_form = (
              Array.isArray(data?.result[0]?.eval_form)
                ? data.result[0].eval_form
                : []
            ).find(
              (item) =>
                item.prompt_output_pair_id ===
                model1_interaction?.prompt_output_pair_id,
            )?.model_responses_json;

            eval_form &&
              setEvalFormResponse((prev) => ({
                ...prev,
                [model1_interaction?.prompt_output_pair_id]: eval_form,
              }));

            modifiedChatHistory.push({
              prompt: prompt,
              output: [
                {
                  model_name:
                    data?.result?.[0]?.model_interactions?.[0]?.model_name,
                  output: response_valid_1
                    ? formatResponse(model1_interaction?.output)
                    : `${data?.result?.[0]?.model_interactions?.[0]?.model_name} failed to generate a response`,
                  status: response_valid_1 ? "success" : "error",
                  prompt_output_pair_id:
                    model1_interaction?.prompt_output_pair_id,
                  output_error: response_valid_1
                    ? null
                    : JSON.stringify(model1_interaction?.output),
                },
                {
                  model_name:
                    data?.result?.[0]?.model_interactions?.[1]?.model_name,
                  output: response_valid_2
                    ? formatResponse(model2_interaction?.output)
                    : `${data?.result?.[0]?.model_interactions?.[1]?.model_name} failed to generate a response`,
                  status: response_valid_2 ? "success" : "error",
                  prompt_output_pair_id:
                    model2_interaction?.prompt_output_pair_id,
                  output_error: response_valid_2
                    ? null
                    : JSON.stringify(model2_interaction?.output),
                },
              ],
            });
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

  const handleTextChange = (e, index, message, fieldType) => {
    if (globalTransliteration) {
      var updatedValue = e;
    } else {
      var updatedValue = e.target.value;
    }

    const updatedChatHistory = [...chatHistory];

    const messageIndex = chatHistory.findIndex((msg) => msg === message);

    if (messageIndex !== -1) {
      if (fieldType === "prompt") {
        updatedChatHistory[messageIndex].prompt = updatedValue;
      } else if (fieldType === "output") {
        updatedChatHistory[messageIndex].output[index].value = updatedValue;
      }

      setChatHistory(updatedChatHistory);
    }
  };

  const handleInputChange = (e, message, index, questionIdx, model_idx) => {
    const value = e.target.value;
    const blankIndex = Number(e.target.dataset.blankIndex); // Crucial: Must get from input

    setEvalFormResponse((prev) => {
      // Clone root object
      const newState = { ...prev };

      // Initialize index level
      if (!newState[index]) {
        newState[index] = {
          model_responses_json: [],
        };
      }

      // Find or create model response
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

      // Find or create question response
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

      // Update response array immutably
      const newResponse = [...questionResponses[questionIndex].response];
      newResponse[blankIndex] = value;

      // Rebuild nested structure with Object.assign to maintain references
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

      // Create new root state with spread operator
      const newState = {
        ...prev,
        [index]: {
          ...prev[index],
          model_responses_json: [
            ...(prev[index]?.model_responses_json || []).map((mr) => {
              if (mr.model_name === targetModel) {
                // Update existing model response
                return {
                  ...mr,
                  questions_response: [
                    ...(mr.questions_response || []).map((qr) => {
                      if (qr.question.input_question === targetQuestion) {
                        // Update existing question response
                        return {
                          ...qr,
                          response: [newValue],
                        };
                      }
                      return qr;
                    }),
                    // Create new question response if not found
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
            // Create new model response if not found
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

      // Create new root state
      const newState = {
        ...prev,
        [index]: {
          ...prev[index],
          model_responses_json: [
            ...(prev[index]?.model_responses_json || []).map((mr) => {
              if (mr.model_name === targetModel) {
                // Update model response
                return {
                  ...mr,
                  questions_response: [
                    ...(mr.questions_response || []).map((qr) => {
                      if (qr.question.input_question === targetQuestion) {
                        // Update question response
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
                    // Add new question if not exists
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
            // Add new model if not exists
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

      // Create new root state
      const newState = {
        ...prev,
        [index]: {
          ...prev[index],
          model_responses_json: [
            ...(prev[index]?.model_responses_json || []).map((mr) => {
              if (mr.model_name === targetModel) {
                // Update model response
                return {
                  ...mr,
                  questions_response: [
                    ...(mr.questions_response || []).map((qr) => {
                      if (qr.question.input_question === targetQuestion) {
                        // Update existing question response
                        return {
                          ...qr,
                          response: [option],
                        };
                      }
                      return qr;
                    }),
                    // Add new question if not exists
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
            // Add new model if not exists
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

  // useEffect(() => {

  // })

  // useEffect(() => {
  //   console.log("questions", questions);
  // }, [])

  const validateEvalFormResponse = (form, prompt_output_pair_id) => {
    console.log("form", form, prompt_output_pair_id);
    if (!form?.model_responses_json || form.model_responses_json.length <= 2) {
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

    setFormsAnswered((prev) => ({
      ...prev,
      [prompt_output_pair_id]: allModelsValid ? true : false,
    }));

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
          sx={{ padding: "1.5rem", margin: "auto" }}
        >
          <Grid
            item
            sx={{
              backgroundColor: "rgba(247, 184, 171, 0.2)",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              position: "relative",
              width: "100%",
              marginBottom: "1.5rem",
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
                      onChangeText={(e) =>
                        handleTextChange(e, null, message, "prompt")
                      }
                      lang={targetLang}
                    />
                  ) : (
                    <textarea
                      value={message.prompt}
                      onChange={(e) =>
                        handleTextChange(e, null, message, "prompt")
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
                    children={message?.prompt?.replace(/\n/gi, "&nbsp; \n")}
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
                        delete newResponse[
                          message?.output?.[0]?.prompt_output_pair_id
                        ]; // remove the key by index
                        return newResponse;
                      });

                      setVisibleMessages((prev) => {
                        const keys = Object.keys(prev);
                        delete prev[keys[keys.length - 1]];
                        return { ...prev };
                      });

                      setFormsAnswered((prev) => {
                        const newResponse = { ...prev };
                        delete newResponse[
                          message?.output?.[0]?.prompt_output_pair_id
                        ];
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
              padding: "1.5rem",
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
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  minWidth: `90%`,
                }}
              >
                {/* Output 1 Section */}
                {message?.output?.[0]?.status === "error" ? (
                  <Box
                    sx={{
                      border: "1px solid red",
                      width: "60%",
                      marginLeft: "10px",
                      height: "10vh",
                      padding: "10px",
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
                      {message?.output?.[0]?.model_name} failed to load the
                      response!
                    </Typography>{" "}
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        width: "60%",
                        marginLeft: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        borderRadius: "10px",
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
                          onClick={() => handleOpenViewFullResponse1(index)}
                        >
                          <OpenInFullIcon
                            sx={{
                              padding: "10px 10px 0 0",
                              color: orange[400],
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Modal
                        open={activeModalIndex1 === index}
                        onClose={handleCloseViewFullResponse1}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                          sx: {
                            backdropFilter: "blur(2px)", // Apply blur effect
                            backgroundColor: "rgba(0, 0, 0, 0.2)", // Optional light overlay
                          },
                        }}
                      >
                        <Fade in={activeModalIndex1 === index}>
                          <Box sx={viewFullResponseModalStyle}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
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
                                {message?.output?.[0]?.model_name}
                              </Typography>
                              <IconButton
                                onClick={handleCloseViewFullResponse1}
                              >
                                <CloseIcon sx={{ color: orange[400] }} />
                              </IconButton>
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "1.2rem",
                                maxHeight: "60vh",
                                overflowY: "scroll",
                              }}
                            >
                              {message?.output?.[0]?.output?.map(
                                (segment, index) =>
                                  segment.type === "text" ? (
                                    ProjectDetails?.metadata_json
                                      ?.editable_response ||
                                    segment.value == "" ? (
                                      globalTransliteration ? (
                                        <IndicTransliterate
                                          key={index}
                                          value={segment.value}
                                          onChangeText={(e) =>
                                            handleTextChange(
                                              e,
                                              index,
                                              message,
                                              "output",
                                            )
                                          }
                                          lang={targetLang}
                                          style={{
                                            fontSize: "1rem",
                                            padding: "12px",
                                            borderRadius: "12px 12px 0 12px",
                                            color: grey[900],
                                            background: "#ffffff",
                                            border: `1px solid ${grey[200]}`,
                                            boxShadow: `0px 2px 2px ${grey[50]}`,
                                            minHeight: "5rem",
                                            // resize: "none",
                                            width: "100%",
                                          }}
                                        />
                                      ) : (
                                        <textarea
                                          key={index}
                                          value={segment.value}
                                          onChange={(e) =>
                                            handleTextChange(
                                              e,
                                              index,
                                              message,
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
                                        key={index}
                                        children={segment?.value?.replace(
                                          /\n/gi,
                                          "&nbsp; \n",
                                        )}
                                      />
                                    )
                                  ) : (
                                    <SyntaxHighlighter
                                      key={index}
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
                          padding: "20px 50px",
                        }}
                      >
                        {message?.output?.[0]?.output?.map((segment, index) =>
                          segment.type === "text" ? (
                            ProjectDetails?.metadata_json?.editable_response ||
                            segment.value == "" ? (
                              globalTransliteration ? (
                                <IndicTransliterate
                                  key={index}
                                  value={segment.value}
                                  onChangeText={(e) =>
                                    handleTextChange(
                                      e,
                                      index,
                                      message,
                                      "output",
                                    )
                                  }
                                  lang={targetLang}
                                  style={{
                                    fontSize: "1rem",
                                    padding: "12px",
                                    borderRadius: "12px 12px 0 12px",
                                    color: grey[900],
                                    background: "#ffffff",
                                    border: `1px solid ${grey[200]}`,
                                    boxShadow: `0px 2px 2px ${grey[50]}`,
                                    minHeight: "5rem",
                                    // resize: "none",
                                    width: "100%",
                                  }}
                                />
                              ) : (
                                <textarea
                                  key={index}
                                  value={segment.value}
                                  onChange={(e) =>
                                    handleTextChange(
                                      e,
                                      index,
                                      message,
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
                                key={index}
                                children={segment?.value?.replace(
                                  /\n/gi,
                                  "&nbsp; \n",
                                )}
                              />
                            )
                          ) : (
                            <SyntaxHighlighter
                              key={index}
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
                            padding: "10px",
                            borderRadius: "10px",
                            fontSize: "1rem",
                          }}
                        >
                          {message?.output?.[0]?.model_name}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}

                {/* Output 2 Section */}
                {message?.output?.[1]?.status === "error" ? (
                  <Box
                    sx={{
                      border: "1px solid red",
                      width: "60%",
                      marginLeft: "10px",
                      height: "10vh",
                      padding: "10px",
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
                      {message?.output?.[1]?.model_name} failed to load the
                      response!
                    </Typography>{" "}
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        width: "60%",
                        marginLeft: "2rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        borderRadius: "10px",
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
                          onClick={() => handleOpenViewFullResponse2(index)}
                        >
                          <OpenInFullIcon
                            sx={{
                              padding: "10px 10px 0 0",
                              color: orange[400],
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Modal
                        open={activeModalIndex2 === index}
                        onClose={handleCloseViewFullResponse2}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                          sx: {
                            backdropFilter: "blur(2px)", // Apply blur effect
                            backgroundColor: "rgba(0, 0, 0, 0.2)", // Optional light overlay
                          },
                        }}
                      >
                        <Fade in={activeModalIndex2 === index}>
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
                                {message?.output?.[1]?.model_name}
                              </Typography>
                              <IconButton
                                onClick={handleCloseViewFullResponse2}
                              >
                                <CloseIcon sx={{ color: orange[400] }} />
                              </IconButton>
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "1.2rem",
                                maxHeight: "60vh",
                                overflowY: "scroll",
                              }}
                            >
                              {message?.output?.[1]?.output?.map(
                                (segment, index) =>
                                  segment.type === "text" ? (
                                    ProjectDetails?.metadata_json
                                      ?.editable_response ||
                                    segment.value == "" ? (
                                      globalTransliteration ? (
                                        <IndicTransliterate
                                          key={index}
                                          value={segment.value}
                                          onChangeText={(e) =>
                                            handleTextChange(
                                              e,
                                              index,
                                              message,
                                              "output",
                                            )
                                          }
                                          lang={targetLang}
                                          style={{
                                            fontSize: "1rem",
                                            padding: "12px",
                                            borderRadius: "12px 12px 0 12px",
                                            color: grey[900],
                                            background: "#ffffff",
                                            border: `1px solid ${grey[200]}`,
                                            boxShadow: `0px 2px 2px ${grey[50]}`,
                                            minHeight: "5rem",
                                            // resize: "none",
                                            width: "100%",
                                          }}
                                        />
                                      ) : (
                                        <textarea
                                          key={index}
                                          value={segment.value}
                                          onChange={(e) =>
                                            handleTextChange(
                                              e,
                                              index,
                                              message,
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
                                        key={index}
                                        children={segment?.value?.replace(
                                          /\n/gi,
                                          "&nbsp; \n",
                                        )}
                                      />
                                    )
                                  ) : (
                                    <SyntaxHighlighter
                                      key={index}
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
                          padding: "20px 50px",
                        }}
                      >
                        {message?.output?.[1]?.output?.map((segment, index) =>
                          segment.type === "text" ? (
                            ProjectDetails?.metadata_json?.editable_response ||
                            segment.value == "" ? (
                              globalTransliteration ? (
                                <IndicTransliterate
                                  key={index}
                                  value={segment.value}
                                  onChangeText={(e) =>
                                    handleTextChange(
                                      e,
                                      index,
                                      message,
                                      "output",
                                    )
                                  }
                                  lang={targetLang}
                                  style={{
                                    fontSize: "1rem",
                                    padding: "12px",
                                    borderRadius: "12px 12px 0 12px",
                                    color: grey[900],
                                    background: "#ffffff",
                                    border: `1px solid ${grey[200]}`,
                                    boxShadow: `0px 2px 2px ${grey[50]}`,
                                    minHeight: "5rem",
                                    // resize: "none",
                                    width: "100%",
                                  }}
                                />
                              ) : (
                                <textarea
                                  key={index}
                                  value={segment.value}
                                  onChange={(e) =>
                                    handleTextChange(
                                      e,
                                      index,
                                      message,
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
                                key={index}
                                children={segment?.value?.replace(
                                  /\n/gi,
                                  "&nbsp; \n",
                                )}
                              />
                            )
                          ) : (
                            <SyntaxHighlighter
                              key={index}
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
                            padding: "10px",
                            borderRadius: "10px",
                            fontSize: "1rem",
                          }}
                        >
                          {message?.output?.[1]?.model_name}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>

          {ProjectDetails?.metadata_json?.enable_preference_selection &&
            visibleMessages[index] && (
              <Grid
                item
                sx={{
                  padding: "1.5rem",
                  position: "relative",
                  width: "85%",
                  backgroundColor: "rgba(247, 184, 171, 0.2)",
                  borderRadius: "10px",
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
                      overflowY: "scroll",
                    }}
                  >
                    {ProjectDetails?.metadata_json?.questions_json?.map(
                      (question, questionIdx) => (
                        <div key={questionIdx}>
                          {question.question_type === "fill_in_blanks" && (
                            <div
                              style={{
                                marginBottom: "20px",
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
                                      {response?.model_name}
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
                                marginBottom: "20px",
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

                          {question.question_type ===
                            "multi_select_options" && (
                            <div
                              style={{
                                marginBottom: "20px",
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

                          {question.question_type === "mcq" && (
                            <div
                              style={{
                                marginBottom: "20px",
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
                            // handleButtonClick(
                            //   message?.output?.[0]?.prompt_output_pair_id,
                            //   evalFormResponse?.[
                            //     message?.output?.[0]?.prompt_output_pair_id
                            //   ],
                            // );
                            setSnackbarInfo({
                              open: true,
                              message:
                                "can be submitted for evaluation!",
                              variant: "success",
                            });
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
            )}
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
