import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import { translate } from "../../config/localisation";
import "../../styles/Dataset.css";
import { snakeToTitleCase } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/material";

const FilterList = (props) => {
  const {
    filterStatusData,
    currentFilters,
    updateFilters,
    pull,
    setpull,
    rejected,
    setRejected,
    selectedStatus,
    setSelectedStatus,
    pullvalue,
  } = props;
  const [selectAnnotator, setSelectAnnotator] = useState("All");
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const userDetails = useSelector((state) => state.getLoggedInData?.data);
  
  // Get default status based on type
  const getDefaultStatus = () => {
    return currentFilters?.annotation_status 
      ? "unlabeled" 
      : "unreviewed";
  };

  useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setSelectedStatus(parsedFilters.selectedStatus || getDefaultStatus());
      setpull(parsedFilters.pull || "All");
      setRejected(parsedFilters.rejected || false);
    }
  }, []);

  const pulledstatus = currentFilters?.annotation_status
    ? ["Pulled By reviewer", "Not Pulled By reviewer"]
    : currentFilters?.review_status
      ? ["Pulled By SuperChecker", "Not Pulled By SuperChecker"]
      : null;

  // Direct status change handler without Apply button
  const handleDirectStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    let statusvalue = !!currentFilters?.annotation_status
      ? "annotation_status"
      : "review_status";
    
    localStorage.setItem(
      "filters",
      JSON.stringify({
        selectedStatus: newStatus,
        pull,
        rejected,
      })
    );

    const { start_date, end_date, ...restFilters } = currentFilters;
    updateFilters({
      ...restFilters,
      [statusvalue]: newStatus,
    });
  };

  // NEW: Clear button handler - resets to default status
  const handleClearStatus = () => {
    const defaultStatus = getDefaultStatus();
    setSelectedStatus(defaultStatus);
    
    let statusvalue = !!currentFilters?.annotation_status
      ? "annotation_status"
      : "review_status";
    
    localStorage.setItem(
      "filters",
      JSON.stringify({
        selectedStatus: defaultStatus,
        pull,
        rejected,
      })
    );

    const { start_date, end_date, ...restFilters } = currentFilters;
    updateFilters({
      ...restFilters,
      [statusvalue]: defaultStatus,
    });
  };

  const handleStatusChange = (e) => {
    let statusvalue = !!currentFilters?.annotation_status
      ? "annotation_status"
      : "review_status";
    localStorage.setItem(
      "filters",
      JSON.stringify({
        selectedStatus,
        pull,
        rejected,
      }),
    );
    const { start_date, end_date, ...restFilters } = currentFilters;
    updateFilters({
      ...restFilters,
      [statusvalue]: selectedStatus,
    });
    props.handleClose();
  };

  return (
    <div>
      <Popover
        id={props.id}
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box className="filterContainer">
          <Stack direction="row">
            <FormGroup sx={{ display: "flex", flexDirection: "column", minWidth: 250 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "700", fontSize: "16px" }}
                  className="filterTypo"
                >
                  {translate("label.filter.status")}
                </Typography>
                
                {/* NEW: Clear button */}
                <Button 
                  size="small" 
                  onClick={handleClearStatus}
                  sx={{ 
                    textTransform: 'none',
                    color: 'primary.main',
                    fontSize: '12px',
                    minWidth: 'auto',
                    p: '4px 8px'
                  }}
                >
                  Clear
                </Button>
              </Box>
              
              {/* Status dropdown */}
              <FormControl sx={{ width: '100%' }} size="small">
                <Select
                  value={selectedStatus}
                  onChange={(e) => handleDirectStatusChange(e.target.value)}
                  sx={{ fontSize: "14px" }}
                >
                  {filterStatusData.Status.map((type) => (
                    <MenuItem 
                      key={type} 
                      value={type}
                      disabled={
                        (ProjectDetails.project_stage === 2 ||
                          ProjectDetails?.review_supercheckers?.some(
                            (superchecker) => superchecker.id === userDetails?.id,
                          )) &&
                        type === "rejected"
                      }
                    >
                      {snakeToTitleCase(type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FormGroup>
            
            {/* Rest of your existing code remains exactly the same */}
            <Stack direction="column">
              {currentFilters?.annotation_status ? (
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel
                    id="project-type-label"
                    sx={{
                      fontSize: "16px",
                      position: "inherit",
                      top: "23px",
                      left: "-3px",
                    }}
                  >
                    Editable
                  </InputLabel>
                  <Select
                    labelId="editable-label"
                    id="editable-select"
                    value={pull}
                    defaultValue={"All"}
                    label="editable"
                    onChange={(e) => setpull(e.target.value)}
                  >
                    <MenuItem value={"All"} selected>
                      All
                    </MenuItem>
                    {pulledstatus.map((type, index) => (
                      <MenuItem value={type} key={index}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : currentFilters?.review_status ? (
                <FormControl sx={{ m: 1, minWidth: 125 }} size="small">
                  <InputLabel
                    id="project-type-label"
                    sx={{
                      fontSize: "16px",
                      position: "inherit",
                      top: "23px",
                      left: "-3px",
                    }}
                  >
                    Editable
                  </InputLabel>
                  <Select
                    labelId="editable-label"
                    id="editable-select"
                    value={pull}
                    label="editable"
                    defaultValue={"All"}
                    onChange={(e) => setpull(e.target.value)}
                  >
                    <MenuItem value={"All"} selected>
                      All
                    </MenuItem>
                    {pulledstatus.map((type, index) => (
                      <MenuItem value={type} key={index}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
              {currentFilters?.annotation_status &&
              selectedStatus !== "unlabeled" ? (
                <FormControl sx={{ m: 1, minWidth: 125 }} size="small">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rejected}
                        onChange={() => setRejected(!rejected)}
                      />
                    }
                    label={
                      currentFilters?.annotation_status
                        ? "Rejected By reviewer"
                        : currentFilters?.review_status
                          ? "Rejected By SuperChecker"
                          : null
                    }
                  />
                </FormControl>
              ) : currentFilters?.review_status &&
                selectedStatus !== "unreviewed" ? (
                <FormControl sx={{ m: 1, minWidth: 125 }} size="small">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rejected}
                        onChange={() => setRejected(!rejected)}
                      />
                    }
                    label={
                      currentFilters?.annotation_status
                        ? "Rejected By reviewer"
                        : currentFilters?.review_status
                          ? "Rejected By SuperChecker"
                          : null
                    }
                  />
                </FormControl>
              ) : null}
            </Stack>
          </Stack>
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              columnGap: "10px",
            }}
          >
            <Button
              onClick={props.handleClose}
              variant="outlined"
              color="primary"
              size="small"
              className="clearAllBtn"
            >
              {translate("button.cancel")}
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default FilterList;
