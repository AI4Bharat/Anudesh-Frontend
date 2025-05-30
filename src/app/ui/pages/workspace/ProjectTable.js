"use client";
import React, { useState,useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from "react-redux";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TablePagination from "@mui/material/TablePagination";
import tableTheme from "../../../../themes/tableTheme";
import Search from "../../../../components/common/Search";
import { fetchWorkspaceProjectData } from "@/Lib/Features/getWorkspaceProjectData";
import UserMappedByProjectStage from "../../../../utils/UserMappedByProjectStage";

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

const ProjectTable = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const [displayWidth, setDisplayWidth] = useState(0);
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

  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchWorkspaceProjectData(id));
  }, [dispatch]);

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
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
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
    <div>
      <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          key={`table-${displayWidth}`}
          data={data}
          columns={columns}
          options={{
            ...options,
            tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default ProjectTable;
