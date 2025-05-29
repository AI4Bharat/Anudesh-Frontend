"use client";
import "./chat.css";
import { useState, useRef, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dynamic from "next/dynamic";
import "./chat.css";
import "./editor.css";
import "quill/dist/quill.snow.css";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Spinner from "@/components/common/Spinner";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LightTooltip from "@/components/common/Tooltip";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { setTaskDetails } from "@/Lib/Features/getTaskDetails";
import getTaskAssignedUsers from "@/utils/getTaskAssignedUsers";
import InstructionDrivenChatPage from "./InstructionDrivenChatPage";
import GetTaskDetailsAPI from "@/app/actions/api/Dashboard/getTaskDetails";
import GetNextProjectAPI from "@/app/actions/api/Projects/GetNextProjectAPI";
import PatchAnnotationAPI from "@/app/actions/api/Annotate/PatchAnnotationAPI";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";
import CustomizedSnackbars from "@/components/common/Snackbar";
import { fetchAnnotationsTask } from "@/Lib/Features/projects/getAnnotationsTask";
import ModelInteractionEvaluation from "../model_response_evaluation/model_response_evaluation";
import MultipleLLMInstructionDrivenChat from "../multiple-llm-idcp/MultipleLLMInstructionDrivenChat";
import PreferenceRanking from "../n-screen-preference-ranking/PreferenceRanking";

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

const AnnotatePage = () => {
  // eslint-disable-next-line react/display-name

  /* eslint-disable react-hooks/exhaustive-deps */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // let taskData = localStorage.getItem("TaskData");
  const [assignedUsers, setAssignedUsers] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const { projectId, taskId } = useParams();
  const [chatHistory, setChatHistory] = useState([{}]);
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const [labelConfig, setLabelConfig] = useState();
  const [info, setInfo] = useState({});
  const [labellingMode, setLabellingMode] = useState(null);
  let loaded = useRef();
  const userData = useSelector((state) => state.getLoggedInData?.data);
  const [loadtime, setloadtime] = useState(new Date());
  const questions =
    useSelector((state) => state.getProjectDetails.data.metadata_json) ?? [];

  const load_time = useRef();

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
    severity: "",
  });
  const [disableSkipButton, setdisableSkipButton] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);
  const [NextData, setNextData] = useState("");
  const [currentInteraction, setCurrentInteraction] = useState({});
  const [interactions, setInteractions] = useState([]);
  const [forms, setForms] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [annotations, setAnnotations] = useState([]);

  const annotationNotesRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const reviewNotesRef = useRef(false);
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
  const [formsAnswered, setFormsAnswered] = useState({});
  const [evalFormResponse, setEvalFormResponse] = useState({});
  const [isModelFailing, setIsModelFailing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mode = localStorage.getItem("labellingMode");
      setLabellingMode(mode);
    }
  }, []);

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
    if (
      typeof window !== "undefined" &&
      annotationNotesRef.current &&
      reviewNotesRef.current
    ) {
      if (
        AnnotationsTaskDetails &&
        AnnotationsTaskDetails.length > 0 &&
        reviewNotesRef.current &&
        reviewNotesRef.current.getEditor &&
        reviewNotesRef.current.getEditor() &&
        annotationNotesRef.current &&
        annotationNotesRef.current.getEditor &&
        annotationNotesRef.current.getEditor()
      ) {
        annotationNotesRef.current.value =
          AnnotationsTaskDetails[0].annotation_notes ?? "";
        reviewNotesRef.current.value =
          AnnotationsTaskDetails[0].review_notes ?? "";
        try {
          const newDelta2 =
            annotationNotesRef.current.value !== ""
              ? JSON.parse(annotationNotesRef.current.value)
              : "";
          annotationNotesRef.current.getEditor().setContents(newDelta2);
        } catch (err) {
          if (err) {
            const newDelta2 = annotationNotesRef.current.value;
            annotationNotesRef.current.getEditor().setText(newDelta2);
          }
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
        setannotationtext(annotationNotesRef.current.getEditor().getText());
        setreviewtext(reviewNotesRef.current.getEditor().getText());
      }
    }
  }, [AnnotationsTaskDetails]);

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
    if (AnnotationsTaskDetails?.length > 0) {
      filterAnnotations(AnnotationsTaskDetails, userData);
    }
  }, [AnnotationsTaskDetails, userData]);

  useEffect(() => {
    getAnnotationsTaskData(taskId);
    getProjectDetails();
    getTaskData(taskId);
    return () => {
      setAnnotations([]);
      setForms([]);
      setFilteredReady(false);
    };
  }, [taskId]);

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
    }
  }, [AnnotationsTaskDetails]);

  useEffect(() => {
    const observer = new MutationObserver((mutations, obs) => {
      const element = topref.current;
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        obs.disconnect(); // Stop observing after scroll
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };

  const handleGlossaryClick = () => {
    setShowGlossary(!showGlossary);
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
        output?.push({
          type: "text",
          value: response,
        });
        break;
      } else {
        count++;
        if (count % 2 !== 0) {
          output?.push({
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
          output?.push({
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
    const lines = prompt?.split("\n");
    const markdownString = lines?.join("  \n");
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
      mode: "annotation",
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
          getAnnotationsTaskData(rsp_data?.id);
          getTaskData(rsp_data?.id);
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

  let Annotation = AnnotationsTaskDetails?.filter(
    (annotation) => annotation.annotation_type === 1,
  )[0];

  const tasksComplete = (id) => {
    // if (typeof window !== "undefined") {
    if (id) {
      resetNotes();
      // navigate(`/projects/${projectId}/task/${id}`, {replace: true});
      navigate(`/projects/${projectId}/task/${id}`);
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
    return Object.values(formsAnswered).every((value) => value === true);
  };

  const handleAnnotationClick = async (value, id, lead_time, type = "") => {
    if (value === "delete") {
      setFormsAnswered({});
    }
    if (
      value === "labeled" &&
      type === "MultipleLLMInstructionDrivenChat" &&
      areAllFormsAnswered()
    ) {
      setSnackbarInfo({
        open: true,
        message:
          "Please ensure that all the evaluation forms are filled for each interaction!",
        variant: "error",
        severity: "warning",
      });
      return;
    }

    // if (typeof window !== "undefined") {
    let resultValue;

    if (ProjectDetails.project_type == "InstructionDrivenChat") {
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
    } else if (ProjectDetails.project_type == "ModelInteractionEvaluation") {
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
            preferred_response: modelResp.preferred_response,
            prompt_output_pair_id: modelResp.prompt_output_pair_id,
          };
          modelMap[model].push(interaction);
        });
      });

      resultValue = Object.entries(modelMap).map(
        ([model_name, interaction_json]) => {
          return {
            model_name,
            interaction_json,
          };
        },
      );
    }
    setLoading(true);
    setAutoSave(false);
    const PatchAPIdata = {
      annotation_status:
        value === "delete" || value === "delete-pair"
          ? typeof window !== "undefined"
            ? localStorage.getItem("labellingMode")
            : null
          : value,
      annotation_notes:
        typeof window !== "undefined"
          ? JSON.stringify(
              annotationNotesRef?.current?.getEditor().getContents(),
            )
          : null,
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
      result:
        value === "delete"
          ? []
          : value === "delete-pair" &&
              type === "MultipleLLMInstructionDrivenChat"
            ? resultValue.map((model) => ({
                ...model,
                interaction_json: model.interaction_json.slice(0, -1), // remove last pair
              }))
            : value === "delete-pair"
              ? resultValue.slice(0, resultValue.length - 1)
              : resultValue,
      task_id: taskId,
      auto_save: value === "delete" || value === "delete-pair" ? true : false,
      interaction_llm: value === "delete" || value === "delete-pair",
      clear_conversation: value === "delete",
    };

    if (
      ["draft", "skipped", "delete", "labeled", "delete-pair"].includes(value)
    ) {
      if (!["draft", "skipped", "delete", "delete-pair"].includes(value)) {
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
        } else if (
          (ProjectDetails.project_type == "InstructionDrivenChat" ||
            ProjectDetails.project_type ==
              "MultipleLLMInstructionDrivenChat") &&
          chatHistory.length == 0
        ) {
          setSnackbarInfo({
            open: true,
            message: "Please enter prompt",
            variant: "error",
          });
          setLoading(false);
          setShowNotes(false);
          return;
        }
      }
      const TaskObj = new PatchAnnotationAPI(id, PatchAPIdata);
      // dispatch(APITransport(GlossaryObj));
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
          const interactions_length = resp?.result[0]?.interaction_json?.length;
          let modifiedChatHistory = [];
          for (let i = 0; i < interactions_length; i++) {
            const prompt = resp?.result[0]?.interaction_json[i]?.prompt;
            const response_valid_1 = isString(
              resp?.result[0].interaction_json[i]?.output,
            );
            const response_valid_2 = isString(
              resp?.result[1].interaction_json[i]?.output,
            );
            modifiedChatHistory?.push({
              prompt: prompt,
              output: [
                {
                  model_name: resp?.result[0].model_name,
                  output: response_valid_1
                    ? formatResponse(
                        resp?.result[0].interaction_json[i]?.output,
                      )
                    : formatResponse(
                        `${resp?.result[0].model_name} failed to generate a response`,
                      ),
                  status: response_valid_1 ? "success" : "error",
                  output_error: response_valid_1
                    ? null
                    : JSON.stringify(
                        resp?.result[0].interaction_json[i]?.output,
                      ),
                },
                {
                  model_name: resp?.result[1].model_name,
                  output: response_valid_2
                    ? formatResponse(
                        resp?.result[1].interaction_json[i]?.output,
                      )
                    : formatResponse(
                        `${resp?.result[1].model_name} failed to generate a response`,
                      ),
                  status: response_valid_2 ? "success" : "error",
                  output_error: response_valid_2
                    ? null
                    : JSON.stringify(
                        resp?.result[1].interaction_json[i]?.output,
                      ),
                },
              ],
            });
          }
          setChatHistory([...modifiedChatHistory]);
        } else {
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
          ? (setSnackbarInfo({
              open: true,
              message: "Chat history has been cleared successfully!",
              variant: "success",
            }),
            await getAnnotationsTaskData(taskId),
            await getTaskData(taskId))
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
        setLoading(false);
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
    // }
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem("TaskData", JSON.stringify(taskData));
  }

  const getAnnotationsTaskData = (id) => {
    setLoading(true);
    dispatch(fetchAnnotationsTask(id));
  };
  const [filteredReady, setFilteredReady] = useState(false);

  const filterAnnotations = (annotations, user) => {
    setLoading(true);
    let disableSkip = false;
    let disableUpdate = false;
    let disableDraft = false;
    let Message = "";
    let filteredAnnotations = annotations;
    let userAnnotation = annotations.find((annotation) => {
      return (
        annotation.completed_by === user.id && !annotation.parent_annotation
      );
    });
    let userAnnotationData = annotations.find(
      (annotation) => annotation.annotation_type === 2,
    );

    if (userAnnotation) {
      if (userAnnotation.annotation_status === "labeled") {
        const superCheckedAnnotation = annotations.find(
          (annotation) => annotation.annotation_type === 3,
        );
        let review = annotations.find(
          (annotation) =>
            annotation.parent_annotation === userAnnotation.id &&
            annotation.annotation_type === 2,
        );
        if (
          superCheckedAnnotation &&
          ["draft", "skipped", "validated", "validated_with_changes"].includes(
            superCheckedAnnotation.annotation_status,
          )
        ) {
          filteredAnnotations = [superCheckedAnnotation];

          Message = "This is the Super Checker's Annotation in read only mode";

          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
        } else if (
          review &&
          ["skipped", "draft", "rejected", "unreviewed"].includes(
            review.annotation_status,
          )
        ) {
          filteredAnnotations = [userAnnotation];
          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
          Message = "This task is being reviewed by the reviewer";
        } else if (
          review &&
          [
            "accepted",
            "accepted_with_minor_changes",
            "accepted_with_major_changes",
          ].includes(review.annotation_status)
        ) {
          filteredAnnotations = [review];
          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
          Message = "This is the Reviewer's Annotation in read only mode";
        } else {
          filteredAnnotations = [userAnnotation];
        }
      } else if (
        userAnnotationData &&
        ["draft"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;

        Message = "Skip button is disabled, since the task is being reviewed";
      } else if (
        userAnnotation &&
        ["to_be_revised"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        Message = "Skip button is disabled, since the task is being reviewed";
      } else {
        filteredAnnotations = [userAnnotation];
      }
    } else if ([4, 5, 6].includes(user.role)) {
      filteredAnnotations = annotations.filter((a) => a.annotation_type === 1);
      disableDraft = true;
      disableSkip = true;
      disableUpdate = true;
    }

    setAutoSave(!disableUpdate);
    setAnnotations(filteredAnnotations);
    setDisableBtns(disableDraft);
    setDisableUpdateButton(disableUpdate);
    setdisableSkipButton(disableSkip);
    setFilterMessage(Message);
    setLoading(false);

    return [
      filteredAnnotations,
      disableDraft,
      disableSkip,
      disableUpdate,
      Message,
    ];
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

  let componentToRender;
  switch (ProjectDetails.project_type) {
    case "InstructionDrivenChat":
      componentToRender = (
        <InstructionDrivenChatPage
          key={
            annotations?.length > 0
              ? `annotations-${annotations[0]?.id}`
              : "annotations-default"
          }
          handleClick={handleAnnotationClick}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          formatResponse={formatResponse}
          formatPrompt={formatPrompt}
          id={Annotation}
          stage={"Annotation"}
          notes={annotationNotesRef}
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
          key={
            annotations?.length > 0
              ? `annotations-${annotations[0]?.id}`
              : "annotations-default"
          }
          handleClick={handleAnnotationClick}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          formatResponse={formatResponse}
          formatPrompt={formatPrompt}
          id={Annotation}
          stage={"Annotation"}
          notes={annotationNotesRef}
          info={info}
          disableUpdateButton={disableUpdateButton}
          annotation={annotations}
          setLoading={setLoading}
          loading={loading}
          formsAnswered={formsAnswered}
          setFormsAnswered={setFormsAnswered}
          evalFormResponse={evalFormResponse}
          setEvalFormResponse={setEvalFormResponse}
          setIsModelFailing={setIsModelFailing}
        />
      );
      break;
    case "ModelInteractionEvaluation":
      componentToRender = (
        <ModelInteractionEvaluation
          key={
            annotations?.length > 0
              ? `annotations-${annotations[0]?.id}`
              : "annotations-default"
          }
          setCurrentInteraction={setCurrentInteraction}
          currentInteraction={currentInteraction}
          interactions={interactions}
          setInteractions={setInteractions}
          forms={forms}
          setForms={setForms}
          stage={"Annotation"}
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
          key={
            annotations?.length > 0
              ? `annotations-${annotations[0]?.id}`
              : "annotations-default"
          }
          setCurrentInteraction={setCurrentInteraction}
          currentInteraction={currentInteraction}
          interactions={interactions}
          setInteractions={setInteractions}
          forms={forms}
          setForms={setForms}
          stage={"Annotation"}
          answered={answered}
          setAnswered={setAnswered}
          annotation={annotations}
          setLoading={setLoading}
          loading={loading}
          handleClick={handleAnnotationClick}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          formatResponse={formatResponse}
          formatPrompt={formatPrompt}
          id={Annotation}
          notes={annotationNotesRef}
          info={info}
          disableUpdateButton={disableUpdateButton}
        />
      );
      break;
    default:
      componentToRender = null;
      break;
  }

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

  const topref = useRef(null);

  return (
    <>
      {loading && <Spinner />}
      <div id="top" ref={topref}></div>
      <Grid container>
        {renderSnackBar()}
        <Grid item>
          <Box
            sx={{
              paddingTop: { xs: 1.5, md: 3 },
              paddingLeft: 1.5,
            }}
          >
            <Button
              value="Back to Project"
              startIcon={<ArrowBackIcon />}
              variant="contained"
              color="primary"
              sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.5, md: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                minWidth: { xs: "120px", sm: "150px", md: "180px" },
              }}
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("labelAll");
                }

                navigate(`/projects/${projectId}`);
              }}
            >
              Back to Project
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              paddingTop: { xs: 1.5, md: 3 },
              paddingLeft: 1.5,
            }}
          >
            <Button
              endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color={reviewtext.trim().length === 0 ? "primary" : "success"}
              onClick={handleCollapseClick}
              sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.5, md: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                minWidth: { xs: "120px", sm: "150px", md: "180px" },
              }}
              style={{
                backgroundColor:
                  reviewtext.trim().length === 0 ? "#bf360c" : "green",
              }}
            >
              Notes {reviewtext.trim().length === 0 ? "" : "*"}
            </Button>
            {/* )} */}

            <div
              style={{
                display: showNotes ? "block" : "none",
                paddingBottom: "16px",
              }}
            >
              <ReactQuill
                forwardedRef={annotationNotesRef}
                modules={modules}
                formats={formats}
                bounds={"#note"}
                placeholder="Annotation Notes"
              ></ReactQuill>
              <ReactQuill
                forwardedRef={reviewNotesRef}
                modules={modules}
                formats={formats}
                bounds={"#note"}
                placeholder="Review Notes"
                style={{ marginbottom: "1%", minHeight: "2rem" }}
                readOnly={true}
              ></ReactQuill>
            </div>
          </Box>
          <Grid
            container
            justifyContent="center"
            style={{
              display: "flex",
              width: "100%",
              padding: "16px",
              gap: "0.5rem",
            }}
          >
            <Grid item>
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
                  type="default"
                  className="lsf-button"
                  style={{
                    minWidth: "40px",
                    border: "1px solid #e6e6e6",
                    color: "grey",
                    pt: 1,
                    pl: 1,
                    pr: 1,
                    borderBottom: "None",
                    backgroundColor: "white",
                  }}
                >
                  <InfoOutlined sx={{ mb: "-3px", ml: "2px", color: "grey" }} />
                </Button>
              </LightTooltip>
            </Grid>

            {!disableBtns &&
              taskData?.annotation_users?.some(
                (users) => users === userData.id,
              ) && (
                <Grid item>
                  <Tooltip
                    title={
                      <span style={{ fontFamily: "Roboto, sans-serif" }}>
                        Save task for later
                      </span>
                    }
                  >
                    <Button
                      value="Draft"
                      type="default"
                      variant="outlined"
                      onClick={() =>
                        handleAnnotationClick(
                          "draft",
                          Annotation.id,
                          Annotation.lead_time,
                        )
                      }
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                        minWidth: { xs: "100px", sm: "150px", md: "150px" },
                      }}
                      style={{
                        color: "black",
                        borderRadius: "5px",
                        border: "0px",
                        backgroundColor: "#ffe0b2",
                      }}
                    >
                      Draft
                    </Button>
                  </Tooltip>
                  {/* )} */}
                </Grid>
              )}
            <Grid item>
              <Tooltip
                title={
                  <span style={{ fontFamily: "Roboto, sans-serif" }}>
                    Go to next task
                  </span>
                }
              >
                <Button
                  value="Next"
                  type="default"
                  onClick={() => onNextAnnotation("next", getNextTask?.id)}
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                    minWidth: { xs: "100px", sm: "150px", md: "150px" },
                  }}
                  style={{
                    color: "black",
                    borderRadius: "5px",
                    border: "0px",
                    backgroundColor: "#ffe0b2",
                  }}
                >
                  Next
                </Button>
              </Tooltip>
            </Grid>
            {!disableSkipButton &&
              taskData?.annotation_users?.some(
                (users) => users === userData.id,
              ) && (
                <Grid item>
                  <Tooltip
                    title={
                      <span style={{ fontFamily: "Roboto, sans-serif" }}>
                        Skip to next task
                      </span>
                    }
                  >
                    <Button
                      value="Skip"
                      type="default"
                      variant="outlined"
                      onClick={() =>
                        handleAnnotationClick(
                          "skipped",
                          Annotation.id,
                          Annotation.lead_time,
                        )
                      }
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                        minWidth: { xs: "100px", sm: "150px", md: "150px" },
                      }}
                      style={{
                        color: "black",
                        borderRadius: "5px",
                        border: "0px",
                        backgroundColor: "#ffe0b2",
                      }}
                    >
                      Skip
                    </Button>
                  </Tooltip>
                </Grid>
              )}
            {!disableSkipButton &&
              taskData?.annotation_users?.some(
                (users) => users === userData.id,
              ) && (
                <Grid item>
                  {ProjectDetails?.project_type == "InstructionDrivenChat" ||
                  ProjectDetails?.project_type ==
                    "MultipleLLMInstructionDrivenChat" ? (
                    <Tooltip
                      title={
                        <span style={{ fontFamily: "Roboto, sans-serif" }}>
                          clear the entire chat history
                        </span>
                      }
                    >
                      <Button
                        value="Clear Chats"
                        type="default"
                        variant="outlined"
                        onClick={() =>
                          handleAnnotationClick(
                            "delete",
                            Annotation.id,
                            Annotation.lead_time,
                          )
                        }
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            md: "1rem",
                          },
                          minWidth: { xs: "100px", sm: "150px", md: "150px" },
                        }}
                        style={{
                          color: "black",
                          borderRadius: "5px",
                          border: "0px",
                          backgroundColor: "#ffe0b2",
                        }}
                      >
                        Clear Chats
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        <span style={{ fontFamily: "Roboto, sans-serif" }}>
                          Reset the entire chat history
                        </span>
                      }
                    >
                      {" "}
                      <Button
                        value="Reset All Forms"
                        type="default"
                        variant="outlined"
                        onClick={() =>
                          handleAnnotationClick(
                            "delete",
                            Annotation.id,
                            Annotation.lead_time,
                          )
                        }
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            md: "1rem",
                          },
                          minWidth: { xs: "100px", sm: "150px", md: "150px" },
                        }}
                        style={{
                          color: "black",
                          borderRadius: "5px",
                          border: "0px",
                          backgroundColor: "#ffe0b2",
                        }}
                      >
                        {" "}
                        Reset All
                      </Button>
                    </Tooltip>
                  )}
                </Grid>
              )}
            {!disableUpdateButton &&
              taskData?.annotation_users?.some(
                (users) => users === userData.id,
              ) && (
                <Grid item>
                  <Tooltip>
                    <Button
                      value="Updata"
                      type="default"
                      variant="contained"
                      onClick={() => {
                        // if (
                        //   ProjectDetails?.project_type ===
                        //     "MultipleLLMInstructionDrivenChat" &&
                        //   isModelFailing
                        // ) {
                        //   setSnackbarInfo({
                        //     open: true,
                        //     message:
                        //       "Either of the models appear to be failing! Please submit the task as 'Draft' or 'Skipped'. You can come back later to update the task.",
                        //     variant: "warning",
                        //     severity: "warning"
                        //   });
                        //   return;
                        // } else {
                          handleAnnotationClick(
                            "labeled",
                            Annotation.id,
                            Annotation.lead_time,
                            ProjectDetails?.project_type,
                          );
                        // }
                      }}
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                        minWidth: { xs: "100px", sm: "150px", md: "150px" },
                      }}
                      style={{
                        color: "black",
                        borderRadius: "5px",
                        border: "0px",
                        backgroundColor: "#ee6633",
                      }}
                    >
                      Submit
                    </Button>
                  </Tooltip>
                </Grid>
              )}
          </Grid>
          {filterMessage && (
            <Alert severity="info" sx={{ ml: 2, mb: 2, width: "95%" }}>
              {filterMessage}
            </Alert>
          )}
        </Grid>
        <Grid item container sx={{ width: "100%" }}>
          {" "}
          {componentToRender}{" "}
        </Grid>
      </Grid>
    </>
  );
};

export default memo(AnnotatePage);
