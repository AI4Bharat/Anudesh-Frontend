import { Box, Grid ,Button,Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import DatasetCard from "@/components/common/DatasetCard";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "@/components/common/TablePaginationActions";
// import Spinner from "../../component/common/Spinner";
import { useNavigate } from "react-router-dom";
import DatasetFilterList from "./DatasetFilterList";
import FilterListIcon from "@mui/icons-material/FilterList";


const DatasetCards = (props) => {
    /* eslint-disable react-hooks/exhaustive-deps */

  const { datasetList,selectedFilters,setsSelectedFilters } = props;
  const classes = DatasetStyle();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  // const apiLoading = useSelector(state => state.apiStatus.loading);
  const SearchDataset = useSelector((state) => state.searchProjectCard?.searchValue);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
 

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const rowChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
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

  // useEffect(() => {
  //     setLoading(apiLoading);
  // }, [apiLoading])

  return (
    <React.Fragment>
      {/* <Header /> */}
      {/* {loading && <Spinner />} */}
      <Grid sx={{textAlign:"end",margin:"-20px 10px 10px 0px"}}>
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
        <Tooltip title={"Filter Table"}>
          <FilterListIcon sx={{ color: "#515A5A" }} />
        </Tooltip>
      </Button>
      </Grid>
      {pageSearch().length > 0 && (
        <Box sx={{ margin: "0 auto", pb: 5 }}>
          {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography> */}
          <Grid
            container
            justifyContent={"center"}
            rowSpacing={4}
            spacing={2}
            columnSpacing={{ xs: 1, sm: 1, md: 3 }}
            sx={{ mb: 3 }}
          >
            {pageSearch()
              .map((el, i) => {
                return (
                  <Grid key={el.id} item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <DatasetCard
                      classAssigned={
                        i % 2 === 0
                          ? classes.projectCardContainer2
                          : classes.projectCardContainer1
                      }
                      datasetObj={el}
                      index={i}
                    />
                  </Grid>
                );
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          </Grid>
          <TablePagination
            component="div"
            count={pageSearch().length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[9, 18, 36, 72, { label: "All", value: -1 }]}
            onRowsPerPageChange={rowChange}
            ActionsComponent={TablePaginationActions}
          />
        </Box>
      )}
      <DatasetFilterList
        id={filterId}
        open={popoverOpen}
        anchorEl={anchorEl}
        handleClose={handleClose}
        updateFilters={setsSelectedFilters}
        currentFilters={selectedFilters}
      />
    </React.Fragment>
  );
};

export default DatasetCards;
