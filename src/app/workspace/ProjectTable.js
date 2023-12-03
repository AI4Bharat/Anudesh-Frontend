'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
// import CustomButton from "../common/Button";
// import { Link, useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";
// import GetWorkspacesProjectDetailsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceProject";
// import APITransport from "../../../../redux/actions/apitransport/apitransport";
// import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, Grid ,Button} from "@mui/material";
import tableTheme from "../../themes/TableTheme";
// import Search from "../../component/common/Search";
import UserMappedByRole from "../../utils/UserMappedByRole";

const ProjectTable = (props) => {

  const CustomButton = ({ label, buttonVariant, color, disabled = false, ...rest }) => (
    <Button {...rest} variant={buttonVariant ? buttonVariant : "contained"} color={color ? color : "primary"} disabled={disabled}>
      {label}
    </Button>
  )
//   const dispatch = useDispatch();

//   const { id } = useParams();
//   const getWorkspaceProjectData = () => {
//     const workspaceObjs = new GetWorkspacesProjectDetailsAPI(id);

//     dispatch(APITransport(workspaceObjs));
//   };

//   useEffect(() => {
//     getWorkspaceProjectData();
//   }, []);

//   const workspacesproject = useSelector(
//     (state) => state.getWorkspacesProjectData.data
//   );
//   const SearchWorkspaceProjects = useSelector(
//     (state) => state.SearchProjectCards.data
//   );
const workspacesproject = [{"id":1, "title":"workspace 1", "project_stage":"1", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":2, "title":"workspace 2", "project_stage":"2", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":3, "title":"workspace 3", "project_stage":"3", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":4, "title":"workspace 4", "project_stage":"1", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":5, "title":"workspace 5", "project_stage":"3", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":6, "title":"workspace 6", "project_stage":"2", "tgt_language":"hindi", "project_type":"AudioTranscription"}]
  const pageSearch = () => {
    return workspacesproject.filter((el) => {
      return el;
  })}

//   const pageSearch = () => {
//     return workspacesproject.filter((el) => {
//       if (SearchWorkspaceProjects == "") {
//         return el;
//       } else if (
//         el.title?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
//       ) {
//         return el;
//       } else if (
//         el.id.toString()?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
//       ) {
//         return el;
//       } else if (
//         el.tgt_language?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
//       ) {
//         return el;
//       } else if (
//         el.project_type?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
//       ) {
//         return el;
//       }
//       else if (
//         UserMappedByProjectStage(el.project_stage)?.name?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
//       ) {
//         return el;
//       }
//     });
//   };

  const columns = [
    {
      name: "id",
      label: " Project ID",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding:"16px" },
        }),
      },
    },
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px",},
        }),
      },
    },

    // {
    //   name: "Created By",
    //   label: "Created By",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     align: "center",
    //     display: 'false', 
    //     setCellHeaderProps: (sort) => ({
    //         style: { height: "70px",  },
    //       }),
    //   },
    // },
    {
      name: "project_stage",
      label: "Project Stage",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px",  },
        }),
      },
    },
    {
      name: "tgt_language",
      label: "Target language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px",   },
        }),
      },
    },
    {
      name: "project_type",
      label: "project type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px",  },
        }),
      },
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
            style: { height: "70px",  },
          }),
      },
    },
  ];

  const data =
  workspacesproject && workspacesproject.length > 0
      ? pageSearch().map((el, i) => {
        console.log(el.project_stage);
        const userRole = el.project_stage && UserMappedByRole(el.project_stage).element;
          return [
            el.id,
            el.title,
            userRole ? userRole :  el.project_stage,
            el.tgt_language == null ?"-": el.tgt_language,
            el.project_type,
            <Link href={`/projects`} style={{ textDecoration: "none" }}>
              <CustomButton sx={{ borderRadius: 2 }} label="View" />
            </Link>,
          ];
        })
      : [];

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    // customToolbar: fetchHeaderButton,
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    // rowsPerPage: PageInfo.count,
    filter: false,
    // page: PageInfo.page,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

  return (
    <div>
      {/* <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid> */}
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          // title={""}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </div>
  );
};

export default ProjectTable;
