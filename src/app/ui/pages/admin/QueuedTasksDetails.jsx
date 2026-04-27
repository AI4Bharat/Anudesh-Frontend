import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import APITransport from "@/Lib/apiTransport/apitransport"
import { useDispatch, useSelector } from "react-redux";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import tableTheme from "@/themes/tableTheme";
import CustomizedSnackbars from "@/components/common/Snackbar";
import Search from "@/components/common/Search";
import Spinner from "@/components/common/Spinner";
import Skeleton from "@mui/material/Skeleton";
import GetQueuedTaskDetailsAPI from "@/Lib/Features/getQueuedTaskDetails";
import { useTheme } from "@/context/ThemeContext";

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
/* eslint-disable react-hooks/exhaustive-deps */
const QueuedTasksDetails = (props) => {
  const { dark } = useTheme();

  const dispatch = useDispatch();
  const [displayWidth, setDisplayWidth] = useState(0);
  // const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [tableData, setTableData] = useState([])
  const [queuedTaskData, setQueuedTaskData] = useState([])
  const UserDetail = useSelector((state) => {
    return state.getQueuedTaskDetails?.data;
  });
  useEffect(() => {
    const fetchQueuedTasks = async () => {
      const apiInstance = new GetQueuedTaskDetailsAPI();
      const action = await apiInstance.call();
      dispatch(action);
    };

    fetchQueuedTasks();
  }, [dispatch]);



  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const SearchQueuedTasks = useSelector(
    (state) => state.SearchProjectCards?.data
  );
  const getUserDetail = () => {
    const UserObj = new GetQueuedTaskDetailsAPI();
    // console.log(UserObj)
    dispatch(APITransport(UserObj));
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  useEffect(() => {
    const tData = pageSearch(queuedTaskData)
    setTableData(tData)
  }, [queuedTaskData, SearchQueuedTasks])


  useEffect(() => {
    let formatedQueuedTaskData = [];
    if (UserDetail) {
      formatedQueuedTaskData = Object.keys(UserDetail).map((key) => UserDetail[key]);
    }
    const data = formatedQueuedTaskData && formatedQueuedTaskData.length > 0
      ? formatedQueuedTaskData.map((el, i) => {
        return {
          uuid: el.uuid,
          name: el.name,
          state: el.state,
          args: el.args,
          kwargs: el.kwargs,
          exception: el.exception,
          traceback: el.traceback,
        };
      })
      : [];
    setQueuedTaskData(data)
  }, [UserDetail]);

  const pageSearch = (data) => {
    return data.filter((el) => {
      if (!SearchQueuedTasks || SearchQueuedTasks === "") {
        return el;
      } else if (
        el.name?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      }
      else if (
        el.state?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      }
      else if (
        el.args?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      }
      else if (
        el.kwargs?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const columns = [
    {
      name: "uuid",
      label: "Id",
      options: {
        display: false,
        filter: false,
        sort: false,
        align: "center",
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { padding: "16px" } }),
      },
    },
    {
      name: "state",
      label: "State",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { padding: "16px" } }),
      },
    },
    {
      name: "args",
      label: "Args",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "kwargs",
      label: "KwArgs",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { padding: "16px" } }),
      },
    },
    {
      name: "exception",
      label: "Exception",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "traceback",
      label: "Traceback",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
  ];

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

    
    backgroundColor: dark ? "#1e1e1e" : "",
    color: dark ? "#ffffff" : "",
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

    
    "& .MuiTablePagination-selectLabel": {
      color: dark ? "#ffffff" : "",
    },
    "& .MuiTablePagination-displayedRows": {
      color: dark ? "#ffffff" : "",
    },

    
    "& .MuiTablePagination-select": {
      color: dark ? "#ffffff" : "",
    },

    
    "& .MuiSvgIcon-root": {
      color: dark ? "#a0a0a0" : "",
    },

    
    color: dark ? "#ffffff" : "",
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
            color: dark ? "#ffffff" : "",
            backgroundColor: dark ? "#2a2a2a" : "",

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: dark ? "#3a3a3a" : "",
            },

            "& .MuiSvgIcon-root": {
              color: dark ? "#a0a0a0" : "",
            },
          }}
          >
            {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
              <MenuItem key={i} value={i + 1} sx={{
                color: dark ? "#ffffff" : "",

                "&:hover": {
                  backgroundColor: dark ? "#2a2a2a" : "",
                },

                "&.Mui-selected": {
                  backgroundColor: dark ? "#333333" : "",
                },
              }}>
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
  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <div>
      {renderSnackBar()}
      {apiLoading && <Spinner />}
      <Grid
        container
        justifyContent="center"
        sx={{
        mb: 2,
        padding: "10px",
        backgroundColor: dark ? "#1e1e1e" : "",
}}>
        <Search />
      </Grid>
      <ThemeProvider theme={tableTheme}>
        {tableData.length ? 
        <Box
  sx={{
    width: "100%",
    borderRadius: dark ? "8px" : "",
    overflow: "hidden",
    border: dark ? "1px solid #3a3a3a" : "",

    ...(dark && {
      // MAIN WRAPPER
      "& .MuiPaper-root": {
        backgroundColor: "#1e1e1e",
        color: "#ececec",
        border: "none",
        boxShadow: "none",
      },

      // TOOLBAR
      "& .MuiToolbar-root": {
        backgroundColor: "#252525",
        borderBottom: "1px solid #3a3a3a",
      },

      // HEADER
      "& thead th": {
        backgroundColor: "#252525",
        color: "#ececec",
        fontWeight: 700,
        borderBottom: "2px solid #3a3a3a",
        fontSize: "0.85rem",
        letterSpacing: "0.04em",
      },

      // BODY CELLS
      "& tbody td": {
        color: "#d0d0d0",
        borderBottom: "1px solid #2e2e2e",
        fontSize: "0.875rem",
      },

      // ROW STRIPING
      "& tbody tr:nth-of-type(odd)": {
        backgroundColor: "#1e1e1e",
      },
      "& tbody tr:nth-of-type(even)": {
        backgroundColor: "#242424",
      },

      // HOVER
      "& tbody tr:hover": {
        backgroundColor: "rgba(251, 146, 60, 0.08) !important",
      },

      // TITLE
      "& .MuiTypography-root": {
        color: "#ececec",
      },

      // PAGINATION
      "& .MuiTablePagination-root": {
        color: "#a0a0a0",
        backgroundColor: "#252525",
        borderTop: "1px solid #3a3a3a",
      },
      "& .MuiTablePagination-selectLabel": {
        color: "#a0a0a0",
      },
      "& .MuiTablePagination-displayedRows": {
        color: "#a0a0a0",
      },
      "& .MuiTablePagination-select": {
        color: "#ececec",
      },

      // ICONS
      "& .MuiIconButton-root": {
        color: "#fb923c",
        "&:hover": {
          backgroundColor: "rgba(251, 146, 60, 0.12)",
        },
        "&.Mui-disabled": {
          color: "#555",
        },
      },

      // DROPDOWN
      "& .MuiSelect-select": {
        color: "#ececec",
        backgroundColor: "#2a2a2a",
      },
      "& .MuiSelect-icon": {
        color: "#a0a0a0",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3a3a3a",
      },

      // SVG ICONS
      "& .MuiSvgIcon-root": {
        color: "#fb923c",
      },

      // LABELS
      "& label": {
        color: "#a0a0a0",
      },
    }),
  }}
>
  <MUIDataTable
          key={`table-${displayWidth}`}
          title="Queued Task Details"
          data={tableData}
          columns={columns}
          options={{
            ...options,
            tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
          }}
        />  </Box>:
        
          <Box sx={{ display: 'flex', gap: '2em', alignItems: 'center', justifyContent: 'center' }}>
            {!apiLoading && <Typography sx={{
    color: dark ? "#ffffff" : "",
  }}>
              No Queued Tasks to Display
            </Typography>}
          </Box>
        }
      </ThemeProvider>
    </div>
  );
};

export default QueuedTasksDetails;
