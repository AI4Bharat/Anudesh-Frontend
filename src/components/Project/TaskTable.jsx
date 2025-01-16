// TaskTable

import MUIDataTable from "mui-datatables";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import CustomButton from "../common/Button";
// import APITransport from "../../../../redux/actions/apitransport/apitransport";
import {
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  ThemeProvider,
} from "@mui/material";
import tableTheme from "../../themes/tableTheme";
import DatasetStyle from "../../styles/dataset";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterList from "./FilterList";
import CustomizedSnackbars from "../../components/common/Snackbar";
import SearchIcon from "@mui/icons-material/Search";
import SearchPopup from "./SearchPopup";
import { snakeToTitleCase } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import ColumnList from "../common/ColumnList";
import Spinner from "../../components/common/Spinner";
import OutlinedTextField from "../common/OutlinedTextField";
import roles from "../../utils/Role";
import TextField from "@mui/material/TextField";
import { fetchTasksByProjectId } from "@/Lib/Features/projects/GetTasksByProjectId";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";
import PullNewBatchAPI from "@/app/actions/api/Projects/PullNewBatchAPI";
import PullNewReviewBatchAPI from "@/app/actions/api/Projects/PullNewReviewBatchAPI";
import DeallocateTasksAPI from "@/app/actions/api/Projects/DeallocateTasksAPI";
import DeallocateReviewTasksAPI from "@/app/actions/api/Projects/DeallocateReviewTasksAPI";
import { fetchNextTask } from "@/Lib/Features/projects/getNextTask";
import { fetchFindAndReplaceWordsInAnnotation } from "@/Lib/Features/projects/getFindAndReplaceWordsInAnnotation";
import { setTaskFilter } from "@/Lib/Features/projects/getTaskFilter";
import FindAndReplaceDialog from "./FindAndReplaceDialog";
import LoginAPI from "@/app/actions/api/user/Login";
import ChatLang from "@/utils/Chatlang";
// import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";

