"use client";
import "./chat.css";
import { useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import dynamic from "next/dynamic";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import "./editor.css";
import "quill/dist/quill.snow.css";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import "./chat.css";
import Spinner from "@/components/common/Spinner";
import { styled, alpha } from "@mui/material/styles";
import GetTaskDetailsAPI from "@/app/actions/api/Dashboard/getTaskDetails";
import { fetchAnnotationsTask } from "@/Lib/Features/projects/getAnnotationsTask";
import GetNextProjectAPI from "@/app/actions/api/Projects/GetNextProjectAPI";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";
import { setTaskDetails } from "@/Lib/Features/getTaskDetails";
import InstructionDrivenChatPage from "./InstructionDrivenChatPage";
import MultipleLLMInstructionDrivenChat from "../multiple-llm-idcp/MultipleLLMInstructionDrivenChat";
import PatchAnnotationAPI from "@/app/actions/api/Annotate/PatchAnnotationAPI";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import LightTooltip from "@/components/common/Tooltip";
import { ArrowDropDown } from "@material-ui/icons";
import getTaskAssignedUsers from "@/utils/getTaskAssignedUsers";
import ModelInteractionEvaluation from "../model_response_evaluation/model_response_evaluation";
import CustomizedSnackbars from "@/components/common/Snackbar";
import PreferenceRanking from "../n-screen-preference-ranking/PreferenceRanking";

/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react/display-name

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");

    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  },
);

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const modules = {
  toolbar: [
    [{ size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }],
    [{ script: "sub" }, { script: "super" }],
  ],
};

const formats = [
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
];

