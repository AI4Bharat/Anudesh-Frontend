import React, { useState } from "react";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import CustomButton from "@/components/common/Button";
import { ThemeProvider, Tooltip, Button, Badge } from "@mui/material";
import tableTheme from "@/themes/tableTheme";
import { useSelector } from "react-redux";
import FilterListIcon from "@mui/icons-material/FilterList";
import DatasetFilterList from "./DatasetFilterList";
import useMediaQuery from "@mui/material/useMediaQuery";

const DatasetCardList = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { datasetList, selectedFilters, setsSelectedFilters } = props;
  const SearchDataset = useSelector(
    (state) => state.searchProjectCard?.searchValue,
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;

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
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding: "16px" },
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
      },
    },

    {
      name: "Dataset_Type",
      label: "Dataset Type",
      options: {
        filter: false,
        sort: false,
      },
    },

    {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
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

  const renderToolBar = () => {
    return (
      <div style={{ position: "relative" }}>
        {/* <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
          <Tooltip title={"Filter Table"}>
            <FilterListIcon sx={{ color: "#515A5A" }} />
          </Tooltip>
        </Button> */}
        <Badge
          color="primary"
          variant="dot"
          invisible={!filtersApplied}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        />
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
          <Tooltip
            title={
              <span style={{ fontFamily: "Roboto, sans-serif" }}>
                Filter Table
              </span>
            }
          >
            <FilterListIcon sx={{ color: "#515A5A" }} />
          </Tooltip>
        </Button>
      </div>
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
    customToolbar: renderToolBar,
  };
  const isXLarge = useMediaQuery("(min-width: 1280px)");
  const isLarge = useMediaQuery("(min-width: 769px) and (max-width: 1279px)");
  const isMedium = useMediaQuery("(min-width: 481px) and (max-width: 768px)");
  const isSmall = useMediaQuery("(max-width: 480px)");

  // Adjust columns based on screen size
  const responsiveColumns = React.useMemo(() => {
    if (isXLarge) {
      return columns; // Full set of columns
    }
    if (isLarge) {
      return columns.slice(0, Math.max(columns.length - 1, 2)); // Slightly reduced
    }
    if (isMedium) {
      return columns.slice(0, 2); // Limited columns
    }
    if (isSmall) {
      return columns.slice(0, 1); // Minimal columns
    }
    return columns; // Default
  }, [isXLarge, isLarge, isMedium, isSmall, columns]);

  // Adjust options based on screen size
  const responsiveOptions = {
    ...options,
    rowsPerPage: isSmall ? 5 : 10,
    rowsPerPageOptions: isSmall ? [5] : [10, 25, 50],
    responsive: "standard", // Can also use "vertical" or "simple" for better small screen support
  };

  return (
    <div>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={""}
          data={data}
          columns={responsiveColumns}
          options={responsiveOptions}
        />
      </ThemeProvider>
      <DatasetFilterList
        id={filterId}
        open={popoverOpen}
        anchorEl={anchorEl}
        handleClose={handleClose}
        updateFilters={setsSelectedFilters}
        currentFilters={selectedFilters}
      />
    </div>
  );
};

export default DatasetCardList;
