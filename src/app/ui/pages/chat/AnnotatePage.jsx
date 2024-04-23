"use client";
import "./chat.css";
import { useState, useRef, useEffect,LegacyRef } from "react";
import { Grid, Box, Avatar, Typography, Tooltip, Button, Alert } from "@mui/material";
import Image from "next/image";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import headerStyle from "@/styles/Header";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dynamic from "next/dynamic";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import type ReactQuill from 'react-quill'

// import ReactQuill, { Quill } from 'react-quill';
import "./editor.css";
import "quill/dist/quill.snow.css";
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
import Spinner from "@/components/common/Spinner";
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
import CustomizedSnackbars from "@/components/common/Snackbar";
import getTaskAssignedUsers from "@/utils/getTaskAssignedUsers";
import ModelInteractionEvaluation from "../model_response_evaluation/model_response_evaluation";
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


const AnnotatePage = () => {
  // eslint-disable-next-line react/display-name

  /* eslint-disable react-hooks/exhaustive-deps */
  let inputValue = "";
  const classes = headerStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [assignedUsers, setAssignedUsers] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const { projectId, taskId } = useParams();
  const [chatHistory, setChatHistory] = useState([{}]);
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const [labelConfig, setLabelConfig] = useState();
  
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
  const [disableSkipButton, setdisableSkipButton] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);
  const [NextData, setNextData] = useState("");
  const [currentInteraction, setCurrentInteraction] = useState({});

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

  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };
  const handleGlossaryClick = () => {
    setShowGlossary(!showGlossary);
  };
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
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      annotationNotesRef.current &&
      reviewNotesRef.current
    ) {
    if (AnnotationsTaskDetails && AnnotationsTaskDetails.length > 0) {
      annotationNotesRef.current.value = AnnotationsTaskDetails[0].annotation_notes ?? "";
      reviewNotesRef.current.value = AnnotationsTaskDetails[0].review_notes ?? "";
      try {
        const newDelta2 = annotationNotesRef.current.value !== "" ? JSON.parse(annotationNotesRef.current.value) : "";
        annotationNotesRef.current.getEditor().setContents(newDelta2);
      } catch (err) {
        if(err){
          const newDelta2 = annotationNotesRef.current.value;
          annotationNotesRef.current.getEditor().setText(newDelta2);
        }
      }
      
      try {
        const newDelta1 = reviewNotesRef.current.value!=""?JSON.parse(reviewNotesRef.current.value):"";
        reviewNotesRef.current.getEditor().setContents(newDelta1);
      } catch (err) {
        if(err){
          const newDelta1 = reviewNotesRef.current.value;
          reviewNotesRef.current.getEditor().setText(newDelta1);
        }
      }
      setannotationtext(annotationNotesRef.current.getEditor().getText())
      setreviewtext(reviewNotesRef.current.getEditor().getText())
    }
  }
  }, [AnnotationsTaskDetails]);

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

  useEffect(() => {
    resetNotes();
  }, [taskId]);

  useEffect(() => {
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskData).then((res) => setAssignedUsers(res));
    };
    taskData?.id && showAssignedUsers();
  }, [taskData]);

 
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
          getTaskData(rsp_data?.id)
        }
      })
      .catch((error) => {
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
  };
  let Annotation = AnnotationsTaskDetails.filter(
    (annotation) => annotation.annotation_type === 1
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
        localStorage.removeItem("labelAll");
        window.location.replace(`/#/projects/${projectId}`);
        window.location.reload();
      }, 1000);
    }
    // }
  };
  const handleAnnotationClick = async (
    value,
    id,
    lead_time,
  ) => {
    // if (typeof window !== "undefined") {
      let resultValue;
      if (ProjectDetails.project_type == "InstructionDrivenChat") {
        resultValue = chatHistory;
      } else if (ProjectDetails.project_type == "ModelInteractionEvaluation") {
        resultValue = currentInteraction;
      }
    setLoading(true);
    setAutoSave(false);
    const PatchAPIdata = {
      annotation_status: value,
      annotation_notes: JSON.stringify(
        annotationNotesRef?.current?.getEditor().getContents(),
      ),
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
      result:resultValue,
      task_id:taskId,
      auto_save:autoSave,
      interaction_llm:"False"
    };
    console.log(value);
    if (["draft", "skipped","labeled"].includes(value)) {
      console.log("lll");
      delete PatchAPIdata.auto_save;
      const TaskObj = new PatchAnnotationAPI(id, PatchAPIdata);
      // dispatch(APITransport(GlossaryObj));
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
  window.localStorage.setItem("TaskData", JSON.stringify(taskData));

  useEffect(() => {
    filterAnnotations(AnnotationsTaskDetails, userData);
  }, [AnnotationsTaskDetails, userData]);

  const getAnnotationsTaskData = (id) => {
    setLoading(true);
    dispatch(fetchAnnotationsTask(id));
  };

  useEffect(() => {
    getAnnotationsTaskData(taskId);
    getProjectDetails();
    getTaskData(taskId);
  }, []);
  const filterAnnotations = (annotations, user) => {
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
      (annotation) => annotation.annotation_type === 2
    );

    if (userAnnotation) {
      if (userAnnotation.annotation_status === "labeled") {
        const superCheckedAnnotation = annotations.find(
          (annotation) => annotation.annotation_type === 3
        );
        let review = annotations.find(
          (annotation) =>
            annotation.parent_annotation === userAnnotation.id &&
            annotation.annotation_type === 2
        );
        if (
          superCheckedAnnotation &&
          ["draft", "skipped", "validated", "validated_with_changes"].includes(
            superCheckedAnnotation.annotation_status
          )
        ) {
          filteredAnnotations = [superCheckedAnnotation];

          Message =
            "This is the Super Checker's Annotation in read only mode";

          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
        } else if (
          review &&
          ["skipped", "draft", "rejected", "unreviewed"].includes(
            review.annotation_status
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
          Message =
            "This is the Reviewer's Annotation in read only mode";
        } else {
          filteredAnnotations = [userAnnotation];
        }
      } else if (
        userAnnotationData &&
        ["draft"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;

        Message =
          "Skip button is disabled, since the task is being reviewed";
      } else if (
        userAnnotation &&
        ["to_be_revised"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        Message =
          "Skip button is disabled, since the task is being reviewed";
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
      dispatch(setTaskDetails(resp));
      setTaskDataArr(resp);
    }
    setLoading(false);
  };

  const getProjectDetails = () => {
    dispatch(fetchProjectDetails(projectId));
  };

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
    }
  }, [AnnotationsTaskDetails]);

  let componentToRender;
  switch (ProjectDetails.project_type) {
    case 'InstructionDrivenChat':
      componentToRender = <InstructionDrivenChatPage chatHistory={chatHistory} setChatHistory={setChatHistory}/>;
      break;
    case 'ModelInteractionEvaluation':
      componentToRender = <ModelInteractionEvaluation setCurrentInteraction={setCurrentInteraction} currentInteraction={currentInteraction}/>;
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
        <Grid item>
          <Box
            sx={{
              // borderRadius: "20px",
              padding: "10px",
              marginLeft: "5px",
            }}
          >
              <Button
                value="Back to Project"
                startIcon={<ArrowBackIcon />}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                  localStorage.removeItem("labelAll");
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
              // borderRadius: "20px",
              padding: "10px",
              marginTop: "5px",
              marginBottom: "5px",
              marginLeft: "5px",
            }}
          >
            {/* ( */}
              <Button
                endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDown />}
                variant="contained"
                color={reviewtext.trim().length === 0 ? "primary" : "success"}
                onClick={handleCollapseClick}
                style={{ backgroundColor: reviewtext.trim().length === 0 ? "#bf360c" : "green" }}
              >
                Notes {reviewtext.trim().length === 0 ? "" : "*"}
              </Button>
            {/* )} */}

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
            <Button
              variant="contained"
              style={{ marginLeft: "10px", backgroundColor: "lightgrey" ,color:"black" }}
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
          <Grid
            container
            justifyContent="center"
            spacing={3}
            style={{
              display: "flex",
              width: "100%",
              marginTop: "3px",
              marginBottom: "25px",
            }}
          >
            <Grid item>
              <LightTooltip title={assignedUsers ? assignedUsers : ""}>
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
            {/* <Grid item>
              <Typography sx={{mt: 2, ml: 4, color: "grey",backgroundColor:"white",padding:"5px",borderRadius:"4px",mb:"10px"}}>
               *{ProjectDetails.project_type} # {taskId} 
       
            </Typography>
            </Grid> */}

{!disableBtns &&
          taskData?.annotation_users?.some((users) => users === userData.id) && (
            <Grid item>
              <Tooltip title="Save task for later">
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
        {!disableSkipButton &&
          taskData?.annotation_users?.some((users) => users === userData.id) && (
            <Grid item>
              <Tooltip title="skip to next task">
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
            </Grid>
          )}
        {!disableUpdateButton &&
          taskData?.annotation_users?.some((users) => users === userData.id) && (
            <Grid item>
              <Tooltip>
                <Button
                  value="Updata"
                  type="default"
                  variant="contained"
                  onClick={() =>
                    handleAnnotationClick(
                      "labeled",
                      Annotation.id,
                      Annotation.lead_time,
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
                  Update
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
        <Grid item container>
          {" "}
          {componentToRender}{" "}
        </Grid>
      </Grid>
    </>
  );
};

export default AnnotatePage;
