"use client";
import "./chat.css";
import { useState, useRef, useEffect } from "react";
import { Grid, Box, Avatar, Typography, Tooltip, Button, Alert } from "@mui/material";
import Image from "next/image";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import headerStyle from "@/styles/Header";
import MenuItem from "@mui/material/MenuItem";
import Menu, { MenuProps } from "@mui/material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { styled, alpha } from "@mui/material/styles";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dynamic from "next/dynamic";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./editor.css"
import 'quill/dist/quill.snow.css';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  getProjectsandTasks,
  postAnnotation,
  getNextProject,
  patchAnnotation,
  deleteAnnotation,
  fetchAnnotation,
} from "../../../actions/api/Annotate/AnnotateAPI";
import "./chat.css";
import Spinner from "@/components/common/Spinner"
import { ContactlessOutlined } from "@mui/icons-material";
import GetTaskDetailsAPI from "@/app/actions/api/Dashboard/getTaskDetails";
import { fetchAnnotationsTask } from "@/Lib/Features/projects/getAnnotationsTask";
import GetNextProjectAPI from "@/app/actions/api/Projects/GetNextProjectAPI";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";
import { setTaskDetails } from "@/Lib/Features/getTaskDetails";
import InstructionDrivenChatPage from "./InstructionDrivenChatPage";
import PatchAnnotationAPI from "@/app/actions/api/Annotate/PatchAnnotationAPI";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import LightTooltip from "@/components/common/Tooltip";
import { ArrowDropDown } from "@material-ui/icons";
import Glossary from "./Glossary";
import getTaskAssignedUsers from "@/utils/getTaskAssignedUsers";
import CustomizedSnackbars from "@/components/common/Snackbar";
import ModelInteractionEvaluation from "../model_response_evaluation/model_response_evaluation";
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react/display-name

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false
  }
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
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const ReviewPage = () => {
  /* eslint-disable react-hooks/exhaustive-deps */

  let inputValue = "";
  const classes = headerStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lsfRef = useRef();
  const [assignedUsers, setAssignedUsers] = useState(null);
  const [chatHistory, setChatHistory] = useState([{}]);
  const [showNotes, setShowNotes] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const { projectId, taskId } = useParams();
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const [labelConfig, setLabelConfig] = useState();
  const [currentInteraction, setCurrentInteraction] = useState({});

  let loaded = useRef();

  const userData = useSelector((state) => state.getLoggedInData?.data);
  const [loadtime, setloadtime] = useState(new Date());

  const load_time = useRef();

  let labellingMode = localStorage.getItem("labellingMode");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [disableSkip, setdisableSkip] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);
  const [NextData, setNextData] = useState("");

  const [annotations, setAnnotations] = useState([]);

  const annotationNotesRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const reviewNotesRef = useRef(null);
  const [disableBtns, setDisableBtns] = useState(false);
  const [disableUpdateButton, setDisableUpdateButton] = useState(false);
  const [taskDataArr, setTaskDataArr] = useState()
  const AnnotationsTaskDetails = useSelector(
    (state) => state.getAnnotationsTask?.data
  );
  const superCheckerNotesRef = useRef(null);

  const getNextTask = useSelector((state) => state.getnextProject?.data);
  const taskData = useSelector((state) => state.getTaskDetails?.data);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
  const [annotationtext, setannotationtext] = useState('')
  const [reviewtext, setreviewtext] = useState('')
  const [supercheckertext, setsupercheckertext] = useState('')

  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };
  const handleGlossaryClick = () => {
    setShowGlossary(!showGlossary);
  };

  const modules = {
    toolbar: [

      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
    ]
  };

  const formats = [
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script']




  const setNotes = (taskData, annotations) => {
    if (typeof window !== "undefined" && annotationNotesRef.current && reviewNotesRef.current && superCheckerNotesRef.current) {

      if (annotations && annotations.length > 0) {
        let userAnnotation = annotations.find(
          (annotation) =>
            annotation.completed_by === userData.id &&
            annotation.annotation_type === 2
        );
        if (userAnnotation) {
          let normalAnnotation = annotations.find(
            (annotation) => annotation.id === userAnnotation.parent_annotation
          );
          let superCheckerAnnotation = annotations.find(
            (annotation) => annotation.parent_annotation === userAnnotation.id
          );
          annotationNotesRef.current.value = normalAnnotation?.annotation_notes ?? "";
          reviewNotesRef.current.value = userAnnotation?.review_notes ?? "";
          superCheckerNotesRef.current.value = superCheckerAnnotation?.supercheck_notes ?? "";
          try {
            const newDelta2 = annotationNotesRef.current.value !== "" ? JSON.parse(annotationNotesRef.current.value) : "";
            annotationNotesRef.current.getEditor().setContents(newDelta2);
          } catch (err) {
            if (err) {
              const newDelta2 = annotationNotesRef.current.value;
              annotationNotesRef.current.getEditor().setText(newDelta2);
            }
          }

          try {
            const newDelta1 = reviewNotesRef.current.value != "" ? JSON.parse(reviewNotesRef.current.value) : "";
            reviewNotesRef.current.getEditor().setContents(newDelta1);
          } catch (err) {
            if (err) {
              const newDelta1 = reviewNotesRef.current.value;
              reviewNotesRef.current.getEditor().setText(newDelta1);
            }
          }
          try {
            const newDelta3 = superCheckerNotesRef.current.value != "" ? JSON.parse(superCheckerNotesRef.current.value) : "";
            superCheckerNotesRef.current.getEditor().setContents(newDelta3);
          } catch (err) {
            if (err) {
              const newDelta3 = superCheckerNotesRef.current.value;
              superCheckerNotesRef.current.getEditor().setText(newDelta3);
            }
          }
          setannotationtext(annotationNotesRef.current.getEditor().getText())
          setreviewtext(reviewNotesRef.current.getEditor().getText())
          setsupercheckertext(superCheckerNotesRef.current.getEditor().getText())

        } else {
          let reviewerAnnotations = annotations.filter(
            (annotation) => annotation.annotation_type === 2
          );
          if (reviewerAnnotations.length > 0) {
            let correctAnnotation = reviewerAnnotations.find(
              (annotation) => annotation.id === taskData.correct_annotation
            );
            if (correctAnnotation) {
              reviewNotesRef.current.value = correctAnnotation.review_notes ?? "";
              annotationNotesRef.current.value =
                annotations.find(
                  (annotation) =>
                    annotation.id === correctAnnotation.parent_annotation
                )?.annotation_notes ?? "";
              superCheckerNotesRef.current.value =
                annotations.find(
                  (annotation) =>
                    annotation.parent_annotation === correctAnnotation.id
                )?.supercheck_notes ?? "";
              try {
                const newDelta2 = annotationNotesRef.current.value !== "" ? JSON.parse(annotationNotesRef.current.value) : "";
                annotationNotesRef.current.getEditor().setContents(newDelta2);
              } catch (err) {
                if (err) {
                  const newDelta2 = annotationNotesRef.current.value;
                  annotationNotesRef.current.getEditor().setText(newDelta2);
                }
              }

              try {
                const newDelta1 = reviewNotesRef.current.value != "" ? JSON.parse(reviewNotesRef.current.value) : "";
                reviewNotesRef.current.getEditor().setContents(newDelta1);
              } catch (err) {
                if (err) {
                  const newDelta1 = reviewNotesRef.current.value;
                  reviewNotesRef.current.getEditor().setText(newDelta1);
                }
              }
              try {
                const newDelta3 = superCheckerNotesRef.current.value != "" ? JSON.parse(superCheckerNotesRef.current.value) : "";
                superCheckerNotesRef.current.getEditor().setContents(newDelta3);
              } catch (err) {
                if (err) {
                  const newDelta3 = superCheckerNotesRef.current.value;
                  superCheckerNotesRef.current.getEditor().setText(newDelta3);
                }
              }
              setannotationtext(annotationNotesRef.current.getEditor().getText())
              setreviewtext(reviewNotesRef.current.getEditor().getText())
              setsupercheckertext(superCheckerNotesRef.current.getEditor().getText())

            } else {
              reviewNotesRef.current.value =
                reviewerAnnotations[0].review_notes ?? "";
              annotationNotesRef.current.value =
                annotations.find(
                  (annotation) =>
                    annotation.id === reviewerAnnotations[0]?.parent_annotation
                )?.annotation_notes ?? "";
              superCheckerNotesRef.current.value =
                annotations.find(
                  (annotation) =>
                    annotation.parent_annotation === reviewerAnnotations[0]?.id
                )?.supercheck_notes ?? "";
              try {
                const newDelta2 = annotationNotesRef.current.value !== "" ? JSON.parse(annotationNotesRef.current.value) : "";
                annotationNotesRef.current.getEditor().setContents(newDelta2);
              } catch (err) {
                if (err) {
                  const newDelta2 = annotationNotesRef.current.value;
                  annotationNotesRef.current.getEditor().setText(newDelta2);
                }
              }

              try {
                const newDelta1 = reviewNotesRef.current.value != "" ? JSON.parse(reviewNotesRef.current.value) : "";
                reviewNotesRef.current.getEditor().setContents(newDelta1);
              } catch (err) {
                if (err) {
                  const newDelta1 = reviewNotesRef.current.value;
                  reviewNotesRef.current.getEditor().setText(newDelta1);
                }
              }
              try {
                const newDelta3 = superCheckerNotesRef.current.value != "" ? JSON.parse(superCheckerNotesRef.current.value) : "";
                superCheckerNotesRef.current.getEditor().setContents(newDelta3);
              } catch (err) {
                if (err) {
                  const newDelta3 = superCheckerNotesRef.current.value;
                  superCheckerNotesRef.current.getEditor().setText(newDelta3);
                }
              }

              setannotationtext(annotationNotesRef.current.getEditor().getText())
              setreviewtext(reviewNotesRef.current.getEditor().getText())
              setsupercheckertext(superCheckerNotesRef.current.getEditor().getText())

            }
          } else {
            let normalAnnotation = annotations.find(
              (annotation) => annotation.annotation_type === 1
            );
            annotationNotesRef.current.value =
              normalAnnotation.annotation_notes ?? "";
            reviewNotesRef.current.value = normalAnnotation.review_notes ?? "";
            superCheckerNotesRef.current.value =
              normalAnnotation.supercheck_notes ?? "";
            try {
              const newDelta2 = annotationNotesRef.current.value !== "" ? JSON.parse(annotationNotesRef.current.value) : "";
              annotationNotesRef.current.getEditor().setContents(newDelta2);
            } catch (err) {
              if (err) {
                const newDelta2 = annotationNotesRef.current.value;
                annotationNotesRef.current.getEditor().setText(newDelta2);
              }
            }

            try {
              const newDelta1 = reviewNotesRef.current.value != "" ? JSON.parse(reviewNotesRef.current.value) : "";
              reviewNotesRef.current.getEditor().setContents(newDelta1);
            } catch (err) {
              if (err) {
                const newDelta1 = reviewNotesRef.current.value;
                reviewNotesRef.current.getEditor().setText(newDelta1);
              }
            }
            try {
              const newDelta3 = superCheckerNotesRef.current.value != "" ? JSON.parse(superCheckerNotesRef.current.value) : "";
              superCheckerNotesRef.current.getEditor().setContents(newDelta3);
            } catch (err) {
              if (err) {
                const newDelta3 = superCheckerNotesRef.current.value;
                superCheckerNotesRef.current.getEditor().setText(newDelta3);
              }
            }
            setannotationtext(annotationNotesRef.current.getEditor().getText())
            setreviewtext(reviewNotesRef.current.getEditor().getText())
            setsupercheckertext(superCheckerNotesRef.current.getEditor().getText())

          }
        }
      }
    }
  };

  useEffect(() => {
    taskDataArr && setNotes(taskDataArr, AnnotationsTaskDetails);

  }, [taskDataArr, AnnotationsTaskDetails]);

  const resetNotes = () => {
    if (typeof window !== "undefined" && annotationNotesRef.current && reviewNotesRef.current && superCheckerNotesRef.current) {

      setShowNotes(false);
      reviewNotesRef.current.getEditor().setContents([]);
    }
  };

  useEffect(() => {
    resetNotes();
  }, [taskId]);


  useEffect(() => {
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskData).then(res => setAssignedUsers(res));
    }
    taskData?.id && showAssignedUsers();
  }, [taskData]);


  const onNextAnnotation = async (value) => {
    setLoading(true);
    const nextAPIData = {
      id: projectId,
      current_task_id: taskId,
      mode: "review",
      annotation_status: labellingMode,
    };

    let apiObj = new GetNextProjectAPI(projectId, nextAPIData)
    var rsp_data = []
    fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      rsp_data = await response.json();
      setLoading(false)
      if (response.ok) {
        setNextData(rsp_data);
        tasksComplete(rsp_data?.id || null);
        getAnnotationsTaskData(rsp_data.id);
        getTaskData(rsp_data.id);
      }
    }).catch((error) => {
      setSnackbarInfo({
        open: true,
        message: "No more tasks to label",
        variant: "info",
      });
      setTimeout(() => {
        localStorage.removeItem("labelAll");
        window.location.replace(`/#/projects/${projectId}`);
      }, 1000);
    });

  }
  const tasksComplete = (id) => {
    if (typeof window !== "undefined") {
      if (id) {
        resetNotes();
        // navigate(`/projects/${projectId}/task/${id}`, {replace: true});
        navigate(`/projects/${projectId}/review/${id}`);
      } else {
        // navigate(-1);
        resetNotes();
        setSnackbarInfo({
          open: true,
          message: "No more tasks to label",
          variant: "info",
        });
        setTimeout(() => {
          localStorage.removeItem("labelAll");
          window.location.replace(`/#/projects/${projectId}`);
          window.location.reload();
        }, 1000);
      }
    }
  };

  const handleReviewClick = async (
    value,
    id,
    lead_time,
    parentannotation,
  ) => {
    if (typeof window !== "undefined") {
      let resultValue;
      if (ProjectDetails.project_type === "InstructionDrivenChat") {
        resultValue = chatHistory;
      } else if (ProjectDetails.project_type === "ModelInteractionEvaluation") {
        resultValue = currentInteraction;
      }
      setLoading(true);
      setAutoSave(false);
      const PatchAPIdata = {
        annotation_status: value,
        review_notes: JSON.stringify(reviewNotesRef?.current?.getEditor().getContents()),
        lead_time:
          (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
        ...((value === "to_be_revised" || value === "accepted" ||
          value === "accepted_with_minor_changes" ||
          value === "accepted_with_major_changes") && {
          parent_annotation: parentannotation,
        }),
        result: resultValue,
        interaction_llm: "False",
        task_id: taskId,
        auto_save: autoSave
      };
      if (
        ["draft", "skipped", "to_be_revised"].includes(value) ||
        (["accepted", "accepted_with_minor_changes", "accepted_with_major_changes"].includes(value))
      ) {
        delete PatchAPIdata.auto_save;
        const TaskObj = new PatchAnnotationAPI(id, PatchAPIdata);
        const res = await fetch(TaskObj.apiEndPoint(), {
          method: "PATCH",
          body: JSON.stringify(TaskObj.getBody()),
          headers: TaskObj.getHeaders().headers,
        });
        const resp = await res.json();
        if (res.ok) {
          if (localStorage.getItem("labelAll") || value === "skipped") {
            onNextAnnotation(resp.task);
          }
          setSnackbarInfo({
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
      } else {
        setAutoSave(true);
        setSnackbarInfo({
          open: true,
          message: "Error in saving",
          variant: "error",
        });
      }
      setLoading(false);
      setShowNotes(false);
      setAnchorEl(null);
    }
  };



  const getAnnotationsTaskData = (id) => {
    setLoading(true);
    dispatch(fetchAnnotationsTask(id));
  };

  useEffect(() => {
    getAnnotationsTaskData(taskId);
    getProjectDetails();
    getTaskData(taskId);
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const filterAnnotations = (annotations, user, taskData) => {
    let filteredAnnotations = annotations;
    let userAnnotation = annotations.find((annotation) => {
      return (
        annotation.completed_by === user.id && annotation.parent_annotation
      );
    });
    let disable = false;
    let disableSkip = false;
    let disablebtn = false;
    let disableButton = false;
    let filterMessage = "";
    let userAnnotationData = annotations.find(
      (annotation) => annotation.annotation_type === 3
    );
    if (userAnnotation) {
      if (userAnnotation.annotation_status === "unreviewed") {
        filteredAnnotations =
          userAnnotation.result.length > 0 &&
            !taskData?.revision_loop_count?.review_count
            ? [userAnnotation]
            : annotations.filter(
              (annotation) =>
                annotation.id === userAnnotation.parent_annotation &&
                annotation.annotation_type === 1
            );
      } else if (
        userAnnotation &&
        ["rejected"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        disableButton = true;
        filterMessage =
          "Revise and Skip buttons are disabled, since the task is being validated by the super checker";
      } else if (
        userAnnotationData &&
        ["draft"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        disableButton = true;
        filterMessage =
          "Revise and Skip buttons are disabled, since the task is being validated by the super checker";
      } else if (userAnnotation.annotation_status === "draft") {
        filteredAnnotations = [userAnnotation];
      } else if (
        [
          "accepted",
          "accepted_with_minor_changes",
          "accepted_with_major_changes",
        ].includes(userAnnotation.annotation_status)
      ) {
        const superCheckedAnnotation = annotations.find(
          (annotation) => annotation.annotation_type === 3
        );
        if (
          superCheckedAnnotation &&
          ["validated", "validated_with_changes"].includes(
            superCheckedAnnotation.annotation_status
          )
        ) {
          filteredAnnotations = [superCheckedAnnotation];
          filterMessage =
            "This is the Super Checker's Annotation in read only mode";

          disablebtn = true;
          disable = true;
          disableSkip = true;
        } else if (
          superCheckedAnnotation &&
          ["draft", "skipped", "unvalidated"].includes(
            superCheckedAnnotation.annotation_status
          )
        ) {
          filteredAnnotations = [userAnnotation];
          filterMessage = "This task is being validated by the super checker";

          disablebtn = true;
          disable = true;
          disableSkip = true;
        } else {
          filteredAnnotations = [userAnnotation];
        }
      } else if (userAnnotation.annotation_status === "skipped") {
        filteredAnnotations = annotations.filter(
          (value) => value.annotation_type === 1
        );
      } else if (userAnnotation.annotation_status === "to_be_revised") {
        filteredAnnotations = annotations.filter(
          (annotation) =>
            annotation.id === userAnnotation.parent_annotation &&
            annotation.annotation_type === 1
        );
      } else if (userAnnotation.annotation_status === "rejected") {
        filteredAnnotations = annotations.filter(
          (annotation) => annotation.annotation_type === 2
        );
      }
    } else if ([4, 5, 6].includes(user.role)) {
      filteredAnnotations = annotations.filter((a) => a.annotation_type === 2);
      disable = true;
      disablebtn = true;
      disableSkip = true;
    }
    console.log(disable, disablebtn, disableSkip);
    setAutoSave(!disablebtn);
    setdisableSkip(disableSkip);
    setDisableBtns(disablebtn);
    setDisableButton(disableButton);
    setFilterMessage(filterMessage);
    setAnnotations(filteredAnnotations);
    return [
      filteredAnnotations,
      disable,
      disableSkip,
      disablebtn,
      disableButton,
      filterMessage,
    ];
  };

  useEffect(() => {
    filterAnnotations(AnnotationsTaskDetails, userData, taskDataArr);
  }, [AnnotationsTaskDetails, userData, taskDataArr]);


  window.localStorage.setItem("TaskData", JSON.stringify(taskData));



  const getTaskData = async (id) => {
    setLoading(true);
    const ProjectObj = new GetTaskDetailsAPI(id);
    const res = await fetch(ProjectObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(ProjectObj.getBody()),
      headers: ProjectObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (
      !res.ok
    ) {
      setLoading(true);
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    } else {
      dispatch(setTaskDetails(resp))
      setTaskDataArr(resp)

    }
    setLoading(false);
  };

  const getProjectDetails = () => {
    dispatch(fetchProjectDetails(projectId));
  };
  let review = AnnotationsTaskDetails.filter(
    (annotation) => annotation.annotation_type === 2
  )[0];

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
    }
  }, [AnnotationsTaskDetails]);

  let componentToRender;
  switch (ProjectDetails.project_type) {
    case 'InstructionDrivenChat':
      componentToRender = <InstructionDrivenChatPage chatHistory={chatHistory} setChatHistory={setChatHistory} />;
      break;
    case 'ModelInteractionEvaluation':
      componentToRender = <ModelInteractionEvaluation setCurrentInteraction={setCurrentInteraction} currentInteraction={currentInteraction} />;
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
      />
    );
  };
  return (
    <>
      {loading && <Spinner />}
      <Grid container spacing={2}>
        {renderSnackBar()}
        <Grid item >
          <Box
            sx={{
              // borderRadius: "20px",
              padding: "10px",
              marginLeft: "5px"
            }}
          >
            <Button
              value="Back to Project"
              startIcon={<  ArrowBackIcon />}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                localStorage.removeItem("labelAll");
                navigate(`/projects/${projectId}`);
                //window.location.replace(`/#/projects/${projectId}`);
                //window.location.reload();
              }}
            >
              Back to Project
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              // borderRadius: "20px",
              padding: "10px",
              marginTop: "5px",
              marginBottom: "5px",
              marginLeft: "5px"
            }}
          >

            <Button
              endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDown />}
              variant="contained"
              color={
                reviewtext.trim().length === 0 ? "primary" : "success"
              }
              onClick={handleCollapseClick}
              style={{
                backgroundColor: annotationtext.trim().length === 0 &&
                  supercheckertext.trim().length === 0 ? "#bf360c" : "green"
              }}
            >
              Notes{" "}
              {annotationtext.trim().length === 0 &&
                supercheckertext.trim().length === 0 ? "" : "*"}
            </Button>


            <div
              // className={styles.collapse}
              style={{
                display: showNotes ? "block" : "none",
                paddingBottom: "16px",

              }}
            >
              <ReactQuill
                forwardedRef={annotationNotesRef}
                modules={modules}
                bounds={"#note"}
                formats={formats}
                placeholder="Annotation Notes"
                readOnly={true}
              ></ReactQuill>
              <ReactQuill
                forwardedRef={reviewNotesRef}
                modules={modules}
                bounds={"#note"}
                formats={formats}
                placeholder="Review Notes"
              ></ReactQuill>
              <ReactQuill
                forwardedRef={superCheckerNotesRef}
                modules={modules}
                bounds={"#note"}
                formats={formats}
                placeholder="SuperChecker Notes"
                readOnly={true}
              ></ReactQuill>
            </div>
            <Button
              variant="contained"

              style={{ marginLeft: "10px", backgroundColor: "lightgrey", color: "black" }}
              endIcon={
                showGlossary ? <ArrowRightIcon /> : <ArrowDropDownIcon />
              }
              onClick={handleGlossaryClick}
              disabled
            >
              Glossary
            </Button>
            <div
              style={{
                display: showGlossary ? "block" : "none",
                paddingBottom: "16px",
              }}
            >
              {/* <Glossary taskData={taskData} /> */}
            </div>
          </Box>
          <Grid container justifyContent="center" spacing={3} style={{ display: "flex", width: "100%", marginTop: "3px", marginBottom: "25px" }}>
            <Grid item >
              {/* title={assignedUsers ? assignedUsers : ""} */}
              <LightTooltip title={assignedUsers ? assignedUsers : ""} >
                <Button
                  type="default"
                  className="lsf-button"
                  style={{
                    minWidth: "40px",
                    border: "1px solid #e6e6e6",
                    color: "grey",
                    pt: 1, pl: 1, pr: 1,
                    borderBottom: "None",
                    backgroundColor: "white"
                  }}
                >
                  <InfoOutlined sx={{ mb: "-3px", ml: "2px", color: "grey" }} />
                </Button>
              </LightTooltip>
            </Grid>
            {/* <Grid item>
              <Typography sx={{mt: 2, ml: 4, color: "grey",backgroundColor:"white",padding:"5px",borderRadius:"4px",mb:"10px"}}>
               *{ProjectDetails.project_type} # {taskId} 
       
            </Typography>
            </Grid> */}
            {!disableBtns && taskData?.review_user === userData?.id && (
              <Grid item>
                <Tooltip title="Save task for later">
                  <Button
                    value="Draft"
                    type="default"
                    variant="outlined"
                    onClick={() =>
                      handleReviewClick(
                        "draft",
                        review.id,
                        review.lead_time,
                      )
                    }
                    style={{
                      minWidth: "150px",
                      color: "black",
                      borderRadius: "5px",
                      border: "0px",
                      pt: 2,
                      pb: 2,
                      backgroundColor: "#ffe0b2",
                    }}
                  // className="lsf-button"
                  >
                    Draft
                  </Button>
                </Tooltip>
                {/* )} */}
              </Grid>
            )}

            <Grid item>
              <Tooltip title="Go to next task">
                <Button
                  value="Next"
                  type="default"
                  onClick={() => onNextAnnotation("next", getNextTask?.id)}
                  style={{
                    minWidth: "150px",
                    color: "black",
                    borderRadius: "5px",
                    border: "0px",
                    pt: 2,
                    pb: 2,
                    backgroundColor: "#ffe0b2",
                  }}
                >
                  Next
                </Button>
              </Tooltip>
            </Grid>

            <Grid item>
              {!disableSkip && taskData?.review_user === userData?.id && (
                <Tooltip title="skip to next task">
                  <Button
                    value="Skip"
                    type="default"
                    variant="outlined"
                    onClick={() =>
                      handleReviewClick(
                        "skipped",
                        review.id,
                        review.lead_time,
                      )
                    }
                    style={{
                      minWidth: "150px",
                      color: "black",
                      borderRadius: "5px",
                      border: "0px",
                      pt: 2,
                      pb: 2,
                      backgroundColor: "#ffe0b2",
                    }}
                  // className="lsf-button"
                  >
                    Skip
                  </Button>
                </Tooltip>
              )}
            </Grid>
            {!disableBtns &&
              !disableButton &&
              taskData?.review_user === userData?.id && (
                <Grid item>
                  <Tooltip title="Revise Annotation">
                    <Button
                      value="to_be_revised"
                      type="default"
                      variant="outlined"
                      onClick={() =>
                        handleReviewClick(
                          "to_be_revised",
                          review?.id,
                          review?.lead_time,
                          review?.parent_annotation,
                        )
                      }
                      style={{
                        minWidth: "150px",
                        color: "black",
                        borderRadius: "5px",
                        border: "0px",
                        pt: 2,
                        pb: 2,
                        backgroundColor: "#ee6633",
                      }}
                    >
                      Revise
                    </Button>
                  </Tooltip>
                </Grid>
              )}
            <Grid item>
              {!disableBtns && taskData?.review_user === userData?.id && (
                <Tooltip title="Accept Annotation">
                  <Button
                    id="accept-button"
                    value="Accept"
                    type="default"
                    aria-controls={open ? "accept-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    style={{
                      minWidth: "150px",
                      color: "black",
                      borderRadius: "5px",
                      border: "0px",
                      pt: 2,
                      pb: 2,
                      backgroundColor: "#ee6633",
                    }}
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownIcon />}
                  >
                    Accept
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
                    handleReviewClick(
                      "accepted",
                      review.id,
                      AnnotationsTaskDetails[1]?.lead_time,
                      review?.parent_annotation,
                    )
                  }
                  disableRipple
                >
                  with No Changes
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleReviewClick(
                      "accepted_with_minor_changes",
                      review.id,
                      review.lead_time,
                      review?.parent_annotation
                    )
                  }
                  disableRipple
                >
                  with Minor Changes
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleReviewClick(
                      "accepted_with_major_changes",
                      review.id,
                      review.lead_time,
                      review?.parent_annotation,
                    )
                  }
                  disableRipple
                >
                  with Major Changes
                </MenuItem>
              </StyledMenu>
            </Grid>
          </Grid>            {filterMessage && (
            <Alert severity="info" sx={{ ml: 2, mb: 2, width: "95%" }}>
              {filterMessage}
            </Alert>
          )}
        </Grid>
        <Grid item container >  {componentToRender}</Grid>


      </Grid>

    </>


  );
};


export default ReviewPage;
