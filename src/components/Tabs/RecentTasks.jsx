import {
    ThemeProvider,
    Box,
    Tabs,
    Tab,
    IconButton,
    TablePagination,
    Select,
    MenuItem
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { useSelector, useDispatch } from "react-redux";
  import APITransport from "@/Lib/apiTransport/apitransport";
  import LightTooltip from "../common/Tooltip";
  import InfoIcon from "@mui/icons-material/Info";  // import { useParams } from 'react-router-dom';
  import FetchRecentTasksAPI from "@/app/actions/api/user/FetchRecentTasksAPI";
  import tableTheme from "../../themes/tableTheme";
  import themeDefault from "../../themes/theme";
  import SearchIcon from "@mui/icons-material/Search";
  import MUIDataTable from "mui-datatables";
  import { translate } from "../../config/localisation";
import { fetchRecentTasks } from "@/Lib/Features/user/getRecentTasks";
import AllTaskSearchPopup from "../Project/AllTasksSearchpopup";
  
  const TASK_TYPES = ["annotation", "review","supercheck"]
  
  const RecentTasks = () => {
   /* eslint-disable react-hooks/exhaustive-deps */

    // const { id } = useParams();
    const id = 2
    const dispatch = useDispatch();
    const [taskType, setTaskType] = useState(TASK_TYPES[0]);
    const [text, settext] = useState("")
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const filterId = popoverOpen ? "simple-popover" : undefined;
  
    const [searchAnchor, setSearchAnchor] = useState(null);
    const searchOpen = Boolean(searchAnchor);
    const [searchedCol, setSearchedCol] = useState();
    const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
  
    const RecentTasks = useSelector((state) => state.getRecentTasks.data)
    const filterData = {
      Status: ["incomplete", "annotated", "reviewed", "super_checked", "exported"],
    };
    const [selectedFilters, setsSelectedFilters] = useState({});
  
    const GetAllTasksdata = () => {
      // id,task_type, pageNo, filter,countPerPage
      dispatch(fetchRecentTasks({id:id, task_type:taskType, pageNo:currentPageNumber, filter:selectedFilters, countPerPage:currentRowPerPage}));
      console.log("step 1");
    };
  /* eslint-disable react-hooks/exhaustive-deps */

    useEffect(() => {
      GetAllTasksdata();
    }, [id, taskType, currentPageNumber, currentRowPerPage, selectedFilters]);
  
  
    useEffect(() => {
      if (RecentTasks && RecentTasks?.results?.results?.length > 0) {
        const data = RecentTasks?.results?.results?.map((el) => {
          if (typeof el === 'object') {
            return Object.keys(el).map((key) => el[key]);
          }
          return [];
        });
        
        let colList = [];
        if (RecentTasks.results.results.length > 0 && typeof RecentTasks.results.results[0] === 'object') {
  
          colList.push(
            ...Object.keys(RecentTasks.results.results[0])
          );
        }
        const cols = colList.map((col) => {
          return {
            name: col,
            label: col,
            options: {
              filter: false,
              sort: false,
              align: "center",
              customHeadLabelRender: customColumnHead,
              setCellProps: () => ({ 
                style: {
                  height: "70px", fontSize: "16px",
                padding: "16px",
                whiteSpace: "normal", 
                overflowWrap: "break-word",
                wordBreak: "break-word",  
              } 
              }),
            },
          };
        });
        setColumns(cols);
        setSelectedColumns(colList);
        setTasks(data);
      } else {
        setTasks([]);
      }
    }, [RecentTasks]);
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleSearchClose = () => {
      setSearchAnchor(null);
    }
    const handleShowSearch = (col, event) => {
      setSearchAnchor(event.currentTarget);
      setSearchedCol(col);
    }
    const customColumnHead = (col) => {
      let tooltipText = "";
  
      switch (col.label) {
        case "Updated at":
          tooltipText = "When task was last updated";
          break;
        case "Created at":
          tooltipText = "When task was assigned";
          break;
        case "Annotated at":
          tooltipText = "When task was first annotated";
          break;
        default:
          break;
      }
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
          {col.label === "Updated at" || col.label === "Created at" || col.label === "Annotated at" ? (
            <LightTooltip arrow placement="top" title={tooltipText}>
              <InfoIcon sx={{ color: "grey" }} fontSize="medium" />
            </LightTooltip>
          ) : null}
          {<IconButton sx={{ borderRadius: "100%" }} onClick={(e) => handleShowSearch(col.name, e)}>
            <SearchIcon id={col.name + "_btn"} />
          </IconButton>}
        </Box>
      );
    }
  
    useEffect(() => {
      const newCols = columns.map((col) => {
        col.options.display = selectedColumns.includes(col.name)
          ? "true"
          : "false";
        return col;
      });
      setColumns(newCols);
    }, [selectedColumns]);
  
  
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
              fontSize:"0.83rem", 
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
    
  

  
    const tableOptions = {
      count: RecentTasks?.count,
      rowsPerPage: currentRowPerPage,
      page: currentPageNumber - 1,
      rowsPerPageOptions: [10, 25, 50, 100],
      textLabels: {
        pagination: {
          next: "Next >",
          previous: "< Previous",
        },
        body: {
          noMatch: "No records ",
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
      jumpToPage: true,
      serverSide: true,
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
      <ThemeProvider theme={themeDefault}>
      <Box>
        <Tabs value={taskType} onChange={(e, newVal) => setTaskType(newVal)} aria-label="basic tabs example" sx={{ mb: 2 }}>
          <Tab label={translate("label.recentTasks.annotation")} value="annotation" sx={{ fontSize: 16, fontWeight: '700' }} />
          <Tab label={translate("label.recentTasks.review")} value="review" sx={{ fontSize: 16, fontWeight: '700' }} />
          <Tab label="Super Check" value="supercheck" sx={{ fontSize: 16, fontWeight: '700' }} />
        </Tabs>
      </Box>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={tasks}
          columns={columns}
          options={tableOptions}
        />
      </ThemeProvider>

      {searchOpen && <AllTaskSearchPopup
        open={searchOpen}
        anchorEl={searchAnchor}
        handleClose={handleSearchClose}
        updateFilters={setsSelectedFilters}
        //filterStatusData={filterData}
        currentFilters={selectedFilters}
        searchedCol={searchedCol}
        onchange={GetAllTasksdata}
      />}
    </ThemeProvider>
  )
}

export default RecentTasks