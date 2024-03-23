"use client";
import "./chat.css";
import { useState, useRef, useEffect } from "react";
import { Grid, Box, Avatar, Typography, Tooltip, Button, Alert } from "@mui/material";
import Image from "next/image";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import headerStyle from "@/styles/Header";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"),  { ssr: false, loading: () => <p>Loading ...</p>, });  

// import ReactQuill, { Quill } from 'react-quill';
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
import ModelInteractionEvaluation from "../model_response_evaluation/model_response_evaluation";


const AnnotatePage = () => {
  /* eslint-disable react-hooks/exhaustive-deps */

  let inputValue = "";
  const classes = headerStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [assignedUsers, setAssignedUsers] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const { projectId, taskId } = useParams();
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
  const getNextTask = useSelector((state) => state.getnextProject?.data);
  const taskData = useSelector((state) => state.getTaskDetails?.data);
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
  const [annotationtext, setannotationtext] = useState('')
  const [reviewtext, setreviewtext] = useState('')

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



  useEffect(() => {
    if (typeof window !== "undefined"&& annotationNotesRef.current && reviewNotesRef.current) {
    fetchAnnotation(taskId).then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        annotationNotesRef.current.value = data[0]?.annotation_notes ? data[0].annotation_notes: "";
        reviewNotesRef.current.value = data[0].review_notes ?data[0].review_notes: "";
        try {
          const newDelta2 = annotationNotesRef.current.value !== "" ? JSON.parse(annotationNotesRef.current.value) : "";
          annotationNotesRef.current.getEditor().setContents(newDelta2);
        } catch (err) {
          if (err instanceof SyntaxError) {
            const newDelta2 = annotationNotesRef.current.value;
            annotationNotesRef.current.getEditor().setText(newDelta2);
          }
        }
        try {
          const newDelta1 = reviewNotesRef.current.value != "" ? JSON.parse(reviewNotesRef.current.value) : "";
          reviewNotesRef.current.getEditor().setContents(newDelta1);
        } catch (err) {
          if (err instanceof SyntaxError) {
            const newDelta1 = reviewNotesRef.current.value;
            reviewNotesRef.current.getEditor().setText(newDelta1);
          }
        }
        setannotationtext(annotationNotesRef.current.getEditor().getText())
        setreviewtext(reviewNotesRef.current.getEditor().getText())

      }
    });
  }
  }, [taskId]);

  const resetNotes = () => {
    if (typeof window !== "undefined"&& annotationNotesRef.current && reviewNotesRef.current) {
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
      getTaskAssignedUsers(taskData).then(res => setAssignedUsers(res));
    }
    taskData?.id && showAssignedUsers();
  }, [taskData]);

  const onNextAnnotation = async () => {
    // showLoader();
    setLoading(true)
    getNextProject(projectId, taskId).then((res) => {
      //   hideLoader();
      setLoading(false)
      // window.location.href = `/projects/${projectId}/task/${res.id}`;
      tasksComplete(res?.id || null);
    });
  };
  // let Annotation = AnnotationsTaskDetails.filter(
  //   (annotation) => annotation.annotation_type === 1
  // )[0];
  let Annotation = AnnotationsTaskDetails
  const onSkipTask = () => {
    // if (typeof window !== "undefined") {
    //   message.warning('Notes will not be saved for skipped tasks!');
    let annotation = annotations.find(
      (annotation) => !annotation.parentAnnotation
    );
    if (annotation) {
      // showLoader();
      patchAnnotation(
        null,
        annotation.id,
        load_time.current,
        annotation.lead_time,
        "skipped",
        JSON.stringify(annotationNotesRef?.current?.getEditor().getContents())
      ).then(() => {
        getNextProject(projectId, taskData.id).then((res) => {
          // hideLoader();
          tasksComplete(res?.id || null);
        });
      });
    // }
  }
  }


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
    setLoading(true);
    setAutoSave(false);
    const PatchAPIdata = {
      annotation_status: value,
      annotation_notes: JSON.stringify(annotationNotesRef?.current?.getEditor().getContents()),
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0)
    };
    if (["draft", "skipped"].includes(value)) {
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




  const filterAnnotations = (
    annotations,
    user,

  ) => {
    let disableSkip = false;
    let disableUpdate = false;
    let disableDraft = false;
    let filteredAnnotations = annotations;
    let userAnnotation = annotations.find((annotation) => {
      return annotation.completed_by === user.id && !annotation.parent_annotation;
    });
    let userAnnotationData = annotations.find(
      (annotation) =>
        annotation.annotation_type === 2
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
          setFilterMessage(
            "This is the Super Checker's Annotation in read only mode"
          );
          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
        } else if (
          review &&
          [
            "skipped",
            "draft",
            "rejected",
            "unreviewed",
          ].includes(review.annotation_status)
        ) {
          filteredAnnotations = [userAnnotation];
          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
          setFilterMessage("This task is being reviewed by the reviewer");
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
          setFilterMessage("This is the Reviewer's Annotation in read only mode");
        } else {
          filteredAnnotations = [userAnnotation];
        }
      }
      else if (
        userAnnotationData &&
        [
          "draft",
        ].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        setFilterMessage("Skip button is disabled, since the task is being reviewed");
      }
      else if (
        userAnnotation &&
        [
          "to_be_revised"
        ].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        setDisableButton(true);
        setFilterMessage("Skip button is disabled, since the task is being reviewed");
      }

      else {
        filteredAnnotations = [userAnnotation];
      }
    } else if ([4, 5, 6].includes(user.role)) {
      // filteredAnnotations = annotations.filter((a) => a.annotation_type === 1);
      filteredAnnotations = AnnotationsTaskDetails
      disableDraft = true;
      disableSkip = true;
      disableUpdate = true;
    }
    setAnnotations(filteredAnnotations);
    setDisableBtns(disableDraft);
    setDisableUpdateButton(disableUpdate);
    setdisableSkipButton(disableSkip);
    return [
      filteredAnnotations,
      disableDraft,
      disableSkip,
      disableUpdate,
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
      !res.ok ||
      resp?.data?.audio_url === "" ||
      resp?.data?.audio_url === null
    ) {
      setLoading(true);
      setSnackbarInfo({
        open: true,
        message: "Audio Server is down, please try after sometime",
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

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
    }
  }, [AnnotationsTaskDetails]);

  let componentToRender;
  switch (ProjectDetails.project_type) {
    case 'InstructionDrivenChat':
      componentToRender = <InstructionDrivenChatPage />;
      break;
    case 'ModelInteractionEvaluation':
      componentToRender = <ModelInteractionEvaluation />;
      break;
    default:
      componentToRender = null;
      break;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item >
          <Box
            sx={{
              // borderRadius: "20px",
              padding: "10px",
              marginLeft: "5px"
            }}
          >
            {!loading && <Button
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
            </Button>}
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
            {!loading && (
              <Button
                endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDown />}
                variant="contained"
                color={
                  reviewtext.trim().length === 0 ? "primary" : "success"
                }
                onClick={handleCollapseClick}
              style={{ backgroundColor:"#bf360c"}}
              >
                Notes {reviewtext.trim().length === 0 ? "" : "*"}
              </Button>
            )}

            <div
              // className={styles.collapse}
              style={{
                display: showNotes ? "block" : "none",
                paddingBottom: "16px",

              }}
            >
              <ReactQuill
                ref={annotationNotesRef}
                modules={modules}
                formats={formats}
                bounds={"#note"}
                placeholder="Annotation Notes"
              ></ReactQuill>
              <ReactQuill
                ref={reviewNotesRef}
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
              style={{ marginLeft: "10px" ,backgroundColor:"#bf360c"}}
              endIcon={showGlossary ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              onClick={handleGlossaryClick}
            >
              Glossary
            </Button>
            <div
            style={{
              display: showGlossary ? "block" : "none",
              paddingBottom: "16px",
            }}
          >
            <Glossary taskData={taskData} />
          </div>
            </Box>
            <Grid container justifyContent="center" spacing={3} style={{ display: "flex", width: "100%" ,marginTop:"3px",marginBottom:"25px"}}>
              <Grid item >
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
                        backgroundColor:"white"
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

              {(disableBtns && taskData && taskData.annotation_users.some(
                (user) => user === userData.id
              )) || (!disableBtns && taskData && taskData.annotation_users.some(
                (user) => user === userData.id
              )) ? (
                <Grid item >
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
                        borderRadius:"5px",
                        border:"0px",
                        pt: 2,
                        pb: 2,
                        backgroundColor:"#ffe0b2"
                      }}
                    // className="lsf-button"
                    >
                      Draft
                    </Button>
                  </Tooltip>
                </Grid>
              ) : null}

              <Grid item >
                <Tooltip title="Go to next task">
                  <Button
                    value="Next"
                    type="default"
                    onClick={() => onNextAnnotation("next", getNextTask?.id)}
                    style={{
                      minWidth: "150px",
                      color: "black",
                        borderRadius:"5px",
                      pt: 2,
                      pb: 2,
                      backgroundColor:"#ffe0b2"
                    }}
                  >
                    Next
                  </Button>
                </Tooltip>
              </Grid>
              {(disableSkipButton && taskData && taskData.annotation_users.some(
                (user) => user === userData.id
              )) || (!disableSkipButton && taskData && taskData.annotation_users.some(
                (user) => user === userData.id
              )) ? (
                <Grid item>
                  <Tooltip title="skip to next task">
                    <Button
                      value="Skip"
                      type="default"
                      variant="outlined"
                      onClick={() => onSkipTask()}
                      style={{
                        minWidth: "150px",
                        color: "black",
                        borderRadius:"5px",
                        border:"0px",
                        pt: 2,
                        pb: 2,
                        backgroundColor:"#ffe0b2"
                      }}
                    // className="lsf-button"
                    >
                      Skip
                    </Button>
                  </Tooltip>
                  </Grid>) : null}
              {(disableUpdateButton && taskData && taskData.annotation_users.some(
                (user) => user === userData.id
              )) || (!disableUpdateButton && taskData && taskData.annotation_users.some(
                (user) => user === userData.id
              )) ? (
                <Grid item >
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
                        backgroundColor: "#ee6633",
                        color: "black",
                        borderRadius:"10px",
                        pt: 2,
                      }}
                    >
                      Update
                    </Button>
                  </Tooltip>
                </Grid>
              ) : null}
              {/* </Box> */}
            </Grid>
            {filterMessage && (
              <Alert severity="info" sx={{ ml: 2, mb: 2, width: "95%" }}>
                {filterMessage}
              </Alert>
            )}
        </Grid>
        <Grid item container>  {componentToRender} </Grid>


      </Grid>

    </>


  );
};


export default AnnotatePage;