const SuperCheckerPage = () => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [assignedUsers, setAssignedUsers] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const { projectId, taskId } = useParams();
  const [supercheckertext, setsupercheckertext] = useState("");
  const [currentInteraction, setCurrentInteraction] = useState({});
  const [interactions, setInteractions] = useState([]);
  const [forms, setForms] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [chatHistory, setChatHistory] = useState([{}]);
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const [labellingMode, setLabellingMode] = useState(null);
  let loaded = useRef();
  const userData = useSelector((state) => state.getLoggedInData?.data);
  const [loadtime, setloadtime] = useState(new Date());
  const load_time = useRef();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [disableSkipButton, setdisableSkipButton] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);
  const [NextData, setNextData] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const annotationNotesRef = useRef(null);
  const superCheckerNotesRef = useRef(null);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [disableSkip, setdisableSkip] = useState(false);
  const reviewNotesRef = useRef(null);
  const [disableBtns, setDisableBtns] = useState(false);
  const [disableUpdateButton, setDisableUpdateButton] = useState(false);
  const [taskDataArr, setTaskDataArr] = useState();
  const AnnotationsTaskDetails = useSelector(
    (state) => state.getAnnotationsTask?.data,
  );
  const getNextTask = useSelector((state) => state.getnextProject?.data);
  const taskData = useSelector((state) => state.getTaskDetails?.data);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
  const [annotationtext, setannotationtext] = useState("");
  const [reviewtext, setreviewtext] = useState("");
  const [evalFormResponse, setEvalFormResponse] = useState();
  const [submittedEvalForms, setSubmittedEvalForms] = useState();
  const [isModelFailing, setIsModelFailing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  if (typeof window !== "undefined") {
    window.localStorage.setItem("TaskData", JSON.stringify(taskData));
  }
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mode = localStorage.getItem("labellingMode");
      setLabellingMode(mode);
    }
  }, []);

  useEffect(() => {
    setNotes(taskDataArr, AnnotationsTaskDetails);
  }, [taskDataArr, AnnotationsTaskDetails]);

  useEffect(() => {
    if (taskData) {
      setInfo((prev) => {
        return {
          hint: taskData?.data?.hint,
          examples: taskData?.data?.examples,
          meta_info_intent: taskData?.data?.meta_info_intent,
          instruction_data: taskData?.data?.instruction_data,
          meta_info_domain: taskData?.data?.meta_info_domain,
          meta_info_language: taskData?.data?.meta_info_language,
        };
      });
    }
  }, [taskData]);

  useEffect(() => {
    resetNotes();
  }, [taskId]);

  useEffect(() => {
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskData).then((res) => setAssignedUsers(res));
    };
    taskData?.id && showAssignedUsers();
  }, [taskData]);

  useEffect(() => {
    getAnnotationsTaskData(taskId);
    getProjectDetails();
    getTaskData(taskId);
    return () => {
      setAnnotations([]);
      setForms([]);
    };
  }, [taskId]);

  useEffect(() => {
    filterAnnotations(AnnotationsTaskDetails, userData);
  }, [AnnotationsTaskDetails, userData]);

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
    }
  }, [AnnotationsTaskDetails]);

  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };

  const setNotes = (taskData, annotations) => {
    if (
      typeof window !== "undefined" &&
      superCheckerNotesRef.current &&
      reviewNotesRef.current
    ) {
      if (annotations && annotations.length > 0) {
        let userAnnotation = annotations.find(
          (annotation) =>
            annotation?.completed_by === userData?.id &&
            annotation?.annotation_type === 3,
        );
        if (userAnnotation) {
          let reviewAnnotation = annotations.find(
            (annotation) => annotation.id === userAnnotation?.parent_annotation,
          );
          reviewNotesRef.current.value = reviewAnnotation?.review_notes ?? "";
          superCheckerNotesRef.current.value =
            userAnnotation?.supercheck_notes ?? "";

          try {
            const newDelta1 =
              reviewNotesRef.current.value != ""
                ? JSON.parse(reviewNotesRef.current.value)
                : "";
            reviewNotesRef.current.getEditor().setContents(newDelta1);
          } catch (err) {
            if (err) {
              const newDelta1 = reviewNotesRef.current.value;
              reviewNotesRef.current.getEditor().setText(newDelta1);
            }
          }
          try {
            const newDelta3 =
              superCheckerNotesRef.current.value != ""
                ? JSON.parse(superCheckerNotesRef.current.value)
                : "";
            superCheckerNotesRef.current.getEditor().setContents(newDelta3);
          } catch (err) {
            if (err) {
              const newDelta3 = superCheckerNotesRef.current.value;
              superCheckerNotesRef.current.getEditor().setText(newDelta3);
            }
          }

          setreviewtext(reviewNotesRef.current.getEditor().getText());
          setsupercheckertext(
            superCheckerNotesRef.current.getEditor().getText(),
          );
        } else {
          let reviewerAnnotations = annotations.filter(
            (value) => value?.annotation_type === 2,
          );
          if (reviewerAnnotations.length > 0) {
            let correctAnnotation = reviewerAnnotations.find(
              (annotation) => annotation.id === taskData?.correct_annotation,
            );

            if (correctAnnotation) {
              let superCheckerAnnotation = annotations.find(
                (annotation) =>
                  annotation.parent_annotation === correctAnnotation.id,
              );
              reviewNotesRef.current.value =
                correctAnnotation.review_notes ?? "";
              superCheckerNotesRef.current.value =
                superCheckerAnnotation.supercheck_notes ?? "";

              try {
                const newDelta1 =
                  reviewNotesRef.current.value != ""
                    ? JSON.parse(reviewNotesRef.current.value)
                    : "";
                reviewNotesRef.current.getEditor().setContents(newDelta1);
              } catch (err) {
                if (err) {
                  const newDelta1 = reviewNotesRef.current.value;
                  reviewNotesRef.current.getEditor().setText(newDelta1);
                }
              }
              try {
                const newDelta3 =
                  superCheckerNotesRef.current.value != ""
                    ? JSON.parse(superCheckerNotesRef.current.value)
                    : "";
                superCheckerNotesRef.current.getEditor().setContents(newDelta3);
              } catch (err) {
                if (err) {
                  const newDelta3 = superCheckerNotesRef.current.value;
                  superCheckerNotesRef.current.getEditor().setText(newDelta3);
                }
              }

              setreviewtext(reviewNotesRef.current.getEditor().getText());
              setsupercheckertext(
                superCheckerNotesRef.current.getEditor().getText(),
              );
            } else {
              let superCheckerAnnotation = annotations.find(
                (annotation) =>
                  annotation.parent_annotation === reviewerAnnotations[0]?.id,
              );
              reviewNotesRef.current.value =
                reviewerAnnotations[0]?.review_notes ?? "";
              if (superCheckerAnnotation) {
                superCheckerNotesRef.current.value =
                  superCheckerAnnotation[0]?.supercheck_notes ?? "";
              }

              try {
                const newDelta1 =
                  reviewNotesRef.current.value != ""
                    ? JSON.parse(reviewNotesRef.current.value)
                    : "";
                reviewNotesRef.current.getEditor().setContents(newDelta1);
              } catch (err) {
                if (err) {
                  const newDelta1 = reviewNotesRef.current.value;
                  reviewNotesRef.current.getEditor().setText(newDelta1);
                }
              }
              try {
                const newDelta3 =
                  superCheckerNotesRef.current.value != ""
                    ? JSON.parse(superCheckerNotesRef.current.value)
                    : "";
                superCheckerNotesRef.current.getEditor().setContents(newDelta3);
              } catch (err) {
                if (err) {
                  const newDelta3 = superCheckerNotesRef.current.value;
                  superCheckerNotesRef.current.getEditor().setText(newDelta3);
                }
              }

              setreviewtext(reviewNotesRef.current.getEditor().getText());
              setsupercheckertext(
                superCheckerNotesRef.current.getEditor().getText(),
              );
            }
          }
        }
      }
    }
  };

  const formatResponse = (response) => {
    if (!response) {
      return [
        {
          type: "text",
          value: "",
        },
      ];
    }

    response = String(response);
    const output = [];
    let count = 0;

    while (response) {
      response = response.trim();
      let index = response.indexOf("```");
      if (index == -1) {
        output.push({
          type: "text",
          value: response,
        });
        break;
      } else {
        count++;
        if (count % 2 !== 0) {
          output.push({
            type: "text",
            value: response.substring(0, index),
          });
          response = response.slice(index + 3);
        } else if (count % 2 === 0) {
          let next_space = response.indexOf("\n");
          let language = response.substring(0, next_space);
          response = response.slice(next_space + 1);
          let new_index = response.indexOf("```");
          let value = response.substring(0, new_index);
          output.push({
            type: "code",
            value: value,
            language: language,
          });
          response = response.slice(new_index + 3);
        }
      }
    }
    return output;
  };

  const reverseFormatResponse = (formattedOutput) => {
    let response = "";

    formattedOutput.forEach((item) => {
      if (item.type === "text") {
        response += item.value;
      } else if (item.type === "code") {
        response += "```" + item.language + "\n" + item.value + "\n```";
      }
    });

    return response;
  };

  const formatPrompt = (prompt) => {
    const lines = prompt.split("\n");
    const markdownString = lines.join("  \n");
    return markdownString;
  };

  const resetNotes = () => {
    if (
      typeof window !== "undefined" &&
      annotationNotesRef.current &&
      reviewNotesRef.current
    ) {
      setShowNotes(false);
      annotationNotesRef.current.getEditor().setContents([]);
      reviewNotesRef.current.getEditor().setContents([]);
    }
  };

  const onNextAnnotation = async (value) => {
    setLoading(true);
    const nextAPIData = {
      id: projectId,
      current_task_id: taskId,
      mode: "supercheck",
      annotation_status: labellingMode,
    };

    let apiObj = new GetNextProjectAPI(projectId, nextAPIData);
    var rsp_data = [];
    fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        rsp_data = await response.json();
        setLoading(false);
        if (response.ok) {
          setNextData(rsp_data);
          tasksComplete(rsp_data?.id || null);
          getAnnotationsTaskData(rsp_data.id);
          getTaskData(rsp_data.id);
        }
      })
      .catch((error) => {
        setSnackbarInfo({
          open: true,
          message: "No more tasks to label",
          variant: "info",
        });
        setTimeout(() => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("labelAll");
          }

          window.location.replace(`/#/projects/${projectId}`);
        }, 1000);
      });
  };

  let SuperChecker = AnnotationsTaskDetails.filter(
    (annotation) => annotation.annotation_type === 3,
  )[0];

  const tasksComplete = (id) => {
    // if (typeof window !== "undefined") {
    if (id) {
      resetNotes();
      // navigate(`/projects/${projectId}/task/${id}`, {replace: true});
      navigate(`/projects/${projectId}/SuperChecker/${id}`);
    } else {
      // navigate(-1);
      resetNotes();
      setSnackbarInfo({
        open: true,
        message: "No more tasks to label",
        variant: "info",
      });
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("labelAll");
        }

        window.location.replace(`/#/projects/${projectId}`);
        window.location.reload();
      }, 1000);
    }
    // }
  };

  function isString(value) {
    return typeof value === "string" || value instanceof String;
  }

  const areAllFormsAnswered = () => {
    return Object.keys(submittedEvalForms).length === chatHistory.length;
  };

  const buildResult = (value, type, resultValue) => {
    let result = resultValue;
    if (value === "delete") {
      result = []
    }
    else if (
      value === "delete-pair" &&
      type === "MultipleLLMInstructionDrivenChat"
    ) {
      result = {
        eval_form: resultValue[0].eval_form, // Keep as is
        model_interactions: resultValue[0].model_interactions.map((model) => ({
          model_name: model.model_name,
          interaction_json: model.interaction_json.slice(0, -1),
        })),
      };
    }
    else if (
      value === "delete-pair" 
    ) {
      result  = resultValue.slice(0, resultValue.length - 1)
    }
    else {
      resultValue
    }   
    return !Array.isArray(result) ? [result] : result;
  };

  const handleSuperCheckerClick = async (
    value,
    id,
    lead_time,
    type,
    parentannotation,
    reviewNotesValue,
  ) => {
    if (value === "delete") {
      setEvalFormResponse();
      setSubmittedEvalForms();
    }
    if (
      value === "labeled" &&
      type === "MultipleLLMInstructionDrivenChat" &&
      !areAllFormsAnswered()
    ) {
      setSnackbarInfo({
        open: true,
        message:
          "Please ensure that all the evaluation forms are saved for each interaction before submitting the task!",
        variant: "warning",
        severity: "warning",
      });
      return;
    }
    let resultValue;
    if (ProjectDetails.project_type === "InstructionDrivenChat") {
      resultValue = chatHistory.map((chat) => ({
        prompt: chat.prompt,
        output: reverseFormatResponse(chat.output),
      }));
    } else if (ProjectDetails.project_type == "MultipleInteractionEvaluation") {
      resultValue = forms.map((form) => ({
        prompt: form.prompt,
        model_responses_json: form.model_responses_json.map((response) => ({
          model_name: response.model_name,
          output: response.output,
          questions_response: response.questions_response,
        })),
        prompt_output_pair_id: form.prompt_output_pair_id,
        additional_note: form.additional_note,
      }));
    } else if (ProjectDetails.project_type === "ModelInteractionEvaluation") {
      resultValue = forms.map((form) => ({
        prompt: form.prompt,
        output: form.output,
        additional_note: form.additional_note,
        rating: form.rating,
        questions_response: form.questions_response,
        prompt_output_pair_id: form.prompt_output_pair_id,
      }));
    } else if (
      ProjectDetails.project_type == "MultipleLLMInstructionDrivenChat"
    ) {
      const modelMap = {};
      chatHistory.forEach((entry) => {
        entry.output.forEach((modelResp) => {
          const model = modelResp.model_name;
          const has_invalid_resp = modelResp.output_error;
          if (!modelMap[model]) {
            modelMap[model] = [];
          }
          const interaction = {
            prompt: entry.prompt,
            output: has_invalid_resp
              ? JSON.parse(modelResp.output_error)
              : reverseFormatResponse(modelResp.output),
            prompt_output_pair_id: modelResp.prompt_output_pair_id,
          };
          modelMap[model].push(interaction);
        });
      });

      const model_interactions = Object.entries(modelMap).map(
        ([model_name, interaction_json]) => {
          return {
            model_name,
            interaction_json,
          };
        },
      );

      resultValue = [
        {
          eval_form: Object.values(submittedEvalForms),
          model_interactions: model_interactions,
        },
      ];
    }

    setLoading(true);
    setAutoSave(false);
    const PatchAPIdata = {
      annotation_status:
        typeof window !== "undefined" &&
        (value === "delete" || value === "delete-pair")
          ? localStorage.getItem("labellingMode")
          : value,
      supercheck_notes:
        typeof window !== "undefined"
          ? JSON.stringify(
              superCheckerNotesRef?.current?.getEditor().getContents(),
            )
          : null,
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
      ...((value === "rejected" ||
        value === "validated" ||
        value === "validated_with_changes") && {
        parent_annotation: parentannotation,
      }),
      result: buildResult(value, type, resultValue),
      task_id: taskId,
      auto_save:
        value === "delete" || value === "delete-pair" || value === "rejected"
          ? true
          : false,
      interaction_llm: value === "delete" || value === "delete-pair",
      clear_conversation: value === "delete",
    };

    if (
      ["draft", "skipped", "rejected", "delete", "delete-pair"].includes(
        value,
      ) ||
      ["validated", "validated_with_changes"].includes(value)
    ) {
      if (
        ![
          "draft",
          "skipped",
          "delete",
          "delete-pair",
          "to_be_revised",
        ].includes(value)
      ) {
        if (
          (ProjectDetails.project_type == "ModelInteractionEvaluation" ||
            ProjectDetails.project_type == "MultipleInteractionEvaluation") &&
          !answered
        ) {
          setAutoSave(true);
          setSnackbarInfo({
            open: true,
            message: "Answer all the mandatory questions in all forms",
            variant: "error",
          });
          setLoading(false);
          setShowNotes(false);
          return;
        } else if (chatHistory.length == 0) {
          setAutoSave(true);
          setSnackbarInfo({
            open: true,
            message: "Please Enter Prompt",
            variant: "error",
          });
          setLoading(false);
          setShowNotes(false);
          return;
        }
      }
      if (value === "rejected") PatchAPIdata["result"] = [];
      const TaskObj = new PatchAnnotationAPI(id, PatchAPIdata);
      const res = await fetch(TaskObj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(TaskObj.getBody()),
        headers: TaskObj.getHeaders().headers,
      });
      const resp = await res.json();
      if (
        (value === "delete" || value === "delete-pair") === true &&
        res.ok &&
        resp.result
      ) {
        if (type === "MultipleLLMInstructionDrivenChat") {
          const allModelsInteractions = resp?.result?.[0]?.model_interactions;
          if (allModelsInteractions && Array.isArray(allModelsInteractions) && allModelsInteractions.length > 0) {
            const interactions_length = allModelsInteractions[0]?.interaction_json?.length || 0;
            let modifiedChatHistory = [];
            let globalModelFailure = false;

            for (let i = 0; i < interactions_length; i++) {
              const prompt = allModelsInteractions[0]?.interaction_json[i]?.prompt;
              const modelOutputs = [];
              let turnPromptOutputPairId = null;
              let turnHasModelFailure = false;

              allModelsInteractions.forEach((modelData, modelIdx) => {
                const interaction = modelData?.interaction_json?.[i];
                if (interaction) {
                  const response_valid = isString(interaction?.output);
                  if (!response_valid) {
                    turnHasModelFailure = true;
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

              if (turnHasModelFailure) {
                globalModelFailure = true;
              }

              if (turnPromptOutputPairId) {
                const eval_form = (
                  Array.isArray(resp?.result?.[0]?.eval_form)
                    ? resp.result[0].eval_form
                    : []
                ).find(
                  (item) => item.prompt_output_pair_id === turnPromptOutputPairId,
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
                modifiedChatHistory.push({
                  prompt: prompt,
                  output: modelOutputs,
                  prompt_output_pair_id: turnPromptOutputPairId,
                });
              }
            }
            if (globalModelFailure) {
              setIsModelFailing(true);
            }
            setChatHistory([...modifiedChatHistory]);
          } else {
            setChatHistory([]);
            setIsModelFailing(false); 
          }
        }else {
          let modifiedChatHistory = resp?.result.map((interaction) => {
            return {
              ...interaction,
              output: formatResponse(interaction.output),
            };
          });
          setChatHistory([...modifiedChatHistory]);
        }
      }
      if (res.ok) {
        if ((value === "delete" || value === "delete-pair") === false) {
          if (typeof window !== "undefined") {
            if (localStorage.getItem("labelAll") || value === "skipped") {
              onNextAnnotation(resp.task);
            }
          }
        }
        value === "delete"
          ? setSnackbarInfo({
              open: true,
              message: "Chat history has been cleared successfully!",
              variant: "success",
            })
          : value === "delete-pair"
            ? setSnackbarInfo({
                open: true,
                message: "Selected conversation is deleted",
                variant: "success",
              })
            : setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "success",
              });
      } else {
        setAutoSave(true);
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
      setLoading(false);
    } else {
      setAutoSave(true);

      setSnackbarInfo({
        open: true,
        message: "Error in saving annotation",
        variant: "error",
      });
    }
    setLoading(false);
    setShowNotes(false);
    setAnchorEl(null);
  };

  const getAnnotationsTaskData = (id) => {
    setLoading(true);
    dispatch(fetchAnnotationsTask(id));
  };

  const filterAnnotations = (annotations, user) => {
    setLoading(true);
    let disableSkip = false;
    let disableAutoSave = false;
    let filteredAnnotations = annotations;
    let userAnnotation = annotations.find((annotation) => {
      return (
        annotation.completed_by === user.id && annotation.parent_annotation
      );
    });
    if (userAnnotation) {
      if (userAnnotation.annotation_status === "unvalidated") {
        filteredAnnotations =
          userAnnotation.result.length > 0
            ? [userAnnotation]
            : annotations.filter(
                (annotation) =>
                  annotation.id === userAnnotation.parent_annotation &&
                  annotation.annotation_type === 2,
              );
      } else if (
        ["validated", "validated_with_changes", "draft"].includes(
          userAnnotation.annotation_status,
        )
      ) {
        filteredAnnotations = [userAnnotation];
      } else if (
        userAnnotation.annotation_status === "skipped" ||
        userAnnotation.annotation_status === "rejected"
      ) {
        filteredAnnotations = annotations.filter(
          (value) => value.annotation_type === 2,
        );
        if (filteredAnnotations[0].annotation_status === "rejected")
          setAutoSave(false);
      }
    } else if ([4, 5, 6].includes(user.role)) {
      filteredAnnotations = annotations.filter((a) => a.annotation_type === 3);
      disableSkip = true;
    }
    setAnnotations(filteredAnnotations);
    setdisableSkip(disableSkip);
    setLoading(false);
    return [filteredAnnotations, disableSkip, disableAutoSave];
  };

  const getTaskData = async (id) => {
    setLoading(true);
    const ProjectObj = new GetTaskDetailsAPI(id);
    const res = await fetch(ProjectObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(ProjectObj.getBody()),
      headers: ProjectObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (!res.ok) {
      setLoading(true);
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    } else {
      dispatch(setTaskDetails(resp));
      setTaskDataArr(resp);
    }
    setLoading(false);
  };

  const getProjectDetails = () => {
    dispatch(fetchProjectDetails(projectId));
  };

  const handleClick = (event) => {
    if (ProjectDetails?.project_type ===
      "MultipleLLMInstructionDrivenChat" && (isModelFailing || !areAllFormsAnswered())) {
      if (isModelFailing) {
        setSnackbarInfo({
          open: true,
          message:
            "Either of the models appear to be failing! Please submit the task as 'Draft' or 'Skipped'. You can come back later to update the task.",
          variant: "warning",
          severity: "warning",
        });
      }
      if (!areAllFormsAnswered()) {
        setSnackbarInfo({
          open: true,
          message:
            "Please ensure that all the evaluation forms are saved for each interaction before submitting the task!",
          variant: "warning",
          severity: "warning",
        });
      }
      return;
    }
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let componentToRender;
  switch (ProjectDetails.project_type) {
    case "InstructionDrivenChat":
      componentToRender = (
        <InstructionDrivenChatPage
          key={`annotations-${annotations?.length}-${
            annotations?.[0]?.id || "default"
          }`}
          handleClick={handleSuperCheckerClick}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          formatResponse={formatResponse}
          formatPrompt={formatPrompt}
          id={SuperChecker}
          stage={"SuperChecker"}
          notes={superCheckerNotesRef}
          info={info}
          disableUpdateButton={disableUpdateButton}
          annotation={annotations}
          setLoading={setLoading}
          loading={loading}
        />
      );
      break;
    case "MultipleLLMInstructionDrivenChat":
      componentToRender = (
        <MultipleLLMInstructionDrivenChat
          key={`annotations-${annotations?.length}-${
            annotations?.[0]?.id || "default"
          }`}
          handleClick={handleSuperCheckerClick}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          formatResponse={formatResponse}
          formatPrompt={formatPrompt}
          id={SuperChecker}
          stage={"SuperChecker"}
          notes={superCheckerNotesRef}
          info={info}
          disableUpdateButton={disableUpdateButton}
          annotation={annotations}
          setLoading={setLoading}
          loading={loading}
          evalFormResponse={evalFormResponse}
          setEvalFormResponse={setEvalFormResponse}
          setIsModelFailing={setIsModelFailing}
          submittedEvalForms={submittedEvalForms}
          setSubmittedEvalForms={setSubmittedEvalForms}
        />
      );
      break;
    case "ModelInteractionEvaluation":
      componentToRender = (
        <ModelInteractionEvaluation
          key={`annotations-${annotations?.length}-${
            annotations?.[0]?.id || "default"
          }`}
          setCurrentInteraction={setCurrentInteraction}
          currentInteraction={currentInteraction}
          interactions={interactions}
          setInteractions={setInteractions}
          forms={forms}
          setForms={setForms}
          stage={"SuperChecker"}
          answered={answered}
          setAnswered={setAnswered}
          annotation={annotations}
          setLoading={setLoading}
          loading={loading}
        />
      );
      break;
    case "MultipleInteractionEvaluation":
      componentToRender = (
        <PreferenceRanking
          key={`annotations-${annotations?.length}-${
            annotations?.[0]?.id || "default"
          }`}
          setCurrentInteraction={setCurrentInteraction}
          currentInteraction={currentInteraction}
          interactions={interactions}
          setInteractions={setInteractions}
          forms={forms}
          setForms={setForms}
          stage={"SuperChecker"}
          notes={superCheckerNotesRef}
          answered={answered}
          setAnswered={setAnswered}
          annotation={annotations}
          setLoading={setLoading}
          loading={loading}
        />
      );
      break;
    default:
      componentToRender = null;
      break;
  }
  let ProjectsData = null;

  if (typeof window !== "undefined") {
    ProjectsData = localStorage.getItem("projectData");
  }

  const ProjectData = ProjectsData ? JSON.parse(ProjectsData) : null;

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
        severity={snackbar.severity}
      />
    );
  };
return (
  <>
    {loading && <Spinner />}
    <Grid container>
      {renderSnackBar()}
      
      {/* Main Button Row - All buttons in one line */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, flexWrap: 'wrap' }}>
          {/* Back to Project Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            variant="contained"
            color="primary"
            size="small"
            sx={{ 
              minWidth: 'auto',
              fontSize: '0.75rem',
              px: 1.5,
              py: 0.5
            }}
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("labelAll");
              }
              navigate(`/projects/${projectId}`);
            }}
          >
            Back
          </Button>

          {/* Notes Button */}
          <Button
            endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDown />}
            variant="contained"
            color={reviewtext.trim().length === 0 ? "primary" : "success"}
            size="small"
            onClick={handleCollapseClick}
            sx={{ 
              minWidth: 'auto',
              fontSize: '0.75rem',
              px: 1.5,
              py: 0.5,
              backgroundColor: reviewtext.trim().length === 0 ? "#bf360c" : "green",
            }}
          >
            Notes {reviewtext.trim().length === 0 ? "" : "*"}
          </Button>

          {/* Info Button */}
          <LightTooltip
            title={
              <div>
                <div>
                  {ProjectDetails?.conceal == false &&
                  Array.isArray(assignedUsers)
                    ? assignedUsers.join(", ")
                    : assignedUsers || "No assigned users"}
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {annotations[0]?.annotation_type == 1 &&
                    `ANNOTATION ID: ${annotations[0]?.id}`}
                  {annotations[0]?.annotation_type == 2 &&
                    `REVIEW ID: ${annotations[0]?.id}`}
                  {annotations[0]?.annotation_type == 3 &&
                    `SUPERCHECK ID: ${annotations[0]?.id}`}
                </div>
              </div>
            }
          >
            <Button
              size="small"
              sx={{
                // px: { xs: 2, sm: 3, md: 4 },
                // py: { xs: 1, sm: 1.5, md: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                minWidth: { xs: "70px", sm: "70px", md: "100px" },
              }}
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("labelAll");
                }
                navigate(`/projects/${projectId}`,  { replace : true, state: { fromBackToProject: true } });
                //window.location.replace(`/#/projects/${projectId}`);
                //window.location.reload();
              }}
            >
              <InfoOutlined sx={{ fontSize: '18px' }} />
            </Button>
          </LightTooltip>

          {/* Draft Button */}
          {taskData?.super_check_user === userData?.id && (
            <Tooltip title="Save task for later">
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  handleSuperCheckerClick(
                    "draft",
                    SuperChecker.id,
                    SuperChecker.lead_time,
                  )
                }
                sx={{
                  minWidth: 'auto',
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  color: "black",
                  border: "0px",
                  backgroundColor: "#ffe0b2",
                }}
              >
                Draft
              </Button>
            </Tooltip>
          )}

          {/* Next Button */}
          <Tooltip title="Go to next task">
            <Button
              variant="outlined"
              size="small"
              onClick={() => onNextAnnotation("next", getNextTask?.id)}
              sx={{
                minWidth: 'auto',
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                color: "black",
                border: "0px",
                backgroundColor: "#ffe0b2",
              }}
            >
              Next
            </Button>
          </Tooltip>

          {/* Skip Button */}
          {!disableSkip && taskData?.super_check_user === userData?.id && (
            <Tooltip title="skip to next task">
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  handleSuperCheckerClick(
                    "skipped",
                    SuperChecker.id,
                    SuperChecker.lead_time,
                  )
                }
                sx={{
                  minWidth: 'auto',
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  color: "black",
                  border: "0px",
                  backgroundColor: "#ffe0b2",
                }}
              >
                Skip
              </Button>
            </Tooltip>
          )}

          {/* Clear Chats Button */}
          {!disableSkip && taskData?.super_check_user === userData?.id && (
            <Tooltip title="clear the entire chat history">
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  handleSuperCheckerClick(
                    "delete",
                    SuperChecker.id,
                    SuperChecker.lead_time,
                  )
                }
                sx={{
                  minWidth: 'auto',
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  color: "black",
                  border: "0px",
                  backgroundColor: "#ffe0b2",
                }}
              >
                Clear Chats
              </Button>
            </Tooltip>
          )}

          {/* Reject Button */}
          {taskData?.super_check_user === userData?.id && (
            <Tooltip title="Reject">
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  handleSuperCheckerClick(
                    "rejected",
                    SuperChecker.id,
                    SuperChecker.lead_time,
                    "",
                    SuperChecker.parent_annotation,
                  )
                }
                disabled={
                  ProjectData.revision_loop_count >
                  taskData?.revision_loop_count?.super_check_count
                    ? false
                    : true
                }
                sx={{
                  minWidth: 'auto',
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  color: "black",
                  border: "0px",
                  backgroundColor: "#ee6633",
                }}
              >
                Reject
              </Button>
            </Tooltip>
          )}

          {/* Validate Button with Menu */}
          {taskData?.super_check_user === userData?.id && (
            <Tooltip title="Validate">
              <Button
                variant="outlined"
                size="small"
                id="accept-button"
                aria-controls={open ? "accept-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                sx={{
                  minWidth: 'auto',
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  color: "black",
                  border: "0px",
                  backgroundColor: "#ee6633",
                }}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Validate
              </Button>
            </Tooltip>
          )}
          <StyledMenu
            id="accept-menu"
            MenuListProps={{
              "aria-labelledby": "accept-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() =>
                handleSuperCheckerClick(
                  "validated",
                  SuperChecker.id,
                  SuperChecker.lead_time,
                  "",
                  SuperChecker.parent_annotation,
                )
              }
              disableRipple
            >
              Validated No Changes
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleSuperCheckerClick(
                  "validated_with_changes",
                  SuperChecker.id,
                  SuperChecker.lead_time,
                  "",
                  SuperChecker.parent_annotation,
                )
              }
              disableRipple
            >
              Validated with Changes
            </MenuItem>
          </StyledMenu>
        </Box>
      </Grid>

      {/* Notes Section */}
      <div
        style={{
          display: showNotes ? "block" : "none",
          padding: "0 8px 8px 8px",
          width: "100%"
        }}
      >
        <ReactQuill
          forwardedRef={reviewNotesRef}
          modules={modules}
          formats={formats}
          bounds={"#note"}
          placeholder="Review Notes"
          style={{ marginBottom: "1%", minHeight: "2rem" }}
          readOnly={true}
        ></ReactQuill>
        <ReactQuill
          forwardedRef={superCheckerNotesRef}
          modules={modules}
          formats={formats}
          bounds={"#note"}
          placeholder="Superchecker Notes"
        ></ReactQuill>
      </div>

      {/* Revision Loop Count Messages */}
      {ProjectDetails.revision_loop_count >
      taskData?.revision_loop_count?.super_check_count
        ? false
        : true && (
            <div
              style={{
                textAlign: "left",
                marginBottom: "5px",
                marginLeft: "8px",
                marginTop: "5px",
              }}
            >
              <Typography
                variant="body"
                color="#f5222d"
                sx={{
                  fontSize: {
                    xs: "14px",
                    md: "16px",
                    lg: "18px",
                    xl: "20px",
                  },
                }}
              >
                Note: The 'Revision Loop Count' limit has been reached for
                this task.
              </Typography>
            </div>
          )}

      {ProjectDetails.revision_loop_count -
        taskData?.revision_loop_count?.super_check_count !==
        0 && (
        <div
          style={{
            textAlign: "left",
            marginLeft: "8px",
            marginTop: "8px",
          }}
        >
          <Typography
            variant="body"
            color="#f5222d"
            sx={{
              fontSize: {
                xs: "14px",
                md: "16px",
                lg: "18px",
                xl: "20px",
              },
            }}
          >
            Note: This task can be rejected{" "}
            {ProjectDetails.revision_loop_count -
              taskData?.revision_loop_count?.super_check_count}{" "}
            more times.
          </Typography>
        </div>
      )}

      {filterMessage && (
        <Alert severity="info" sx={{ mx: 1, mb: 1, fontSize: "0.75rem" }}>
          {filterMessage}
        </Alert>
      )}
      
      <Grid item container>
        {componentToRender}
      </Grid>
    </Grid>
  </>
);
};

export default SuperCheckerPage;
