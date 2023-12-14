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
    // const [columns, setColumns] = useState([]);
    const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const SearchWorkspace =[];


    const RecentTasks = {
      "count": 68578,
      "next": "http://backend.dev.shoonya.ai4bharat.org/task/annotated_and_reviewed_tasks/get_users_recent_tasks/?page=2&records=10&search_Project+ID=2284&task_type=annotation",
      "previous": null,
      "results": [
          {
              "Project ID": 2284,
              "Task ID": 3606603,
              "Updated at": "07-12-2023 16:04:04",
              "Annotated at": "07-12-2023 16:03:01",
              "Created at": "07-12-2023 15:59:50"
          },
          {
              "Project ID": 2284,
              "Task ID": 3606607,
              "Updated at": "07-12-2023 15:59:50",
              "Annotated at": null,
              "Created at": "07-12-2023 15:59:50"
          },
          {
              "Project ID": 2284,
              "Task ID": 3606606,
              "Updated at": "07-12-2023 15:59:50",
              "Annotated at": null,
              "Created at": "07-12-2023 15:59:50"
          },
          {
              "Project ID": 2284,
              "Task ID": 3606605,
              "Updated at": "07-12-2023 15:59:50",
              "Annotated at": null,
              "Created at": "07-12-2023 15:59:50"
          },
          {
              "Project ID": 2284,
              "Task ID": 3606604,
              "Updated at": "07-12-2023 15:59:50",
              "Annotated at": null,
              "Created at": "07-12-2023 15:59:50"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606417,
              "Updated at": "06-12-2023 14:12:12",
              "Annotated at": null,
              "Created at": "06-12-2023 14:12:12"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606416,
              "Updated at": "06-12-2023 14:12:12",
              "Annotated at": null,
              "Created at": "06-12-2023 14:12:12"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606415,
              "Updated at": "06-12-2023 14:12:12",
              "Annotated at": null,
              "Created at": "06-12-2023 14:12:12"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606414,
              "Updated at": "06-12-2023 14:12:12",
              "Annotated at": null,
              "Created at": "06-12-2023 14:12:12"
          },
          {
              "Project ID": 2279,
              "Task ID": 3606413,
              "Updated at": "06-12-2023 14:12:12",
              "Annotated at": null,
              "Created at": "06-12-2023 14:12:12"
          }
      ]
  }


  const pageSearch = () => {

    return RecentTasks?.results?.filter((el) => {

        if (SearchWorkspace == "") {

            return el;
        } else if (
            el['Project ID']
                ?.toString()?.toLowerCase()
                .includes(SearchWorkspace?.toLowerCase())
        ) {

            return el;
        }
        else if (
          el["Task ID"]
              .toString()?.toLowerCase()
              .includes(SearchWorkspace?.toLowerCase())
      ) {

          return el;
      }
      else if (
        el["Created at"]
            ?.toLowerCase()
            .includes(SearchWorkspace?.toLowerCase())
    ) {

        return el;
    }
    else if (
      el["Updated at"]
          ?.toLowerCase()
          .includes(SearchWorkspace?.toLowerCase())
  ) {

      return el;
  }else if (
    el["Annotated at"]
        ?.toLowerCase()
        .includes(SearchWorkspace?.toLowerCase())
) {

    return el;
}
    })

}
const columns = [
  {
    name: "Project ID",
    label: "Project ID",
    options: {
                filter: false,
                sort: false,
                align: "center",
              },
  },
  {
    name: "Task ID",
    label: "Task ID",
    options: {
                filter: false,
                sort: false,
                align: "center",
              },
  },
  {
    name: "Created At",
    label: "Created At",
    options: {
                filter: false,
                sort: false,
                align: "center",
              },
  },
  {
    name: "Updated At",
    label: "Updated At",
    options: {
                filter: false,
                sort: false,
                align: "center",
              },
  },

  {
    name: "Annotated At",
    label: "Annotated At",
    options: {
                filter: false,
                sort: false,
                align: "center",
              },
  },
];

  const data = RecentTasks && RecentTasks?.results?.length > 0 ?pageSearch().map((el, i) => {
  return [
      el['Project ID'],
      el["Task ID"],
      el["Updated at"],
      el["Created at"],
      el["Annotated at"]
      // el.managers.map((manager, index) => {
      //     return manager.username
      // }).join(", "),
      // el.created_by && el.created_by.username,
      // <Link to={`/workspaces/${el.id}`} style={{ textDecoration: "none" }}>
      //     <CustomButton
      //         sx={{ borderRadius: 2 }}
      //         label="View"
      //     />
      // </Link>
  ]
})  : [];
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