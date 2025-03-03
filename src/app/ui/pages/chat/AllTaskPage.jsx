"use client";
import "./chat.css";
import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Box,
  Avatar,
  Typography,
  Tooltip,
  Button,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { translate } from "@/config/localisation";
import Textarea from "@/components/Chat/TextArea";
import headerStyle from "@/styles/Header";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dynamic from "next/dynamic";
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
import getTaskAssignedUsers from "@/utils/getTaskAssignedUsers";
import ModelInteractionEvaluation from "../model_response_evaluation/model_response_evaluation";
import PreferenceRanking from "../n-screen-preference-ranking/PreferenceRanking";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  },
);

const AllTaskPage = () => {
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
  const [currentInteraction, setCurrentInteraction] = useState({});
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
  const [taskDataArr, setTaskDataArr] = useState();
  const AnnotationsTaskDetails = useSelector(
    (state) => state.getAnnotationsTask?.data,
  );
  const [info, setInfo] = useState({});
  const getNextTask = useSelector((state) => state.getnextProject?.data);
  const taskData = useSelector((state) => state.getTaskDetails?.data);
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
  const [annotationtext, setannotationtext] = useState("");
  const [reviewtext, setreviewtext] = useState("");
  const [answered, setAnswered] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [forms, setForms] = useState([]);

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
    if (AnnotationsTaskDetails?.length > 0) {
      setAnnotations(AnnotationsTaskDetails);
      setLoading(false);



    }
  }, [AnnotationsTaskDetails]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      annotationNotesRef.current &&
      reviewNotesRef.current
    ) {
      if (AnnotationsTaskDetails && AnnotationsTaskDetails.length > 0) {
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
          tasksComplete(rsp_data?.id || null);
          getAnnotationsTaskData(rsp_data?.id);
          getTaskData(rsp_data?.id);
        }
      })
      .catch((error) => {
        setSnackbarInfo({
          open: true,
          message: "No more tasks",
          variant: "info",
        });
        setTimeout(() => {
          localStorage.removeItem("labelAll");
          window.location.replace(`/#/projects/${projectId}`);
        }, 1000);
      });
  };

  const tasksComplete = (id) => {
    if (id) {
      navigate(`/projects/${projectId}/Alltask/${id}`);
      window.location.reload(true);
    } else {
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
  };
  window.localStorage.setItem("TaskData", JSON.stringify(taskData));

  const getAnnotationsTaskData = (id) => {
    setLoading(true);
    dispatch(fetchAnnotationsTask(id));
  };

  const formatResponse = (response) => {
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

  const formatPrompt = (prompt) => {
    const lines = prompt.split("\n");
    const markdownString = lines.join("  \n");
    return markdownString;
  };

  useEffect(() => {
    getAnnotationsTaskData(taskId);
    getProjectDetails();
    getTaskData(taskId);
  }, []);

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
          key={`annotations-${annotations?.length}-${annotations?.[0]?.id || "default"
            }`}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          formatResponse={formatResponse}
          formatPrompt={formatPrompt}
          id={AnnotationsTaskDetails[0]}
          stage={"Alltask"}
          notes={annotationNotesRef}
          info={info}
          annotation={annotations}
        />
      );
      break;
    case "ModelInteractionEvaluation":
      componentToRender = (
        <ModelInteractionEvaluation
          key={`annotations-${annotations?.length}-${annotations?.[0]?.id || "default"
            }`}
          setCurrentInteraction={setCurrentInteraction}
          currentInteraction={currentInteraction}
          interactions={interactions}
          setInteractions={setInteractions}
          forms={forms}
          setForms={setForms}
          stage={"Alltask"}
          answered={answered}
          setAnswered={setAnswered}
          annotation={annotations}

        />
      );
      break;
    case "MultipleInteractionEvaluation":
      componentToRender = (
        <PreferenceRanking
          key={`annotations-${annotations?.length}-${annotations?.[0]?.id || "default"
            }`}
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
        />
      );
      break;
    default:
      componentToRender = null;
      break;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item>
          <Box
            sx={{
              // borderRadius: "20px",
              padding: "10px",
              marginLeft: "5px",
            }}
          >
            {!loading && (
              <Button
                value="Back to Project"
                startIcon={<ArrowBackIcon />}
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
            )}
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
            {!loading && (
              <Button
                endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDown />}
                variant="contained"
                color={reviewtext.trim().length === 0 ? "primary" : "success"}
                onClick={handleCollapseClick}
                style={{ backgroundColor: "#bf360c" }}
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
            spacing={3}
            style={{
              display: "flex",
              width: "100%",
              marginTop: "3px",
              marginBottom: "25px",
            }}
          >
            <Grid item>
              <LightTooltip
                title={
                  <div>
                    <div>
                      {Array.isArray(assignedUsers)
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
                      {annotations[0]?.annotation_type == 1 && `ANNOTATION ID: ${annotations[0]?.id}`}
                      {annotations[0]?.annotation_type == 2 && `REVIEW ID: ${annotations[0]?.id}`}
                      {annotations[0]?.annotation_type == 3 && `SUPERCHECK ID: ${annotations[0]?.id}`}
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
            {/* <Grid item>
              <Typography sx={{mt: 2, ml: 4, color: "grey",backgroundColor:"white",padding:"5px",borderRadius:"4px",mb:"10px"}}>
               *{ProjectDetails.project_type} # {taskId} 
       
            </Typography>
            </Grid> */}

            {/* {(disableBtns && taskData && taskData.annotation_users.some(
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
              ) : null} */}

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
                    pt: 2,
                    pb: 2,
                    backgroundColor: "#ffe0b2",
                  }}
                >
                  Next
                </Button>
              </Tooltip>
            </Grid>
            {/* {(disableSkipButton && taskData && taskData.annotation_users.some(
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
                  </Grid>) : null} */}
            {/* {(disableUpdateButton && taskData && taskData.annotation_users.some(
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
              ) : null} */}
            {/* </Box> */}
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

export default AllTaskPage;
