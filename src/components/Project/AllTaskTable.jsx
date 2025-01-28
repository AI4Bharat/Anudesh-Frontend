import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/common/Spinner";
import {
  ThemeProvider,
  Grid,
  Box,
  Tooltip,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import tableTheme from "../../themes/tableTheme";
import ColumnList from "../common/ColumnList";
import DatasetStyle from "../../styles/dataset";
import { snakeToTitleCase } from "../../utils/utils";
import FilterListIcon from "@mui/icons-material/FilterList";
import AllTasksFilterList from "./AllTasksFilterList";
import CustomButton from "../common/Button";
import SearchIcon from "@mui/icons-material/Search";
import AllTaskSearchPopup from "./AllTasksSearchpopup";
import { fetchAllTaskData } from "@/Lib/Features/projects/getAllTaskData";

const excludeCols = [
  "avg_rating",
  "curr_rating",
  "inter_annotator_difference",
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

const excludeSearch = ["status", "actions"];
const AllTaskTable = (props) => {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  /* eslint-disable react-hooks/exhaustive-deps */

  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const AllTaskData = useSelector((state) => state.getAllTaskData.data.result);
  const apiLoading = useSelector(
    (state) => state.getAllTaskData.status !== "succeeded",
  );
  const totalTaskCount = useSelector(
    (state) => state.getAllTaskData.data.total_count,
  );
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const userDetails = useSelector((state) => state.getLoggedInData.data);
  const filterData = {
    Status: [
      "incomplete",
      "annotated",
      "reviewed",
      "super_checked",
      "exported",
    ],
  };

  const [selectedFilters, setSelectedFilters] = useState(() => {
    const savedFilters = localStorage.getItem('selectedFilters');
    return savedFilters ? JSON.parse(savedFilters) :
     { task_status: [filterData.Status[0]] };
  });


  useEffect(() => {
    localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
  }, [selectedFilters]);


  if (ProjectDetails?.required_annotators_per_task > 1) {
    filterData.Status = filterData.Status.filter(
      (status) => status !== "super_checked"
    );
  }
  

  const GetAllTasksdata = () => {
    const taskobj = {
      id: id,
      currentPageNumber: currentPageNumber,
      currentRowPerPage: currentRowPerPage,
      selectedFilters: selectedFilters,
    };
    dispatch(fetchAllTaskData(taskobj));
  };

  useEffect(() => {
    GetAllTasksdata();
  }, [currentPageNumber, currentRowPerPage]);

  useEffect(() => {
    if (AllTaskData?.length > 0 && AllTaskData[0]?.data) {
      const data = AllTaskData.map((el) => {
        let row = [el.id];
        row.push(
          ...Object.keys(el.data)
            .filter((key) => !excludeCols.includes(key))
            .map((key) => el.data[key]),
        );
        AllTaskData[0].task_status && row.push(el.task_status);
        if (
          ProjectDetails?.required_annotators_per_task > 1 &&
          AllTaskData[0].input_data_id
        ) {
          row.push(el.input_data_id);
        }
        row.push(
          <>
            <Link
              to={
                ProjectDetails?.project_type?.includes("Acoustic")
                  ? `AllAudioTranscriptionLandingPage/${el.id}`
                  : `Alltask/${el.id}`
              }
              className={classes.link}
            >
              <CustomButton
                onClick={() => {
                  localStorage.removeItem("labelAll");
                }}
                sx={{ p: 1, borderRadius: 2 }}
                label={
                  <Typography sx={{ color: "#FFFFFF" }} variant="body2">
                    View
                  </Typography>
                }
              />
            </Link>
          </>,
        );
        return row;
      });
      let colList = ["id"];
      
      colList.push(
        ...Object.keys(AllTaskData[0].data).filter(
          (el) => !excludeCols.includes(el),
        ),
      );
      
      AllTaskData[0].task_status && colList.push("status");
      if (ProjectDetails?.required_annotators_per_task > 1) {
        if (AllTaskData[0].input_data_id) {
          colList.push("Input_data_id");
        }
      }
      colList.push("actions");
      const cols = colList.map((col) => {
        return {
          name: col,
          label: snakeToTitleCase(col),
          options: {
            filter: false,
            sort: false,
            align: "center",
            customHeadLabelRender: customColumnHead,
          },
        };
      });
      setColumns(cols);
      setSelectedColumns(colList);
      setTasks(data);
    } else {
      setTasks([]);
    }
  }, [AllTaskData, ProjectDetails]);

  useEffect(() => {
    const newCols = columns.map((col) => {
      col.options.display = selectedColumns.includes(col.name)
        ? "true"
        : "false";
      return col;
    });
    setColumns(newCols);
  }, [selectedColumns]);

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

  const renderToolBar = () => {
    // const buttonSXStyle = { borderRadius: 2, margin: 2 }
    return (
      <Box className={classes.filterToolbarContainer} sx={{ height: "80px" }}>
        {/* <ColumnList
                columns={columns}
                setColumns={setSelectedColumns}
                selectedColumns={selectedColumns}
            /> */}
        <Tooltip title="Filter Table">
          <Button onClick={handleShowFilter}>
            <FilterListIcon />
          </Button>
        </Tooltip>
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
  };

  return (
    <React.Fragment>
      {apiLoading ? (
        <Spinner />
      ) : (
        <div>
          <ThemeProvider theme={tableTheme}>
            <MUIDataTable
              // title={""}
              data={tasks}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
          {popoverOpen && (
            <AllTasksFilterList
              id={filterId}
              open={popoverOpen}
              anchorEl={anchorEl}
              handleClose={handleClose}
              filterStatusData={filterData}
              updateFilters={setSelectedFilters}
              currentFilters={selectedFilters}
              onchange={GetAllTasksdata}
            />
          )}
          {searchOpen && (
            <AllTaskSearchPopup
              open={searchOpen}
              anchorEl={searchAnchor}
              handleClose={handleSearchClose}
              updateFilters={setSelectedFilters}
              //filterStatusData={filterData}
              currentFilters={selectedFilters}
              searchedCol={searchedCol}
              onchange={GetAllTasksdata}
            />
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default AllTaskTable;
