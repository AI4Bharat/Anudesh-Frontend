import {
    ThemeProvider,
    Box,
    Tabs,
    Tab,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  // import { useSelector, useDispatch } from "react-redux";
  // import APITransport from "../../../../redux/actions/apitransport/apitransport";
  // import { useParams } from 'react-router-dom';
  // import FetchRecentTasksAPI from "../../../../redux/actions/api/UserManagement/FetchRecentTasks";
  import tableTheme from "../../../themes/TableTheme";
  import themeDefault from "../../../themes/theme";
  import MUIDataTable from "mui-datatables";
  import { translate } from "../../../config/localisation";
  
  const TASK_TYPES = ["annotation", "review","supercheck"]
  
  const RecentTasks = () => {
  
    // const { id } = useParams();
    // const dispatch = useDispatch();
    const [taskType, setTaskType] = useState(TASK_TYPES[0]);
    const [columns, setColumns] = useState([]);
    const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
  
    // const RecentTasks = useSelector((state) => state.getRecentTasks.data)

    const RecentTasks = {
      "count": 68576,
      "next": "http://backend.dev.shoonya.ai4bharat.org/task/annotated_and_reviewed_tasks/get_users_recent_tasks/?page=2&records=10",
      "previous": null,
      "results": [
          {
              "Project ID": 2279,
              "Task ID": 3606417,
              "Updated at": "06-12-2023 14:12:12"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606416,
              "Updated at": "06-12-2023 14:12:12"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606415,
              "Updated at": "06-12-2023 14:12:12"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606414,
              "Updated at": "06-12-2023 14:12:12"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606413,
              "Updated at": "06-12-2023 14:12:12"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606410,
              "Updated at": "06-12-2023 12:11:57"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606412,
              "Updated at": "06-12-2023 12:08:17"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606411,
              "Updated at": "06-12-2023 12:08:17"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606409,
              "Updated at": "06-12-2023 12:08:17"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606408,
              "Updated at": "06-12-2023 12:08:17"
          }
      ]
  }
  
    // useEffect(() => {
    //   const taskObj = new FetchRecentTasksAPI(id, taskType, currentPageNumber, currentRowPerPage);
    //   dispatch(APITransport(taskObj));
    // }, [id, taskType, currentPageNumber, currentRowPerPage])
  
    useEffect(() => {
      if (RecentTasks?.results?.length > 0) {
        let tempColumns = []
        Object.keys(RecentTasks.results[0]).forEach((key) => {
          tempColumns.push({
            name: key,
            label: key,
            options: {
              filter: false,
              sort: false,
              align: "center",
            },
          })
        })
        setColumns(tempColumns)
      } else {
        setColumns([])
      }
    }, [RecentTasks])
  
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
    };
  
    return (
      <ThemeProvider theme={themeDefault}>
        <Box >
          <Tabs value={taskType} onChange={(e, newVal) => setTaskType(newVal)} aria-label="basic tabs example" sx={{mb: 2}}>
              <Tab label={translate("label.recentTasks.annotation")} value="annotation" sx={{ fontSize: 16, fontWeight: '700'}}/>
              <Tab label={translate("label.recentTasks.review")} value="review" sx={{ fontSize: 16, fontWeight: '700'}}/>
              <Tab label="Super Check" value="supercheck" sx={{ fontSize: 16, fontWeight: '700'}}/>
          </Tabs>
        </Box>
        <ThemeProvider theme={tableTheme}>
          <MUIDataTable
            data={RecentTasks?.results ?? []}
            columns={columns}
            options={tableOptions}
          />
        </ThemeProvider>
      </ThemeProvider>
    )
  }
  
  export default RecentTasks