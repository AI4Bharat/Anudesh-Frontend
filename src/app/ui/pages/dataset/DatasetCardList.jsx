import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dynamic from 'next/dynamic';
import CustomButton from "@/components/common/Button";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import tableTheme from "@/themes/tableTheme";
import { useSelector } from "react-redux";
import FilterListIcon from "@mui/icons-material/FilterList";
import DatasetFilterList from "./DatasetFilterList";
import InfoIcon from '@mui/icons-material/Info';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
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

const DatasetCardList = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const [displayWidth, setDisplayWidth] = useState(0);
  const { dark } = useTheme();
  const { datasetList, selectedFilters, setsSelectedFilters } = props;
  const SearchDataset = useSelector((state) => state.searchProjectCard?.searchValue);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;

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

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pageSearch = () => {
    return datasetList.filter((el) => {
      if (SearchDataset == "") {
        return el;
      } else if (
        el.dataset_type?.toLowerCase().includes(SearchDataset?.toLowerCase())
      ) {
        return el;
      } else if (
        el.instance_name?.toLowerCase().includes(SearchDataset?.toLowerCase())
      ) {
        return el;
      } else if (
        el.instance_id
          .toString()
          ?.toLowerCase()
          ?.includes(SearchDataset?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const columns = [
    {
      name: "Dataset_id",
      label: "Dataset Id",
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
      name: "Dataset_Title",
      label: "Dataset Title",
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
      name: "Dataset_Type",
      label: "Dataset Type",
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

    {
      name: "Action",
      label: "Action",
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
    datasetList && datasetList.length > 0
      ? pageSearch().map((el, i) => {
        return [
          el.instance_id,
          el.instance_name,
          el.dataset_type,
          <Link
            key={i}
            to={`/datasets/${el.instance_id}`}
            style={{ textDecoration: "none" }}
          >
            <CustomButton
              sx={{ borderRadius: 2, marginRight: 2 }}
              label="View"
            />
          </Link>,
        ];
      })
      : [];

  const areFiltersApplied = (filters) => {
    return Object.values(filters).some((value) => value !== "");
  };

  const filtersApplied = areFiltersApplied(selectedFilters);
  console.log("filtersApplied", filtersApplied);

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#e0e0e0',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 300,
      fontSize: theme.typography.pxToRem(12),
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "#e0e0e0",
    },
  }));

  const renderToolBar = () => {
    return (
      <div>
        <Button style={{ minWidth: '25px', position: "relative" }} onClick={handleShowFilter}>
          {filtersApplied && <InfoIcon color="primary" fontSize="small" sx={{ position: "absolute", top: -4, right: -4 }} />}
          <CustomTooltip
            title={
              filtersApplied ? (
                <Box style={{ fontFamily: 'Roboto, sans-serif' }} sx={{ padding: '5px', maxWidth: '300px', fontSize: '12px', display: "flex", flexDirection: "column", gap: "5px" }}>
                  {selectedFilters.dataset_type && <div><strong>Dataset Type:</strong> {selectedFilters.dataset_type}</div>}
                  {selectedFilters.dataset_visibility && <div><strong>Dataset Visibility:</strong> {selectedFilters.dataset_visibility}</div>}
                </Box>
              ) : (
                <span style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Filter Table
                </span>
              )
            }
            disableInteractive
          >
            <FilterListIcon sx={{ color: '#515A5A' }} />
          </CustomTooltip>
        </Button>
      </div>
    );
  };
  const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: { xs: "space-between", md: "flex-end" },
        alignItems: "center",
        padding: "10px",
        gap: { xs: "10px", md: "20px" },
        backgroundColor: dark ? "#252525" : "",
        borderTop: dark ? "1px solid #3a3a3a" : "",
        color: dark ? "#a0a0a0" : "",
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
  color: dark ? "#a0a0a0" : "",
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
    color: dark ? "#ececec" : "",
    backgroundColor: dark ? "#2a2a2a" : "",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" },
    "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" },
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
    customToolbar: renderToolBar,
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
  <Box sx={{ backgroundColor: dark ? "#1e1e1e" : "", borderRadius: dark ? "8px" : "", overflow: "hidden" }}>
   <ThemeProvider theme={tableTheme}>
  <Box sx={{
    ...(dark && {
      "& .MuiTablePagination-selectLabel": {
  color: "#a0a0a0",   // "Rows per page"
},

"& .MuiTablePagination-displayedRows": {
  color: "#a0a0a0",   // "1–10 of 2166"
},

"& .MuiTablePagination-select": {
  color: "#ececec",   // the "10" dropdown value
},

"& .MuiTablePagination-actions button": {
  color: "#fb923c",   // next/prev arrows
},
      "& .MuiPaper-root": { backgroundColor: "#1e1e1e", color: "#ececec", border: "none", boxShadow: "none" },
      "& .MuiToolbar-root": { backgroundColor: "#252525", borderBottom: "1px solid #3a3a3a" },
      "& thead th": { backgroundColor: "#252525", color: "#ececec", fontWeight: 700, borderBottom: "2px solid #3a3a3a" },
      "& tbody td": { color: "#d0d0d0", borderBottom: "1px solid #2e2e2e" },
      "& tbody tr:nth-of-type(odd)": { backgroundColor: "#1e1e1e" },
      "& tbody tr:nth-of-type(even)": { backgroundColor: "#242424" },
      "& tbody tr:hover": { backgroundColor: "rgba(251, 146, 60, 0.08) !important", transition: "background-color 0.2s ease" },
      "& .MuiTypography-root": { color: "#ececec" },
      "& .MuiTablePagination-root": { color: "#a0a0a0", backgroundColor: "#252525", borderTop: "1px solid #3a3a3a" },
      "& .MuiIconButton-root": { color: "#fb923c", "&:hover": { backgroundColor: "rgba(251, 146, 60, 0.12)" }, "&.Mui-disabled": { color: "#555555" } },
      "& .MuiSelect-select": { color: "#ececec", backgroundColor: "#2a2a2a" },
      "& .MuiSvgIcon-root": { color: "#fb923c" },
    })
  }}>
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
  </Box>
</ThemeProvider>
      <DatasetFilterList
        id={filterId}
        open={popoverOpen}
        anchorEl={anchorEl}
        handleClose={handleClose}
        updateFilters={setsSelectedFilters}
        currentFilters={selectedFilters}
      />
   </Box>
);
};

export default DatasetCardList;
