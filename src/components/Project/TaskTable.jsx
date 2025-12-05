import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CustomButton from "../common/Button";
import Button from "@mui/material/Button";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Skeleton from "@mui/material/Skeleton";
import _ from 'lodash';

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import TablePagination from "@mui/material/TablePagination";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { tooltipClasses } from "@mui/material/Tooltip";
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
import { setPageFilter } from "@/Lib/Features/user/taskPaginationSlice";
import { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";
import TasksassignDialog from "./taskassign";
import ReviewTasksTable from "./prefered_members";
const defaultColumns = [
  "id",
  "annotator_mail",
  "instruction_data",
  "meta_info_language",
  "revision_count",
  "rejection_count",
  "status",
  "actions",
];

const TruncatedContent = styled(Box)(({ theme, expanded }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: expanded ? "unset" : 3,
  WebkitBoxOrient: "vertical",
  lineHeight: "1.5em",
  maxHeight: expanded ? "9900px" : "4.5em",
  transition: "max-height 1.8s ease-in-out",
}));

const RowContainer = styled(Box)(({ theme, expanded }) => ({
  cursor: "pointer",
  transition: "all 1.8s ease-in-out",
}));

const excludeSearch = ["status", "actions", "output_text", "revision_count", "rejection_count"];

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
  "model"
];

const MUIDataTable = dynamic(() => import("mui-datatables"), {
  ssr: false,
  loading: () => (
    <Skeleton
      variant="rectangular"
      height={400}
      sx={{
        mx: 2,
        my: 3,
        borderRadius: "4px",
        transform: "none",
      }}
    />
  ),
});

