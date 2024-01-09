'use client'
import React, { useState, useEffect ,useCallback} from "react";
import Link from 'next/link';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, Grid ,Button} from "@mui/material";
import tableTheme from "../../themes/TableTheme";
import Search from "../components/common/Search";
import { useRouter } from "next/navigation";
import { setWorkspaceProjectData } from "@/lib/Features/getWorkspaceProject";
import APITransport from "../../Lib/apiTransport/apitransport"
// import getWorkspaceProject from "@/lib/Features/getWorkspaceProject";
import UserMappedByProjectStage from "../../utils/UserMappedByProjectStage";
import GetWorkspacesProjectDetailsAPI from "../actions/api/workspace/GetWorkspaceProject";


const ProjectTable = (props) => {

  const CustomButton = ({ label, buttonVariant, color, disabled = false, ...rest }) => (
    <Button {...rest} variant={buttonVariant ? buttonVariant : "contained"} color={color ? color : "primary"} disabled={disabled}>
      {label}
    </Button>
  )
 const dispatch = useDispatch();
 const router = useRouter();
//  const {id} = router.query
  
  const getWorkspace = () => {
    const workspaceObjs = new GetWorkspacesProjectDetailsAPI(1);

    dispatch(APITransport(workspaceObjs));
  };

  const getWorkspaceProjectDataCallback = useCallback(() => {
    getWorkspace();
  }, []);
  
  useEffect(() => {
    getWorkspaceProjectDataCallback();
  }, [getWorkspaceProjectDataCallback]);

  const workspacesproject = useSelector(
    (state) => state.getWorkspaceProject.data
  );
  console.log(workspacesproject);
  // const SearchWorkspaceProjects = useSelector(
  //   (state) => state.SearchProjectCards.data
  // );


  const pageSearch = () => {
    return workspacesproject.filter((el) => {
      return el;
  })}

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
        const userRole = el.project_stage && UserMappedByProjectStage(el.project_stage).element;
          return [
            el.id,
            el.title,
            userRole ? userRole :  el.project_stage,
            el.tgt_language == null ?"-": el.tgt_language,
            el.project_type,
            <Link key={i} href={`/projectdetails`} style={{ textDecoration: "none" }}>
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
      <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid>
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
