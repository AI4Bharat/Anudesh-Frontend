import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import CustomizedSnackbars from "../common/Snackbar";
import tableTheme from "../../themes/tableTheme";
import ColumnList from "../../components/common/ColumnList";
import DatasetStyle from "../../styles/dataset";
import { snakeToTitleCase } from "../../utils/utils";
import FilterListIcon from "@mui/icons-material/FilterList";
import CustomButton from "../../components/common/Button";
import SearchIcon from "@mui/icons-material/Search";
import SearchPopup from "./SearchPopup";
import SuperCheckerFilter from "../Project/SuperCheckerFilter";
import roles from "../../utils/Role";
import TextField from "@mui/material/TextField";
import LoginAPI from "../../app/actions/api/user/Login";
import { fetchTasksByProjectId } from "@/Lib/Features/projects/GetTasksByProjectId";
import DeallocateSuperCheckerTasksAPI from "@/app/actions/api/Projects/DeallocateSuperCheckerTasksAPI";
import PullNewSuperCheckerBatchAPI from "@/app/actions/api/Projects/PullNewSuperCheckerBatchAPI";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";
import { fetchNextTask } from "@/Lib/Features/projects/getNextTask";
import { setTaskFilter } from "@/Lib/Features/projects/getTaskFilter";
import ChatLang from "@/utils/Chatlang";

