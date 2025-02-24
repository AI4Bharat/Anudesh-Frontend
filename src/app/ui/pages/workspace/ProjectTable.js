"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, Grid, Button, Box, Select, MenuItem, TablePagination } from "@mui/material";
import tableTheme from "../../../../themes/tableTheme";
import Search from "../../../../components/common/Search";
import { fetchWorkspaceProjectData } from "@/Lib/Features/getWorkspaceProjectData";
import APITransport from "../../../../Lib/apiTransport/apitransport";
// import getWorkspaceProject from "@/lib/Features/getWorkspaceProject";
import UserMappedByProjectStage from "../../../../utils/UserMappedByProjectStage";
import GetWorkspacesProjectDetailsAPI from "../../../actions/api/workspace/GetWorkspaceProject";

const ProjectTable = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const CustomButton = ({
    label,
    buttonVariant,
    color,
    disabled = false,
    ...rest
  }) => (
    <Button
      {...rest}
      variant={buttonVariant ? buttonVariant : "contained"}
      color={color ? color : "primary"}
      disabled={disabled}
    >
      {label}
    </Button>
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  // const getWorkspace = () => {
  //   dispatch(fetchWorkspaceProjectData(1));
  // };

  useEffect(() => {
    dispatch(fetchWorkspaceProjectData(id));
  }, [dispatch]);

  const workspacesproject = useSelector(
    (state) => state.getWorkspaceProjectData.data,
  );
  const SearchWorkspaceProjects = useSelector(
    (state) => state.searchProjectCard?.searchValue,
  );

  const pageSearch = () => {
    return workspacesproject.filter((el) => {
      if (SearchWorkspaceProjects == "") {
        return el;
      } else if (
        el.title?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      } else if (
        el.id
          .toString()
          ?.toLowerCase()
          .includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      } else if (
        el.tgt_language
          ?.toLowerCase()
          .includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      } else if (
        el.project_type
          ?.toLowerCase()
          .includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      } else if (
        UserMappedByProjectStage(el.project_stage)
          ?.name?.toLowerCase()
          .includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const columns = [
    {
      name: "id",
      label: " Project ID",
      options: {
        filter: false,
        sort: false,
        align: "center",
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
    },
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
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
    },

    {
      name: "project_stage",
      label: "Project Stage",
      options: {
        filter: false,
        sort: false,
        align: "center",
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
    },
    {
      name: "tgt_language",
      label: "Target language",
      options: {
        filter: false,
        sort: false,
        align: "center",
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
    },
    {
      name: "project_type",
      label: "project type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ 
          style: {
           padding: "16px",
           minWidth: "170px",
           whiteSpace: "normal",
           overflowWrap: "break-word",
           wordBreak: "break-word", 
           height: "70px"
         }
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
    },
  ];

  const data =
    workspacesproject && workspacesproject.length > 0
      ? pageSearch().map((el, i) => {
          const userRole =
            el.project_stage &&
            UserMappedByProjectStage(el.project_stage).element;
          return [
            el.id,
            el.title,
            userRole ? userRole : el.project_stage,
            el.tgt_language == null ? "-" : el.tgt_language,
            el.project_type,
            <Link
              key={i}
              to={`/projects/${el.id}`}
              style={{ textDecoration: "none" }}
            >
              <CustomButton sx={{ borderRadius: 2 }} label="View" />
            </Link>,
          ];
        })
      : [];
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
    responsive: "stacked",
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