const TaskTable = (props) => {
  const classes = DatasetStyle();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const taskList = useSelector(
    (state) => state.GetTasksByProjectId?.data?.result,
  );
  const [displayWidth, setDisplayWidth] = useState(0);
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
  
  const project_stage = useSelector(
    (state) => state.getProjectDetails?.data?.project_stage
  );

  const getProjectReviewers = useSelector(
    (state) => state.getProjectDetails?.data.annotation_reviewers,
  );

  const AllTaskFilters = useSelector((state) => state.getTaskFilter?.data);
  const TaskFilter = AllTaskFilters?.find(
    (filter) => filter.id === id && filter.type === props.type,
  )
  const AllPageFilters = useSelector((state) => state.taskPaginationSlice?.data);

  const currentPageFromState = useSelector(state => {
    const filters = state.taskPaginationSlice?.data || [];
    const matchingFilter = filters.find(filter =>
      filter.id === id && filter.type === props.type
    );
    return matchingFilter?.page || 1;
  });


  const [currentPageNumber, setCurrentPageNumber] = useState(currentPageFromState);


  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const userDetails = useSelector((state) => state.getLoggedInData?.data);

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
  const [expandedRow, setExpandedRow] = useState(null);

  const getTaskListData = () => {
    const existingFilter = AllPageFilters?.find(filter =>
      filter.id === id &&
      filter.type === props.type &&
      _.isEqual(filter.selectedFilters, selectedFilters)
    );



    const taskobj = {
      id: id,
      currentPageNumber: existingFilter?.page || 1,
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

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);


  const fetchNewTasks = async () => {
    setLoading(true);
    const batchObj =
      props.type === "annotation"
        ? new PullNewBatchAPI(id, Math.round(pullSize))
        : new PullNewReviewBatchAPI(id, Math.round(pullSize));
    const res = await fetch(batchObj.apiEndPoint(), {
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
    const res = await fetch(deallocateObj.apiEndPoint(), {
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
      setTimeout(() => { }, 1000);
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
    const res = await fetch(AnnotationObj.apiEndPoint(), {
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
    dispatch(setTaskFilter({
      id,
      selectedFilters,
      type: props.type,
      pull,
      rejected,
    }))
    const existingFilter = AllPageFilters?.find(filter =>
      filter.id === id &&
      filter.type === props.type &&
      _.isEqual(filter.selectedFilters, selectedFilters)
    );


    if (!existingFilter) {
      dispatch(setPageFilter({
        id,
        selectedFilters,
        type: props.type,
        pull,
        rejected,
        page: 1
      }))


    } else {
      dispatch(setPageFilter({
        id,
        selectedFilters,
        type: props.type,
        pull,
        rejected,
        page: existingFilter?.page
      }))

    }
    getTaskListData();


    if (typeof window !== "undefined") {
      localStorage.setItem(
        "labellingMode",
        props.type === "annotation"
          ? selectedFilters.annotation_status
          : selectedFilters.review_status
      );
    }
    localStorage.setItem(
      "filters",
      JSON.stringify({
        selectedStatus,
        pull,
        rejected,
      }),
    );
  }, [selectedFilters, pull, rejected]);
  useEffect(() => {
    if (taskList?.length > 0 && taskList[0]?.data) {
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

        if (props.type === "annotation" && taskList[0].revision_loop_count) {
          row.push(el.revision_loop_count?.review_count); 
        } else if (props.type === "review" && taskList[0].revision_loop_count) {
          row.push(el.revision_loop_count?.review_count);          
        }
        if (props.type === "review" && taskList[0].revision_loop_count && project_stage ===3) {
          row.push(el.revision_loop_count?.super_check_count);
        }

        if (props.type === "annotation" && taskList[0].annotation_status) {
          row.push(el.annotation_status);
        } else if (props.type === "review" && taskList[0].review_status) {
          row.push(el.review_status);
        }
        if (
          ProjectDetails?.required_annotators_per_task > 1 &&
          taskList[0].input_data_id
        ) {
          row.push(el.input_data_id);
        }

        const actionLink =
          props.type === "annotation"
            ? ProjectDetails?.project_type?.includes("Acoustic")
              ? `AudioTranscriptionLandingPage/${el.id}`
              : `task/${el.id}`
            : ProjectDetails?.project_type?.includes("Acoustic")
              ? `ReviewAudioTranscriptionLandingPage/${el.id}`
              : `review/${el.id}`;

        const actionLabel =
          props.type === "annotation"
            ? ProjectDetails?.annotators?.some((a) => a.id === userDetails?.id)
              ? "Annotate"
              : "View"
            : "Review";

        row.push(
          <Link to={actionLink} className={classes.link}>
            <CustomButton
              onClick={() => localStorage.removeItem("labelAll")}
              disabled={ProjectDetails.is_archived}
              sx={{ p: 1, borderRadius: 2 }}
              label={
                <Typography sx={{ color: "#FFFFFF" }} variant="body2">
                  {actionLabel}
                </Typography>
              }
            />
          </Link>,
        );
        return row;
      });
      const annotatorEmail = taskList[0]?.annotator_mail;
      const showEmail = ProjectDetails?.conceal === false || annotatorEmail;
      const email =
        props.type === "review" && showEmail ? "annotator_mail" : "";
      let colList = ["id", ...(!!email ? [email] : [])];
      colList.push(
        ...Object.keys(taskList[0].data).filter(
          (el) => !excludeCols.includes(el),
        ),
      );
      
      if (props.type === "annotation" && taskList[0].revision_loop_count) {
        colList.push("revision_count");
      } else if (props.type === "review" && taskList[0].revision_loop_count) {
        colList.push("revision_count");
      } 
      if (props.type === "review" && taskList[0].revision_loop_count && project_stage ===3) {
        colList.push("rejection_count");
      }

      taskList[0].task_status && colList.push("status");
      if (ProjectDetails?.required_annotators_per_task > 1) {
        if (taskList[0].input_data_id) {
          colList.push("Input_data_id");
        }
      }
      colList.push("actions");

      if (selectedColumns.length === 0) {
        columns.length === 0 ? setSelectedColumns(defaultColumns) : setSelectedColumns(columns);
      }
      const metaInfoMapping = {
        meta_info_language: "language",
        meta_info_domain: "domain",
        meta_info_intent: "intent",
      };
      const cols = colList.map((col) => {
        const isSelectedColumn = selectedColumns.includes(col);
        return {
          name: col,
          label: metaInfoMapping[col]
            ? snakeToTitleCase(metaInfoMapping[col])
            : snakeToTitleCase(col),
          options: {
            filter: false,
            sort: false,
            align: "center",
            display: isSelectedColumn ? "true" : "false",
            customHeadLabelRender: customColumnHead,
            customBodyRender: (value, tableMeta) => {
              const rowIndex = tableMeta.rowIndex;
              const isExpanded = expandedRow === rowIndex;

              return (
                <RowContainer
                  expanded={isExpanded}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedRow((prevExpanded) =>
                      prevExpanded === rowIndex ? null : rowIndex,
                    );
                  }}
                >
                  <TruncatedContent expanded={isExpanded}>
                    {value}
                  </TruncatedContent>
                </RowContainer>
              );
            },
          },
        };
      });
      setColumns(cols);
      setTasks(data);
    } else {
      setTasks([]);
    }
  }, [taskList, ProjectDetails, expandedRow]);

  useEffect(() => {
    if (columns.length > 0 && selectedColumns.length > 0) {
      const newCols = columns.map((col) => ({
        ...col,
        options: {
          ...col.options,
          display: selectedColumns.includes(col.name) ? "true" : "false",
        },
      }));
      if (JSON.stringify(newCols) !== JSON.stringify(columns)) {
        setColumns(newCols);
      }
    }
  }, [selectedColumns, columns]);

  useEffect(() => {
    if (ProjectDetails) {
      if (
        (props.type === "review" && ProjectDetails.labeled_task_count === 0) ||
        ProjectDetails.is_archived
      )
        setPullDisabled("No more unassigned tasks in this project");
      else if (pullDisabled === "No more unassigned tasks in this project")
        setPullDisabled("");
      if (userDetails?.guest_user === true) {
        setPullDisabled("disable for guest user");
      }
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
      if (userDetails?.guest_user === true) {
        setPullDisabled("disable for guest user");
      }
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
        `You have too many ${props.type === "annotation"
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
          `/projects/${id}/${props.type === "annotation"
            ? "AudioTranscriptionLandingPage"
            : "ReviewAudioTranscriptionLandingPage"
          }/${NextTask?.id}`,
        );
      }
    } else {
      if (labellingStarted && Object?.keys(NextTask)?.length > 0) {
        navigate(
          `/projects/${id}/${props.type === "annotation" ? "task" : "review"}/${NextTask?.id
          }`,
        );
      }
    }
  }, [NextTask]);

  const handleShowFilter = (event) => {
    event.stopPropagation();
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

  const areFiltersApplied = (filters) => {
    if (
      (filters.annotation_status && filters.annotation_status === "unlabeled") ||
      (filters.review_status && filters.review_status === "unreviewed")
    ) {
      return false;
    }
    return Object.values(filters).some((value) => value !== "");
  };

  const filtersApplied = areFiltersApplied(selectedFilters);

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#e0e0e0",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 300,
      fontSize: theme.typography.pxToRem(12),
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "#e0e0e0",
    },
  }));

  const renderToolBar = () => {
    return (
      <Box className={classes.filterToolbarContainer} sx={{ height: "80px" }}>

        {props.type === "annotation" &&
          (roles?.WorkspaceManager === userDetails?.role ||
            roles?.OrganizationOwner === userDetails?.role ||
            roles?.Admin === userDetails?.role) &&
          !getProjectUsers?.some((annotator) => annotator.id === userDetails?.id) &&
          !getProjectReviewers?.some((reviewer) => reviewer.id === userDetails?.id) &&
          !ProjectDetails?.review_supercheckers?.some((reviewer) => reviewer.id === userDetails?.id) && (
            <FormControl size="small" sx={{ width: "30%", minWidth: "100px" }}>
              <InputLabel
                id="annotator-filter-label"
                sx={{ fontSize: "16px", position: "inherit", top: "23px", left: "-20px" }}
              >
                Filter by Annotator
              </InputLabel>
              <Select
                labelId="annotator-filter-label"
                id="annotator-filter"
                value={selectedFilters.req_user}
                label="Filter by Annotator"
                onChange={(e) =>
                  setsSelectedFilters({ ...selectedFilters, req_user: e.target.value })
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
          !getProjectUsers?.some((annotator) => annotator.id === userDetails?.id) &&
          !getProjectReviewers?.some((reviewer) => reviewer.id === userDetails?.id) &&
          !ProjectDetails?.review_supercheckers?.some((reviewer) => reviewer.id === userDetails?.id) && (
            <>
              <FormControl size="small" sx={{ width: "30%", minWidth: "100px" }}>
                <InputLabel
                  id="reviewer-filter-label"
                  sx={{ fontSize: "16px", position: "inherit", top: "23px", left: "-25px" }}
                >
                  Filter by Reviewer
                </InputLabel>
                <Select
                  labelId="reviewer-filter-label"
                  id="reviewer-filter"
                  value={selectedFilters.req_user}
                  label="Filter by Reviewer"
                  onChange={(e) =>
                    setsSelectedFilters({ ...selectedFilters, req_user: e.target.value })
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

              <ReviewTasksTable />
            </>
          )}
        {props.type === "review" &&
          (
            roles?.WorkspaceManager === userDetails?.role ||
            roles?.OrganizationOwner === userDetails?.role ||
            roles?.Admin === userDetails?.role ||
            roles?.Reviewer === userDetails?.role // ✅ allow reviewers too
          ) &&
          !ProjectDetails?.review_supercheckers?.some(
            (r) => r.id === userDetails?.id
          ) && (
            <ReviewTasksTable />
          )}
        <ColumnList
          columns={columns}
          setColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
        <div style={{ position: "relative" }}>
          {filtersApplied && (
            <InfoIcon
              color="primary"
              fontSize="small"
              sx={{ position: "absolute", top: -4, right: -4 }}
            />
          )}
          <Button sx={{ position: "relative" }} onClick={handleShowFilter}>
            <FilterListIcon sx={{ color: "#515A5A" }} />
            <CustomTooltip
              title={
                filtersApplied ? (
                  <Box
                    sx={{
                      padding: "5px",
                      maxWidth: "300px",
                      fontSize: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    {selectedFilters.annotation_status && (
                      <div>
                        <strong>Annotation Status:</strong>{" "}
                        {selectedFilters.annotation_status}
                      </div>
                    )}
                    {selectedFilters.review_status && (
                      <div>
                        <strong>Review Status:</strong>{" "}
                        {selectedFilters.review_status}
                      </div>
                    )}
                    {selectedFilters.req_user !== -1 && (
                      <div>
                        <strong>Assigned User:</strong> {selectedFilters.req_user}
                      </div>
                    )}
                    {pull !== "All" && (
                      <div>
                        <strong>Pull Status:</strong> {pull}
                      </div>
                    )}
                    {rejected && (
                      <div>
                        <strong>Rejected:</strong> {rejected ? "Yes" : "No"}
                      </div>
                    )}
                  </Box>
                ) : (
                  <span style={{ fontFamily: "Roboto, sans-serif" }}>
                    Filter Table
                  </span>
                )
              }
              disableInteractive
            >
            </CustomTooltip>
          </Button>
        </div>
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
  const CustomFooter = ({
    count,
    page,
    rowsPerPage,
    changeRowsPerPage,
    changePage,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },
          alignItems: "center",
          padding: "10px",
          gap: {
            xs: "10px",
            md: "20px",
          },
        }}
      >
        {/* Pagination Controls */}
        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => changePage(newPage)}
          onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
          sx={{
            "& .MuiTablePagination-actions": {
              marginLeft: "0px",
            },
            "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input":
            {
              marginRight: "10px",
            },
          }}
        />

        {/* Jump to Page */}
        <div>
          <label
            style={{
              marginRight: "5px",
              fontSize: "0.83rem",
            }}
          >
            Jump to Page:
          </label>
          <Select
            value={page + 1}
            onChange={(e) => changePage(Number(e.target.value) - 1)}
            sx={{
              fontSize: "0.8rem",
              padding: "4px",
              height: "32px",
            }}
          >
            {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
              <MenuItem key={i} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Box>
    );
  };
  const handlePageChange = (newPage) => {
    const page = newPage + 1;
    setCurrentPageNumber(page);
    dispatch(setPageFilter({
      id,
      type: props.type,
      selectedFilters,
      pull,
      rejected,
      page
    }));
    getTaskListData();

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
      handlePageChange(currentPage)
    },
    onChangeRowsPerPage: (rowPerPageCount) => {
      setCurrentPageNumber(1);
      dispatch(setPageFilter({ projectId: id, page: 1 }));
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
    responsive: "vertical",
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),
    rowHover: false,
    onRowClick: null,
  };

  if (typeof window !== "undefined") {
    var emailId = localStorage.getItem("email_id");
  }
  const [password, setPassword] = useState("");
  const handleConfirm = async () => {
    const apiObj = new LoginAPI(emailId, password);
    const res = await fetch(apiObj.apiEndPoint(), {
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
              md={props.type === "review" ? 1 :
                ((props.type === "annotation" &&
                  selectedFilters.annotation_status === "unlabeled") ||
                  selectedFilters.annotation_status === "draft" ||
                  selectedFilters.annotation_status === "skipped" ||
                  (props.type === "review" &&
                    selectedFilters.review_status === "unreviewed") ||
                  selectedFilters.review_status === "draft" ||
                  selectedFilters.review_status === "skipped"
                  ? 2
                  : 3)
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
              md={props.type === "review" ? 2 :
                ((props.type === "annotation" &&
                  selectedFilters.annotation_status === "unlabeled") ||
                  selectedFilters.annotation_status === "draft" ||
                  selectedFilters.annotation_status === "skipped" ||
                  (props.type === "review" &&
                    selectedFilters.review_status === "unreviewed") ||
                  selectedFilters.review_status === "draft" ||
                  selectedFilters.review_status === "skipped"
                  ? 3
                  : 4)
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
            {props.type === "review" &&
              <Grid
                item
                xs={8}
                sm={8}
                md={selectedFilters.review_status === "unreviewed" || selectedFilters.review_status === "draft" || selectedFilters.review_status === "skipped" ? 2 : 2}
              >
                <Tooltip title={pullDisabled}>
                  <Box>
                    <TasksassignDialog disabled={pullDisabled} />
                  </Box>
                </Tooltip>
              </Grid>}
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
          key={`table-${displayWidth}`}
          title={""}
          data={tasks}
          columns={columns}
          options={{
            ...options,
            tableBodyHeight: `${typeof window !== "undefined" ? window.innerHeight - 200 : 400
              }px`,
          }}
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