const excludeSearch = ["status", "actions", "output_text"];
// const excludeCols = ["context", "input_language", "output_language", "language",
// "conversation_json", "source_conversation_json", "machine_translated_conversation_json", "speakers_json"
//  ];
const excludeCols = [
  "context",
  "input_language",
  "output_language",
  "conversation_json",
  "source_conversation_json",
  "machine_translated_conversation_json",
  "speakers_json",
  "language",
  "audio_url",
  "speaker_0_details",
  "interactions_json",
  "eval_form_json",
  "multiple_interaction_json",
  "speaker_1_details",
  "machine_transcribed_json",
  "unverified_conversation_json",
  "prediction_json",
  "ocr_prediction_json",
];
const TaskTable = (props) => {
  const classes = DatasetStyle();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // let location = useLocation();
  const taskList = useSelector(
    (state) => state.GetTasksByProjectId?.data?.result,
  );
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [OpenFindAndReplaceDialog, setOpenFindAndReplaceDialog] =
    useState(false);

  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const getProjectUsers = useSelector(
    (state) => state.getProjectDetails?.data.annotators,
  );

  const getProjectReviewers = useSelector(
    (state) => state.getProjectDetails?.data.annotation_reviewers,
  );
  const TaskFilter = useSelector((state) => state.getTaskFilter?.data);
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const userDetails = useSelector((state) => state.getLoggedInData?.data);
  const savedFilters = JSON.parse(localStorage.getItem("filters"));
  const columnsCheck = [
    { name: "id", label: "ID", defaultChecked: true },
    {
      name: "instructionData",
      label: "Instruction Data",
      defaultChecked: true,
    },
    { name: "language", label: "Language", defaultChecked: true },
    { name: "status", label: "Status", defaultChecked: true },
    { name: "otherColumn1", label: "Other Column 1", defaultChecked: false },
    { name: "otherColumn2", label: "Other Column 2", defaultChecked: false },
    // Add other columns as needed
  ];

  const filterData = {
    Status:
      ProjectDetails.project_stage == 2 ||
      ProjectDetails.project_stage == 3 ||
      ProjectDetails?.annotation_reviewers?.some(
        (reviewer) => reviewer.id === userDetails?.id,
      )
        ? props.type === "annotation"
          ? ["unlabeled", "skipped", "draft", "labeled", "to_be_revised"]
          : [
              "unreviewed",
              "accepted",
              "accepted_with_minor_changes",
              "accepted_with_major_changes",
              "to_be_revised",
              "draft",
              "skipped",
              "rejected",
            ]
        : ["unlabeled", "skipped", "labeled", "draft"],
    Annotators:
      ProjectDetails?.annotators?.length > 0
        ? ProjectDetails?.annotators?.map((el, i) => {
            return {
              label: el.username,
              value: el.id,
            };
          })
        : [],

    Reviewers:
      ProjectDetails?.annotation_reviewers?.length > 0
        ? ProjectDetails?.annotation_reviewers.map((el, i) => {
            return {
              label: el.username,
              value: el.id,
            };
          })
        : [],
  };
  const [pull, setpull] = useState(
    TaskFilter && TaskFilter.id === id && TaskFilter.type === props.type
      ? TaskFilter.pull
      : "All",
  );
  const pullvalue =
    pull == "Pulled By reviewer" || pull == "Pulled By SuperChecker"
      ? false
      : pull == "Not Pulled By reviewer" || pull == "Not Pulled By SuperChecker"
        ? true
        : "";

  const [rejected, setRejected] = useState(
    TaskFilter && TaskFilter.id === id && TaskFilter.type === props.type
      ? TaskFilter.rejected || false
      : false,
  );

  const [selectedFilters, setsSelectedFilters] = useState(
    props.type === "annotation"
      ? TaskFilter && TaskFilter.id === id && TaskFilter.type === props.type
        ? TaskFilter.selectedFilters
        : { annotation_status: filterData.Status[0], req_user: -1 }
      : TaskFilter && TaskFilter.id === id && TaskFilter.type === props.type
        ? TaskFilter.selectedFilters
        : { review_status: filterData.Status[0], req_user: -1 },
  );
  const NextTask = useSelector((state) => state?.getNextTask?.data);
  const [tasks, setTasks] = useState([]);
  const [pullSize, setPullSize] = useState(
    ProjectDetails.tasks_pull_count_per_batch * 0.5,
  );
  const [selectedStatus, setSelectedStatus] = useState(
    !!selectedFilters?.annotation_status
      ? selectedFilters?.annotation_status
      : selectedFilters.review_status,
  );
  const [pullDisabled, setPullDisabled] = useState("");
  const [deallocateDisabled, setDeallocateDisabled] = useState("");
  const apiLoading = useSelector(
    (state) => state.GetTasksByProjectId.status !== "succeeded",
  );
  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [deallocateDialog, setDeallocateDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [labellingStarted, setLabellingStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  /* eslint-disable react-hooks/exhaustive-deps */

  const getTaskListData = () => {
    const taskobj = {
      id: id,
      currentPageNumber: currentPageNumber,
      currentRowPerPage: currentRowPerPage,
      selectedFilters: selectedFilters,
      taskType: props.type,
      pullvalue: pullvalue,
      rejected: rejected,
      pull: pull,
    };
    dispatch(fetchTasksByProjectId(taskobj));
  };

  useEffect(() => {
    getTaskListData();
  }, [currentPageNumber, currentRowPerPage]);

  const fetchNewTasks = async () => {
    setLoading(true);
    const batchObj =
      props.type === "annotation"
        ? new PullNewBatchAPI(id, Math.round(pullSize))
        : new PullNewReviewBatchAPI(id, Math.round(pullSize));
    const res = await fetch(batchObj.apiEndPointAuto(), {
      method: "POST",
      body: JSON.stringify(batchObj.getBody()),
      headers: batchObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      if (resp?.message) {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
        if (
          ((props.type === "annotation" &&
            selectedFilters.annotation_status === "unlabeled") ||
            (props.type === "review" &&
              selectedFilters.review_status === "unreviewed")) &&
          currentPageNumber === 1
        ) {
          getTaskListData();
        } else {
          setsSelectedFilters({
            ...selectedFilters,
            task_status: props.type === "annotation" ? "unlabeled" : "labeled",
          });
          setCurrentPageNumber(1);
        }
        dispatch(fetchProjectDetails(id));
      }
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    getTaskListData();
    setLoading(false);
  };

  const unassignTasks = async () => {
    setDeallocateDialog(false);
    const deallocateObj =
      props.type === "annotation"
        ? new DeallocateTasksAPI(id, selectedFilters.annotation_status)
        : new DeallocateReviewTasksAPI(id, selectedFilters.review_status);
    const res = await fetch(deallocateObj.apiEndPointAuto(), {
      method: "POST",
      body: JSON.stringify(deallocateObj.getBody()),
      headers: deallocateObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      getTaskListData();
      setTimeout(() => {
        //window.location.reload();
      }, 1000);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.detail,
        variant: "error",
      });
    }
  };
  const labelAllTasks = () => {
    let search_filters = Object?.keys(selectedFilters)
      .filter((key) => key?.startsWith("search_"))
      .reduce((acc, curr) => {
        acc[curr] = selectedFilters[curr];
        return acc;
      }, {});
    if (typeof window !== "undefined") {
      localStorage.setItem("searchFilters", JSON.stringify(search_filters));
      localStorage.setItem("labelAll", true);
    }
    const datavalue = {
      annotation_status: selectedFilters?.annotation_status,
      mode: "annotation",
      ...(props.type === "review" && {
        mode: "review",
        annotation_status: selectedFilters?.review_status,
      }),
    };
    dispatch(
      fetchNextTask({
        projectId: id,
        projectObj: datavalue,
        null: null,
        type: props.type,
      }),
    );
    setLabellingStarted(true);
  };

  const totalTaskCount = useSelector(
    (state) => state.GetTasksByProjectId?.data.total_count,
  );

  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol(col);
  };

  const handleOpenFindAndReplace = () => {
    setOpenFindAndReplaceDialog(true);
  };

  const handleSubmitFindAndReplace = async () => {
    const ReplaceData = {
      user_id: userDetails.id,
      project_id: id,
      task_status:
        props.type === "annotation"
          ? selectedFilters.annotation_status
          : selectedFilters.review_status,
      annotation_type: props.type === "annotation" ? "annotation" : "review",
      find_words: find,
      replace_words: replace,
    };

    dispatch(
      fetchFindAndReplaceWordsInAnnotation({
        projectId: id,
        AnnotationObj: ReplaceData,
      }),
    );
    const res = await fetch(AnnotationObj.apiEndPointAuto(), {
      method: "POST",
      body: JSON.stringify(AnnotationObj.getBody()),
      headers: AnnotationObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("Stage", props.type);
    }
  }, []);

  const customColumnHead = (col) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          columnGap: "10px",
          flexGrow: "1",
          alignItems: "center",
        }}
      >
        {col.label}
        {!excludeSearch.includes(col.name) && (
          <IconButton
            sx={{ borderRadius: "100%" }}
            onClick={(e) => handleShowSearch(col.name, e)}
          >
            <SearchIcon id={col.name + "_btn"} />
          </IconButton>
        )}
      </Box>
    );
  };

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

  useEffect(() => {
    const payload = {
      id,
      selectedFilters,
      type: props.type,
      pull,
      rejected,
    };
    dispatch(setTaskFilter(payload));
    if (currentPageNumber !== 1) {
      setCurrentPageNumber(1);
    } else {
      getTaskListData();
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "labellingMode",
        props.type === "annotation"
          ? selectedFilters.annotation_status
          : selectedFilters.review_status,
      );
    }
  }, [selectedFilters, pull, rejected]);
  useEffect(() => {
    if (taskList?.length > 0 && taskList[0]?.data) {
      console.log(taskList);

      const data = taskList.map((el) => {
        const email = props.type === "review" ? el.annotator_mail : "";
        let row = [el.id, ...(!!email ? [el.annotator_mail] : [])];
        row.push(
          ...Object.keys(el.data)
            .filter((key) => !excludeCols.includes(key))
            .map((key) => {
              if (key === "meta_info_language") {
                return ChatLang[el.data[key]] || el.data[key];
              }
              return el.data[key];
            }),
        );
        props.type === "annotation" &&
          taskList[0].annotation_status &&
          row.push(el.annotation_status);
        props.type === "review" &&
          taskList[0].review_status &&
          row.push(el.review_status);
        if (
          ProjectDetails?.required_annotators_per_task > 1 &&
          taskList[0].input_data_id
        ) {
          row.push(el.input_data_id);
        }
        props.type === "annotation" &&
          row.push(
            <Link
              to={
                ProjectDetails?.project_type?.includes("Acoustic")
                  ? `AudioTranscriptionLandingPage/${el.id}`
                  : `task/${el.id}`
              }
              className={classes.link}
            >
              <CustomButton
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("labelAll");
                  }
                }}
                disabled={ProjectDetails.is_archived}
                sx={{ p: 1, borderRadius: 2 }}
                label={
                  <Typography sx={{ color: "#FFFFFF" }} variant="body2">
                    {props.type === "annotation" &&
                    ProjectDetails?.annotators?.some(
                      (a) => a.id === userDetails?.id,
                    )
                      ? "Annotate"
                      : "View"}
                  </Typography>
                }
              />
            </Link>,
          );
        props.type === "review" &&
          row.push(
            <Link
              to={
                ProjectDetails?.project_type?.includes("Acoustic")
                  ? `ReviewAudioTranscriptionLandingPage/${el.id}`
                  : `review/${el.id}`
              }
              className={classes.link}
            >
              <CustomButton
                disabled={ProjectDetails.is_archived}
                onClick={() => {
                  console.log(el);

                  localStorage.setItem("Task", JSON.stringify(el));
                  localStorage.removeItem("labelAll");
                }}
                sx={{ p: 1, borderRadius: 2 }}
                label={
                  <Typography sx={{ color: "#FFFFFF" }} variant="body2">
                    Review
                  </Typography>
                }
              />
            </Link>,
          );
        return row;
      });
      // let colList = ["id"];
      // colList.push(...Object.keys(taskList[0].data).filter(el => !excludeCols.includes(el) && !el.includes("_json")));

      const annotatorEmail = taskList[0]?.hasOwnProperty("annotator_mail");
      const email =
        props.type === "review" && annotatorEmail ? "Annotator Email" : "";
      let colList = ["id", ...(!!email ? [email] : [])];
      console.log(colList, taskList[0]);
      colList.push(
        ...Object.keys(taskList[0].data).filter(
          (el) => !excludeCols.includes(el),
        ),
      );
      taskList[0].task_status && colList.push("status");
      if (ProjectDetails?.required_annotators_per_task > 1) {
        if (taskList[0].input_data_id) {
          colList.push("Input_data_id");
        }
      }
      colList.push("actions");
      var defaultCheckedCols = [
        "id",
        "instruction_data",
        "meta_info_language",
        "status",
        "actions",
      ];

      const metaInfoMapping = {
        meta_info_language: "language",
        meta_info_domain: "domain",
        meta_info_intent: "intent",
      };
      const cols = colList.map((col) => {
        return {
          name: col,
          label: metaInfoMapping[col]
            ? snakeToTitleCase(metaInfoMapping[col])
            : snakeToTitleCase(col),
          defaultChecked: defaultCheckedCols.includes(col),
          options: {
            filter: false,
            sort: false,
            align: "center",
            customHeadLabelRender: customColumnHead,
          },
        };
      });
      setColumns(cols);

      setSelectedColumns(
        ProjectDetails?.project_type == "InstructionDrivenChat"
          ? colList.filter((col) => defaultCheckedCols.includes(col))
          : colList,
      );
      setTasks(data);
      console.log(data);
    } else {
      setTasks([]);
    }
  }, [taskList, ProjectDetails]);

  useEffect(() => {
    const newCols = columns.map((col) => {
      col.options.display = selectedColumns.includes(col.name)
        ? "true"
        : "false";
      return col;
    });
    setColumns(newCols);
  }, [selectedColumns]);

  useEffect(() => {
    if (ProjectDetails) {
      if (
        (props.type === "review" && ProjectDetails.labeled_task_count === 0) ||
        ProjectDetails.is_archived
      )
        setPullDisabled("No more unassigned tasks in this project");
      else if (pullDisabled === "No more unassigned tasks in this project")
        setPullDisabled("");
    }
  }, [ProjectDetails.labeled_task_count]);

  useEffect(() => {
    if (ProjectDetails) {
      if (
        (props.type === "annotation" &&
          ProjectDetails.unassigned_task_count === 0) ||
        ProjectDetails.is_archived
      )
        setPullDisabled("No more unassigned tasks in this project");
      else if (pullDisabled === "No more unassigned tasks in this project")
        setPullDisabled("");

      ProjectDetails.frozen_users?.forEach((user) => {
        if (user.id === userDetails?.id)
          setPullDisabled("You're no more a part of this project");
        else if (pullDisabled === "You're no more a part of this project")
          setPullDisabled("");
      });
      setPullSize(ProjectDetails.tasks_pull_count_per_batch * 0.5);
    }
  }, [
    ProjectDetails.unassigned_task_count,
    ProjectDetails.frozen_users,
    ProjectDetails.tasks_pull_count_per_batch,
    userDetails,
  ]);

  useEffect(() => {
    if (
      totalTaskCount &&
      ((props.type === "annotation" &&
        selectedFilters.annotation_status === "unlabeled") ||
        (props.type === "review" &&
          selectedFilters.review_status === "unreviewed")) &&
      totalTaskCount >= ProjectDetails?.max_pending_tasks_per_user &&
      Object.keys(selectedFilters).filter((key) => key.startsWith("search_")) ==
        []
    ) {
      setPullDisabled(
        `You have too many ${
          props.type === "annotation"
            ? selectedFilters.annotation_status
            : selectedFilters.review_status
        } tasks`,
      );
    } else if (
      pullDisabled === "You have too many unlabeled tasks" ||
      pullDisabled === "You have too many labeled tasks"
    ) {
      setPullDisabled("");
    }
  }, [
    totalTaskCount,
    ProjectDetails.max_pending_tasks_per_user,
    selectedFilters,
  ]);

  useEffect(() => {
    if (
      (((props.type === "annotation" &&
        selectedFilters.annotation_status === "unlabeled") ||
        (props.type === "review" &&
          selectedFilters.review_status === "unreviewed")) &&
        totalTaskCount === 0) ||
      ProjectDetails.is_archived
    ) {
      setDeallocateDisabled("No more tasks to deallocate");
    } else if (deallocateDisabled === "No more tasks to deallocate") {
      setDeallocateDisabled("");
    }
  }, [totalTaskCount, selectedFilters, ProjectDetails]);

  useEffect(() => {
    if (ProjectDetails?.project_type?.includes("Acoustic")) {
      if (labellingStarted && Object?.keys(NextTask)?.length > 0) {
        navigate(
          `/projects/${id}/${
            props.type === "annotation"
              ? "AudioTranscriptionLandingPage"
              : "ReviewAudioTranscriptionLandingPage"
          }/${NextTask?.id}`,
        );
      }
    } else {
      if (labellingStarted && Object?.keys(NextTask)?.length > 0) {
        navigate(
          `/projects/${id}/${props.type === "annotation" ? "task" : "review"}/${
            NextTask?.id
          }`,
        );
      }
    }
    //TODO: display no more tasks message
  }, [NextTask]);

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseFindAndReplace = () => {
    setOpenFindAndReplaceDialog(false);
  };

  const handleSearchClose = () => {
    setSearchAnchor(null);
  };

  const renderToolBar = () => {
    // const buttonSXStyle = { borderRadius: 2, margin: 2 }
    return (
      <Box className={classes.filterToolbarContainer} sx={{ height: "80px" }}>
        {/* {props.ProjectDetails?.project_type ===
          "ContextualTranslationEditing" && (
          <>
            {(props.type === "annotation" || props.type === "review") &&
              ((props.type === "annotation" &&
                selectedFilters.annotation_status === "labeled") ||
                selectedFilters.review_status === "accepted" ||
                selectedFilters.accepted_with_changes ===
                  "accepted_with_changes") && (
                <Grid container justifyContent="start" alignItems="center">
                  <Grid>
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      label="Required"
                    >
                      Find :
                    </Typography>
                  </Grid>
                  <Grid>
                    <OutlinedTextField
                      size="small"
                      name="find"
                      InputProps={{
                        style: { fontSize: "14px", width: "150px" },
                      }}
                      value={find}
                      onChange={(e) => setFind(e.target.value)}
                    />
                  </Grid>
                  <Grid>
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      label="Required"
                    >
                      Replace :
                    </Typography>
                  </Grid>
                  <Grid>
                    <OutlinedTextField
                      size="small"
                      name="replace"
                      InputProps={{
                        style: { fontSize: "14px", width: "150px" },
                      }}
                      value={replace}
                      onChange={(e) => setReplace(e.target.value)}
                    />
                  </Grid>
                  <Grid>
                    <CustomButton
                      sx={{
                        inlineSize: "max-content",
                        width: "50px",
                        borderRadius: "20px",
                        
                      }}
                      onClick={handleOpenFindAndReplace}
                      label="Submit"
                      disabled={find && replace  ? false : true}

                    />
                  </Grid>
                </Grid>
              )}
          </>
        )} */}

        {props.type === "annotation" &&
          (roles?.WorkspaceManager === userDetails?.role ||
            roles?.OrganizationOwner === userDetails?.role ||
            roles?.Admin === userDetails?.role) &&
          !getProjectUsers?.some(
            (annotator) => annotator.id === userDetails?.id,
          ) &&
          !getProjectReviewers?.some(
            (reviewer) => reviewer.id === userDetails?.id,
          ) &&
          !ProjectDetails?.review_supercheckers?.some(
            (reviewer) => reviewer.id === userDetails?.id,
          ) && (
            <FormControl size="small" sx={{ width: "30%", minWidth: "100px" }}>
              <InputLabel
                id="annotator-filter-label"
                sx={{
                  fontSize: "16px",
                  position: "inherit",
                  top: "23px",
                  left: "-20px",
                }}
              >
                Filter by Annotator
              </InputLabel>
              <Select
                labelId="annotator-filter-label"
                id="annotator-filter"
                value={selectedFilters.req_user}
                label="Filter by Annotator"
                onChange={(e) =>
                  setsSelectedFilters({
                    ...selectedFilters,
                    req_user: e.target.value,
                  })
                }
                sx={{ fontSize: "16px" }}
              >
                <MenuItem value={-1}>All</MenuItem>
                {filterData.Annotators.map((el, i) => (
                  <MenuItem key={i} value={el.value}>
                    {el.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        {props.type === "review" &&
          (roles?.WorkspaceManager === userDetails?.role ||
            roles?.OrganizationOwner === userDetails?.role ||
            roles?.Admin === userDetails?.role) &&
          !getProjectUsers?.some(
            (annotator) => annotator.id === userDetails?.id,
          ) &&
          !getProjectReviewers?.some(
            (reviewer) => reviewer.id === userDetails?.id,
          ) &&
          !ProjectDetails?.review_supercheckers?.some(
            (reviewer) => reviewer.id === userDetails?.id,
          ) && (
            <FormControl size="small" sx={{ width: "30%", minWidth: "100px" }}>
              <InputLabel
                id="reviewer-filter-label"
                sx={{
                  fontSize: "16px",
                  position: "inherit",
                  top: "23px",
                  left: "-25px",
                }}
              >
                Filter by Reviewer
              </InputLabel>
              <Select
                labelId="reviewer-filter-label"
                id="reviewer-filter"
                value={selectedFilters.req_user}
                label="Filter by Reviewer"
                onChange={(e) =>
                  setsSelectedFilters({
                    ...selectedFilters,
                    req_user: e.target.value,
                  })
                }
                sx={{ fontSize: "16px" }}
              >
                <MenuItem value="">All</MenuItem>
                {filterData.Reviewers?.map((el, i) => (
                  <MenuItem key={i} value={el.value}>
                    {el.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        <ColumnList
          columns={columns}
          setColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
        <Tooltip
          title={
            <span style={{ fontFamily: "Roboto, sans-serif" }}>
              Filter Table
            </span>
          }
        >
          <Button onClick={handleShowFilter}>
            <FilterListIcon />
          </Button>
        </Tooltip>
      </Box>
    );
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
        autoHideDuration={20000}
      />
    );
  };

  const options = {
    count: totalTaskCount,
    rowsPerPage: currentRowPerPage,
    page: currentPageNumber - 1,
    rowsPerPageOptions: [10, 25, 50, 100],
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "currentRowPerPage",
        displayRows: "OF",
      },
    },
    onChangePage: (currentPage) => {
      setCurrentPageNumber(currentPage + 1);
    },
    onChangeRowsPerPage: (rowPerPageCount) => {
      setCurrentPageNumber(1);
      setCurrentRowPerPage(rowPerPageCount);
    },
    filterType: "checkbox",
    selectableRows: "none",
    download: false,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    textLabels: {
      body: {
        noMatch: "No records ",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: {
        rowsPerPage: "Rows per page",
      },
      options: { sortDirection: "desc" },
    },
    jumpToPage: true,
    serverSide: true,
    customToolbar: renderToolBar,
  };

  if (typeof window !== "undefined") {
    var emailId = localStorage.getItem("email_id");
  }
  const [password, setPassword] = useState("");
  const handleConfirm = async () => {
    const apiObj = new LoginAPI(emailId, password);
    const res = await fetch(apiObj.apiEndPointAuto(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const rsp_data = await res.json();
    if (res.ok) {
      unassignTasks();
    } else {
      window.alert("Invalid credentials, please try again");
    }
  };
  return (
    <div>
      {((props.type === "annotation" &&
        ProjectDetails?.annotators?.some(
          (annotation) => annotation.id === userDetails?.id,
        )) ||
        (props.type === "review" &&
          ProjectDetails?.annotation_reviewers?.some(
            (reviewer) => reviewer.id === userDetails?.id,
          ))) &&
        (ProjectDetails.is_published ? (
          <Grid container direction="row" spacing={2} sx={{ mb: 2 }}>
            {((props.type === "annotation" &&
              selectedFilters.annotation_status === "unlabeled") ||
              selectedFilters.annotation_status === "draft" ||
              selectedFilters.annotation_status === "skipped" ||
              (props.type === "review" &&
                selectedFilters.review_status === "unreviewed") ||
              selectedFilters.review_status === "draft" ||
              selectedFilters.review_status === "skipped") && (
              <Grid item xs={12} sm={12} md={3}>
                <Tooltip title={deallocateDisabled}>
                  <Box>
                    <CustomButton
                      sx={{
                        p: 1,
                        width: "100%",
                        borderRadius: 2,
                        margin: "auto",
                      }}
                      label={"De-allocate Tasks"}
                      onClick={() => setDeallocateDialog(true)}
                      disabled={deallocateDisabled}
                      color={"warning"}
                    />
                  </Box>
                </Tooltip>
              </Grid>
            )}
            <Dialog
              open={deallocateDialog}
              onClose={() => setDeallocateDialog(false)}
              aria-labelledby="deallocate-dialog-title"
              aria-describedby="deallocate-dialog-description"
            >
              <DialogTitle id="deallocate-dialog-title">
                {"De-allocate Tasks?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  All{" "}
                  <snap style={{ color: "#1DA3CE" }}>
                    {props.type === "annotation"
                      ? selectedFilters.annotation_status
                      : selectedFilters.review_status}{" "}
                    tasks
                  </snap>{" "}
                  will be de-allocated from this project. Please be careful as
                  this action cannot be undone.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDeallocateDialog(false)}
                  variant="outlined"
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant="contained"
                  color="error"
                  autoFocus
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <Grid
              item
              xs={4}
              sm={4}
              md={
                (props.type === "annotation" &&
                  selectedFilters.annotation_status === "unlabeled") ||
                selectedFilters.annotation_status === "draft" ||
                selectedFilters.annotation_status === "skipped" ||
                (props.type === "review" &&
                  selectedFilters.review_status === "unreviewed") ||
                selectedFilters.review_status === "draft" ||
                selectedFilters.review_status === "skipped"
                  ? 2
                  : 3
              }
            >
              <FormControl size="small" sx={{ width: "100%" }}>
                <InputLabel
                  id="pull-select-label"
                  sx={{ fontSize: "16px", zIndex: 0 }}
                >
                  Pull Size
                </InputLabel>
                <Select
                  labelId="pull-select-label"
                  id="pull-select"
                  value={pullSize}
                  // defaultValue={5}
                  label="Pull Size"
                  onChange={(e) => setPullSize(e.target.value)}
                  disabled={pullDisabled}
                  sx={{ fontSize: "16px" }}
                >
                  <MenuItem
                    value={ProjectDetails?.tasks_pull_count_per_batch * 0.5}
                  >
                    {Math.round(
                      ProjectDetails?.tasks_pull_count_per_batch * 0.5,
                    )}
                  </MenuItem>
                  <MenuItem value={ProjectDetails?.tasks_pull_count_per_batch}>
                    {ProjectDetails?.tasks_pull_count_per_batch}
                  </MenuItem>
                  <MenuItem
                    value={ProjectDetails?.tasks_pull_count_per_batch * 1.5}
                  >
                    {Math.round(
                      ProjectDetails?.tasks_pull_count_per_batch * 1.5,
                    )}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={8}
              sm={8}
              md={
                (props.type === "annotation" &&
                  selectedFilters.annotation_status === "unlabeled") ||
                selectedFilters.annotation_status === "draft" ||
                selectedFilters.annotation_status === "skipped" ||
                (props.type === "review" &&
                  selectedFilters.review_status === "unreviewed") ||
                selectedFilters.review_status === "draft" ||
                selectedFilters.review_status === "skipped"
                  ? 3
                  : 4
              }
            >
              <Tooltip title={pullDisabled}>
                <Box>
                  <CustomButton
                    sx={{
                      p: 1,
                      width: "100%",
                      borderRadius: 2,
                      margin: "auto",
                    }}
                    label={"Pull New Batch"}
                    disabled={pullDisabled}
                    onClick={fetchNewTasks}
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={
                (props.type === "annotation" &&
                  selectedFilters.annotation_status === "unlabeled") ||
                selectedFilters.annotation_status === "draft" ||
                selectedFilters.annotation_status === "skipped" ||
                (props.type === "review" &&
                  selectedFilters.review_status === "unreviewed") ||
                selectedFilters.review_status === "draft" ||
                selectedFilters.review_status === "skipped"
                  ? 4
                  : 5
              }
            >
              <Tooltip
                title={
                  totalTaskCount === 0
                    ? props.type === "annotation"
                      ? "No more tasks to label"
                      : "No more tasks to review"
                    : ""
                }
              >
                <Box>
                  <CustomButton
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      margin: "auto",
                      width: "100%",
                    }}
                    label={
                      props.type === "annotation"
                        ? "Start Labelling Now"
                        : "Start reviewing now"
                    }
                    onClick={labelAllTasks}
                    disabled={
                      totalTaskCount === 0 || ProjectDetails.is_archived
                    }
                  />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        ) : (
          <></>
        ))}
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={""}
          data={tasks}
          columns={columns}
          options={options}
          // filter={false}
        />
      </ThemeProvider>
      {searchOpen && (
        <SearchPopup
          open={searchOpen}
          anchorEl={searchAnchor}
          handleClose={handleSearchClose}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          searchedCol={searchedCol}
        />
      )}
      {popoverOpen && (
        <FilterList
          id={filterId}
          open={popoverOpen}
          anchorEl={anchorEl}
          handleClose={handleClose}
          filterStatusData={filterData}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          pull={pull}
          setpull={setpull}
          rejected={rejected}
          setRejected={setRejected}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          // rejValue = {rejValue}
          pullvalue={pullvalue}
        />
      )}
      {OpenFindAndReplaceDialog && (
        <FindAndReplaceDialog
          OpenFindAndReplaceDialog={OpenFindAndReplaceDialog}
          handleCloseFindAndReplace={handleCloseFindAndReplace}
          find={find}
          replace={replace}
          selectedFilters={selectedFilters}
          Type={props.type}
          submit={() => handleSubmitFindAndReplace()}
        />
      )}

      {renderSnackBar()}
      {loading && <Spinner />}
    </div>
  );
};

export default TaskTable;
