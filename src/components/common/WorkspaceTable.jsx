import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../common/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import dynamic from 'next/dynamic';
import GetWorkspaceAPI from "@/app/actions/api/workspace/GetWorkspaceData";
import { ThemeProvider, Grid, Box, TablePagination, Select, MenuItem, Skeleton } from "@mui/material";
import APITransport from "@/Lib/apiTransport/apitransport";
import tableTheme from "../../themes/tableTheme";
import DatasetStyle from "../../styles/dataset";
import Search from "../common/Search";
// import Link from 'next/link';
import { setWorkspace } from "@/Lib/Features/GetWorkspace";
import { fetchWorkspaceData } from "@/Lib/Features/GetWorkspace";
import Spinner from "@/components/common/Spinner";
import { Tab } from "@material-ui/icons";

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

const WorkspaceTable = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const { showManager, showCreatedBy } = props;
  const [displayWidth, setDisplayWidth] = useState(0);
  const workspaceData = useSelector((state) => state.GetWorkspace.data);
  const SearchWorkspace = useSelector(
    (state) => state.searchProjectCard?.searchValue,
  );
  const apiLoading = useSelector(
    (state) => state.GetWorkspace.status !== "succeeded",
  );

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalWorkspaces, setTotalWorkspaces] = useState(10);

  const totalWorkspaceCount = useSelector(
    (state) => state.GetWorkspace.data.count,
  );

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
    dispatch(fetchWorkspaceData(currentPageNumber));
  }, [currentPageNumber]);

  useEffect(() => {
    dispatch(fetchWorkspaceData(currentPageNumber));
  }, []);

  const pageSearch = () => {
    return workspaceData.filter((el) => {
      if (SearchWorkspace == "") {
        return el;
      } else if (
        el.workspace_name
          ?.toLowerCase()
          .includes(SearchWorkspace?.toLowerCase())
      ) {
        console.log(el);
        return el;
      } else if (
        el.managers?.some((val) =>
          val.username?.toLowerCase().includes(SearchWorkspace?.toLowerCase()),
        )
      ) {
        console.log(el);
        return el;
      }
    });
  };

  const columns = [
    {
      name: "id",
      label: "Id",
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
      name: "Manager",
      label: "Manager",
      options: {
        filter: false,
        sort: false,
        align: "center",
        display: showManager ? "true" : "exclude",
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
      name: "Created By",
      label: "Created By",
      options: {
        filter: false,
        sort: false,
        align: "center",
        display: showCreatedBy ? "true" : "exclude",
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
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
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
    workspaceData && workspaceData.length > 0
      ? pageSearch().map((el, i) => {
        return [
          el.id,
          el.workspace_name,
          el.managers
            .map((manager, index) => {
              return manager.username;
            })
            .join(", "),
          el.created_by && el.created_by.username,
          <Link
            key={i}
            to={`/workspaces/${el.id}`}
            style={{ textDecoration: "none" }}
          >
            <CustomButton sx={{ borderRadius: 2 }} label="View" />
          </Link>,
        ];
      })
      : [];
  // console.log('DATA', data);
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
    <>
      {apiLoading ? (
        <Spinner />
      ) : (
        <div>
          <Grid sx={{ mb: 1 }}>
            <Search />
          </Grid>
          {workspaceData && (
            <ThemeProvider theme={tableTheme}>
              <MUIDataTable
                key={`table-${displayWidth}`}
                title={""}
                data={data}
                columns={columns}
                options={{
                  ...options,
                  tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
                }}
              />
            </ThemeProvider>
          )}
        </div>
      )}
    </>
  );
};
export default WorkspaceTable;
