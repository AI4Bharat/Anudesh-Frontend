import { Box, Grid,Button,Tooltip,Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProjectCard from "../common/ProjectCard";
import Link from 'next/link'
import  "../../styles/Dataset.css";
import DatasetStyle from "@/styles/dataset";
// import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../common/TablePaginationActions";
import Spinner from "../common/Spinner";
import Search from "../common/Search";
// import SearchProjectCards from "../../../../redux/actions/api/ProjectDetails/SearchProjectCards";
// import Record from "../../../../assets/no-record.svg";
import ProjectFilterList from "../common/ProjectFilterList";
import FilterListIcon from "@mui/icons-material/FilterList";
import UserMappedByProjectStage from "../../utils/UserMappedByProjectStage";


const Projectcard = (props) => {
  const { projectData, selectedFilters, setsSelectedFilters } = props;
  const classes = DatasetStyle();
//   const SearchProject = useSelector((state) => state.SearchProjectCards.data);
  const SearchProject = []
  const [page, setPage] = useState(0);
  
  const [rowsPerPage, setRowsPerPage] = useState(9);
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
    return projectData.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        el.project_type?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }  else if (
        el.title?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.id.toString()?.toLowerCase()?.includes(SearchProject.toLowerCase())
      ) {
        return el;
      }else if (
        el.workspace_id.toString()?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;}
        else if (
          el.tgt_language?.toLowerCase().includes(SearchProject?.toLowerCase())
        ) {
          return el;}
          // else if (
          //   UserMappedByProjectStage(el.project_stage)
          //     ?.name?.toLowerCase()
          //     .includes(SearchProject?.toLowerCase())
          // ) {

            return el;
          // }
    });
  };

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
                    <ProjectCard
                      classAssigned={
                        i % 2 === 0
                          ? classes.projectCardContainer2
                          : classes.projectCardContainer1
                      }
                      projectObj={el}
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
      <ProjectFilterList
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

export default Projectcard;
