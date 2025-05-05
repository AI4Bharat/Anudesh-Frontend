import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/common/Spinner";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TablePagination from "@mui/material/TablePagination";
import tableTheme from "../../themes/tableTheme";
import ColumnList from "../common/ColumnList";
import DatasetStyle from "../../styles/dataset";
import { snakeToTitleCase } from "../../utils/utils";
import FilterListIcon from "@mui/icons-material/FilterList";
import AllTasksFilterList from "./AllTasksFilterList";
import CustomButton from "../common/Button";
import SearchIcon from "@mui/icons-material/Search";
import SearchPopup from "./SearchPopup"
import { fetchAllTaskData } from "@/Lib/Features/projects/getAllTaskData";
import { styled } from "@mui/material/styles";
import ChatLang from "@/utils/Chatlang";

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

const MUIDataTable = dynamic(
  () => import('mui-datatables'),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        variant="rectangular"
        height={400}
        sx={{
          mx: 2,
          my: 3,
          borderRadius: '4px',
          transform: 'none'
        }}
      />
    )
  }
);

const excludeSearch = ["status", "actions"];
const AllTaskTable = (props) => {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const [displayWidth, setDisplayWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [expandedRow, setExpandedRow] = useState(null);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [columns, setColumns] = useState([]);
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
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

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
            .map((key) => {
              if (key === "meta_info_language") {
                return ChatLang[el.data[key]] || el.data[key];
              }
              return el.data[key];
            }),
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
      if (cols.length == 6) {
        cols.splice(1, 2);
      }
      setColumns(cols);
      data.forEach(ele => {
        if (ele.length == 6) {
          ele.splice(1, 2);
        }
      });
      setTasks(data);
    } else {
      setTasks([]);
    }
  }, [AllTaskData, ProjectDetails, expandedRow]);

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
    return (
      <Box className={classes.filterToolbarContainer} sx={{ height: "80px" }}>
        <Tooltip title="Filter Table">
          <Button onClick={handleShowFilter}>
            <FilterListIcon />
          </Button>
        </Tooltip>
      </Box>
    );
  };
  const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "space-between",
            md: "flex-end"
          },
          alignItems: "center",
          padding: "10px",
          gap: {
            xs: "10px",
            md: "20px"
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
            "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input": {
              marginRight: "10px",
            },
          }}
        />

        {/* Jump to Page */}
        <div>
          <label style={{
            marginRight: "5px",
            fontSize: "0.83rem",
          }}>
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

  return (
    <React.Fragment>
      {apiLoading ? (
        <Spinner />
      ) : (
        <div>
          <ThemeProvider theme={tableTheme}>
            <MUIDataTable
              key={`table-${displayWidth}`}
              title={""}
              data={tasks}
              columns={columns}
              options={{
                ...options,
                tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
              }}
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
            <SearchPopup
              open={searchOpen}
              anchorEl={searchAnchor}
              handleClose={handleSearchClose}
              updateFilters={setSelectedFilters}
              currentFilters={selectedFilters}
              searchedCol={searchedCol}
            />
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default AllTaskTable;