const defaultColumns = [
  "id",
  "instruction_data",
  "meta_info_language",
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

const excludeSearch = ["status", "actions", "output_text"];

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

const SuperCheckerTasks = (props) => {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [displayWidth, setDisplayWidth] = useState(0);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [deallocateDialog, setDeallocateDialog] = useState(false);
  const [deallocateDisabled, setDeallocateDisabled] = useState("");
  const [pullDisabled, setPullDisabled] = useState("");
  const [labellingStarted, setLabellingStarted] = useState(false);

  const AllTaskFilters = useSelector((state) => state.getTaskFilter?.data);
  const TaskFilter = AllTaskFilters.find(
    (filter) => filter.id === id && filter.type === props.type,
  ); 
  const [expandedRow, setExpandedRow] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const totalTaskCount = useSelector(
    (state) => state.GetTasksByProjectId.data.total_count,
  );
  const userDetails = useSelector((state) => state.getLoggedInData.data);
  const NextTask = useSelector((state) => state?.getNextTask?.data);
  /* eslint-disable react-hooks/exhaustive-deps */

  const filterData = {
    Status: [
      "unvalidated",
      "validated",
      "validated_with_changes",
      "skipped",
      "draft",
      "rejected",
    ],
    SuperChecker:
      ProjectDetails?.review_supercheckers?.length > 0
        ? ProjectDetails?.review_supercheckers?.map((el, i) => {
            return {
              label: el.username,
              value: el.id,
            };
          })
        : [],
  };

  const [selectedFilters, setsSelectedFilters] = useState(
    TaskFilter && TaskFilter.id === id && TaskFilter.type === props.type
      ? TaskFilter.selectedFilters
      : { supercheck_status: filterData.Status[0], req_user: -1 },
  );
  const [pullSize, setPullSize] = useState(
    ProjectDetails.tasks_pull_count_per_batch * 0.5,
  );

  const taskList = useSelector(
    (state) => state.GetTasksByProjectId?.data.result,
  );
  if (typeof window !== "undefined") {
    localStorage.setItem("projectData", JSON.stringify(ProjectDetails));
  }
  const getTaskListData = () => {
    dispatch(
      fetchTasksByProjectId({
        id: id,
        currentPageNumber: currentPageNumber,
        currentRowPerPage: currentRowPerPage,
        selectedFilters: selectedFilters,
        taskType: props.type,
      }),
    );
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

  useEffect(() => {
    if (
      (props.type === "superChecker" &&
        selectedFilters.supercheck_status === "unvalidated" &&
        totalTaskCount === 0) ||
      ProjectDetails.is_archived
    ) {
      setDeallocateDisabled("No more tasks to deallocate");
    } else if (deallocateDisabled === "No more tasks to deallocate") {
      setDeallocateDisabled("");
    }
  }, [totalTaskCount, selectedFilters, ProjectDetails]);

  useEffect(() => {
    if (ProjectDetails) {
      if (
        (props.type === "superChecker" &&
          ProjectDetails.reviewed_task_count === 0) ||
        ProjectDetails.is_archived
      )
        setPullDisabled("No more unassigned tasks in this project");
      else if (pullDisabled === "No more unassigned tasks in this project")
        setPullDisabled("");
    }
  }, [ProjectDetails.reviewed_task_count]);

  useEffect(() => {
    if (ProjectDetails) {
      if (
        props.type === "superChecker" &&
        ProjectDetails.reviewed_task_count === 0
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
    ProjectDetails.reviewed_task_count,
    ProjectDetails.frozen_users,
    ProjectDetails.tasks_pull_count_per_batch,
    userDetails,
  ]);

  useEffect(() => {
    if (ProjectDetails?.project_type?.includes("Acoustic")) {
      if (labellingStarted && Object?.keys(NextTask)?.length > 0) {
        navigate(
          `/projects/${id}/SuperCheckerAudioTranscriptionLandingPage/${NextTask?.id}`,
        );
      }
    } else {
      if (labellingStarted && Object?.keys(NextTask)?.length > 0) {
        navigate(`/projects/${id}/SuperChecker/${NextTask?.id}`);
      }
    }
  }, [NextTask]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("SuperCheckerStage", props.type);
    }
  }, []);

  useEffect(() => {
    const payload = {
      id,
      selectedFilters,
      type: props.type,
      pull: "",
      rejected: "",
    };
    dispatch(setTaskFilter(payload));
    if (currentPageNumber !== 1) {
      setCurrentPageNumber(1);
    } else {
      getTaskListData();
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("labellingMode", selectedFilters.supercheck_status);
    }
  }, [selectedFilters]);

  useEffect(() => {
    if (taskList?.length > 0 && taskList[0]?.data) {
      const data = taskList.map((el) => {
        let row = [el.id];
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
        taskList[0].supercheck_status && row.push(el.supercheck_status);
        row.push(
          <Link
            to={
              ProjectDetails?.project_type?.includes("Acoustic")
                ? `SuperCheckerAudioTranscriptionLandingPage/${el.id}`
                : `SuperChecker/${el.id}`
            }
            className={classes.link}
          >
            <CustomButton
              disabled={ProjectDetails.is_archived}
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("labelAll");
                }
              }}
              sx={{ p: 1, borderRadius: 2 }}
              label={
                <Typography sx={{ color: "#FFFFFF" }} variant="body2">
                  Validate
                </Typography>
              }
            />
          </Link>,
        );
        return row;
      });
      let colList = ["id"];
      colList.push(
        ...Object.keys(taskList[0].data).filter(
          (el) => !excludeCols.includes(el),
        ),
      );
      taskList[0].task_status && colList.push("status");
      colList.push("actions");

      if (selectedColumns.length === 0) {
        columns.length === 0
          ? setSelectedColumns(defaultColumns)
          : setSelectedColumns(columns);
      }

      const cols = colList.map((col) => {
        const isSelectedColumn = selectedColumns.includes(col);
        return {
          name: col,
          label: snakeToTitleCase(col),
          options: {
            filter: false,
            sort: false,
            align: "center",
            display: isSelectedColumn ? "true" : "false",
            customHeadLabelRender: customColumnHead,
            setCellProps: () => ({
              style: {
                height: "70px",
                fontSize: "16px",
                padding: "16px",
                whiteSpace: "normal",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              },
            }),
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

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol(col);
  };
  const handleSearchClose = () => {
    setSearchAnchor(null);
  };

  const unassignTasks = async () => {
    setDeallocateDialog(false);
    const deallocateObj = new DeallocateSuperCheckerTasksAPI(
      id,
      selectedFilters.supercheck_status,
    );
    const res = await fetch(deallocateObj.apiEndPoint(), {
      method: "GET",
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
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const fetchNewTasks = async () => {
    const batchObj = new PullNewSuperCheckerBatchAPI(id, Math.round(pullSize));
    const res = await fetch(batchObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(batchObj.getBody()),
      headers: batchObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      if (
        props.type === "superChecker" &&
        selectedFilters.supercheck_status === "unvalidated" &&
        currentPageNumber === 1
      ) {
        getTaskListData();
      } else {
        setsSelectedFilters({
          ...selectedFilters,
          task_status: props.type === "superChecker" ? "unvalidated" : "",
        });
        setCurrentPageNumber(1);
      }
      dispatch(fetchProjectDetails(id));
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
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
      annotation_status: selectedFilters?.supercheck_status,
      mode: "supercheck",
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

  const customColumnHead = (col) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          columnGap: "5px",
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

  const areFiltersApplied = (filters) => {
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
    // const buttonSXStyle = { borderRadius: 2, margin: 2 }
    return (
      <Box className={classes.filterToolbarContainer} sx={{ height: "80px" }}>
        {(roles?.WorkspaceManager === userDetails?.role ||
          roles?.OrganizationOwner === userDetails?.role ||
          roles?.Admin === userDetails?.role) &&
          !ProjectDetails.annotators?.some(
            (annotator) => annotator.id === userDetails?.id,
          ) &&
          !ProjectDetails.annotation_reviewers?.some(
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
                  left: "-6px",
                }}
              >
                Filter by SuperChecker
              </InputLabel>
              <Select
                labelId="annotator-filter-label"
                id="annotator-filter"
                value={selectedFilters.req_user}
                label="Filter by SuperChecker"
                onChange={(e) =>
                  setsSelectedFilters({
                    ...selectedFilters,
                    req_user: e.target.value,
                  })
                }
                sx={{ fontSize: "16px" }}
              >
                <MenuItem value={-1}>All</MenuItem>
                {filterData.SuperChecker.map((el, i) => (
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
        <Box
          sx={{ position: "relative", display: "inline-block" }}
          onClick={handleShowFilter}
        >
          {filtersApplied && (
            <InfoIcon
              color="primary"
              fontSize="small"
              sx={{ position: "absolute", top: -4, right: -4 }}
            />
          )}
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
                  {selectedFilters.supercheck_status && (
                    <div>
                      <strong>Supercheck Status:</strong>{" "}
                      {selectedFilters.supercheck_status}
                    </div>
                  )}
                  {selectedFilters.req_user !== -1 && (
                    <div>
                      <strong>Assigned User:</strong> {selectedFilters.req_user}
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
            <Button sx={{ position: "relative" }}>
              <FilterListIcon sx={{ color: "#515A5A" }} />
            </Button>
          </CustomTooltip>
        </Box>
      </Box>
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
      {props.type === "superChecker" &&
        ProjectDetails?.review_supercheckers?.some(
          (supercheckers) => supercheckers.id === userDetails?.id,
        ) &&
        (ProjectDetails.is_published ? (
          <Grid container direction="row" spacing={2} sx={{ mb: 2 }}>
            {((props.type === "superChecker" &&
              selectedFilters.supercheck_status === "unvalidated") ||
              selectedFilters.supercheck_status === "draft" ||
              selectedFilters.supercheck_status === "skipped") && (
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
                    {selectedFilters.supercheck_status} tasks
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
                (props.type === "superChecker" &&
                  selectedFilters.supercheck_status === "unvalidated") ||
                selectedFilters.supercheck_status === "draft" ||
                selectedFilters.supercheck_status === "skipped"
                  ? 2
                  : 3
              }
            >
              <FormControl size="small" sx={{ width: "100%" }}>
                <InputLabel id="pull-select-label" sx={{ fontSize: "16px" }}>
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
                (props.type === "superChecker" &&
                  selectedFilters.supercheck_status === "unvalidated") ||
                selectedFilters.supercheck_status === "draft" ||
                selectedFilters.supercheck_status === "skipped"
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
                (props.type === "superChecker" &&
                  selectedFilters.supercheck_status === "unvalidated") ||
                selectedFilters.supercheck_status === "draft" ||
                selectedFilters.supercheck_status === "skipped"
                  ? 4
                  : 5
              }
            >
              <Tooltip
                title={totalTaskCount === 0 ? "No more tasks to review" : ""}
              >
                <Box>
                  <CustomButton
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      margin: "auto",
                      width: "100%",
                    }}
                    label={"Start validating now"}
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
            tableBodyHeight: `${
              typeof window !== "undefined" ? window.innerHeight - 200 : 400
            }px`,
          }}
        />
      </ThemeProvider>
      {popoverOpen && (
        <SuperCheckerFilter
          id={filterId}
          open={popoverOpen}
          anchorEl={anchorEl}
          handleClose={handleClose}
          filterStatusData={filterData}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          onchange={getTaskListData}
        />
      )}
      {searchOpen && (
 <AllTaskSearchPopup
                    open={searchOpen}
                    anchorEl={searchAnchor}
                     handleClose={handleSearchClose}
                    updateFilters={setsSelectedFilters}
                    //filterStatusData={filterData}
                    currentFilters={selectedFilters}
                    searchedCol={searchedCol}
                    onchange={getTaskListData}
                />
      )}
      {renderSnackBar()}
    </div>
  );
};

export default SuperCheckerTasks;
