
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import tableTheme from "../../themes/tableTheme";
import CustomizedSnackbars from "../common/Snackbar";
import Spinner from "../common/Spinner";
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


const SuperChecker = (props) => {
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

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

    ...(dark && {
      backgroundColor: "#252525",
      borderTop: "1px solid #3a3a3a",
      color: "#a0a0a0",
    }),
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

  ...(dark && {
    color: "#a0a0a0",

    "& .MuiTablePagination-selectLabel": {
      color: "#a0a0a0",
    },
    "& .MuiTablePagination-displayedRows": {
      color: "#a0a0a0",
    },
    "& .MuiSvgIcon-root": {
      color: "#fb923c",
    },
  }),
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

    ...(dark && {
      color: "#ececec",
      backgroundColor: "#2a2a2a",

      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3a3a3a",
      },

      "& .MuiSvgIcon-root": {
        color: "#a0a0a0",
      },
    }),
  }}
>
            {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
              <MenuItem
  key={i}
  value={i + 1}
  sx={{
    ...(dark && {
      color: "#ececec",

      "&:hover": {
        backgroundColor: "#2a2a2a",
      },

      "&.Mui-selected": {
        backgroundColor: "#333",
      },
    }),
  }}
></MenuItem>
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

  return (
    <div>
      {renderSnackBar()}
      {loading && <Spinner />}
     <ThemeProvider theme={tableTheme}>
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

        // TOOLBAR (title area)
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
        },

        // BODY CELLS
        "& tbody td": {
          color: "#d0d0d0",
          borderBottom: "1px solid #2e2e2e",
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
          backgroundColor: "rgba(251,146,60,0.08) !important",
        },

        // TITLE TEXT
        "& .MuiTypography-root": {
          color: "#ececec",
        },

        // PAGINATION ROOT
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
        "& .MuiSvgIcon-root": {
          color: "#fb923c",
        },

        // SELECT DROPDOWN
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

        // LABEL
        "& label": {
          color: "#a0a0a0",
        },
      }),
    }}
  >
    <MUIDataTable
          key={`table-${displayWidth}`}
          title={dark ? " " : ""}
          //   data={data}
          //   columns={columns}
          options={{
            ...options,
            tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
          }}
        />
        </Box>
      </ThemeProvider>


    </div>
  );
};

export default SuperChecker;

