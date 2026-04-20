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
import { useTheme } from "@/context/ThemeContext";

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
  const { dark } = useTheme();
  const [selectAnnotator, setSelectAnnotator] = useState("All");
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const userDetails = useSelector((state) => state.getLoggedInData?.data);
  useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setSelectedStatus(parsedFilters.selectedStatus || "");
      setpull(parsedFilters.pull || "All");
      setRejected(parsedFilters.rejected || false);
    }
  }, []);

  const pulledstatus = currentFilters?.annotation_status
    ? ["Pulled By reviewer", "Not Pulled By reviewer"]
    : currentFilters?.review_status
      ? ["Pulled By SuperChecker", "Not Pulled By SuperChecker"]
      : null;
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
      // ["editable"]: pullvalue
    });
    props.handleClose();
  };
  return (
    <div>
      <Popover
 slotProps={{
    paper: {
      sx: {
        backgroundColor: dark ? "#1e1e1e" : "",
        color: dark ? "#ececec" : "",
        border: dark ? "1px solid #3a3a3a" : "",
        borderRadius: dark ? "8px" : "",
      },
    },
  }}
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
       <Box
        className="filterContainer"
        sx={{
          color: dark ? "#ececec" : "",
        }}
      >
          <Stack direction="row">
            <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="body2"
                sx={{
                ml: 1,
                fontWeight: "700",
                fontSize: "16px",
                color: dark ? "#ececec" : "",
              }}
                className="filterTypo"
              >
                {translate("label.filter.status")}
              </Typography>
              {filterStatusData.Status.map((type) => {
                return (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedStatus === type ? true : false}
                        name={type}
                        color="primary"
                        sx={{
    color: dark ? "#a0a0a0" : "",
    "&.Mui-checked": {
      color: dark ? "#fb923c" : "",
    },
  }}
                      />
                    }
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    value={type}
                    label={snakeToTitleCase(type)}
                    sx={{
                      fontSize: "1rem",
                    }}
                    disabled={
                      (ProjectDetails.project_stage === 2 ||
                        ProjectDetails?.review_supercheckers?.some(
                          (superchecker) => superchecker.id === userDetails?.id,
                        )) &&
                      type === "rejected"
                    }
                  />
                );
              })}
            </FormGroup>
            <Stack direction="column">
              {currentFilters?.annotation_status ? (
                <FormControl sx={{ m: 1, minWidth: 120,  "& .MuiOutlinedInput-notchedOutline": {
      borderColor: dark ? "#3a3a3a" : "",
    }, }} size="small">
                  <InputLabel
                    id="project-type-label"
                    sx={{
                      fontSize: "16px",
                      position: "inherit",
                      top: "23px",
                      color: dark ? "#a0a0a0" : "",
    backgroundColor: dark ? "#1e1e1e" : "#fff",
                      left: "-3px",
                    }}
                  >
                    Editable
                  </InputLabel>
                  <Select
                    labelId="editable-label"
                    id="editable-select"
                    sx={{
    color: dark ? "#ececec" : "",
    backgroundColor: dark ? "#2a2a2a" : "",
    "& .MuiSvgIcon-root": {
      color: dark ? "#a0a0a0" : "",
    },
  }}
  MenuProps={{
    PaperProps: {
      sx: {
        backgroundColor: dark ? "#2a2a2a" : "",
        color: dark ? "#ececec" : "",
        border: dark ? "1px solid #3a3a3a" : "",
      },
    },
  }}
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
                <FormControl sx={{ m: 1, minWidth: 125 ,  "& .MuiOutlinedInput-notchedOutline": {
      borderColor: dark ? "#3a3a3a" : "",
    }, }} size="small">
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
                    sx={{
    color: dark ? "#ececec" : "",
    backgroundColor: dark ? "#2a2a2a" : "",
    "& .MuiSvgIcon-root": {
      color: dark ? "#a0a0a0" : "",
    },
  }}
  MenuProps={{
    PaperProps: {
      sx: {
        backgroundColor: dark ? "#2a2a2a" : "",
        color: dark ? "#ececec" : "",
        border: dark ? "1px solid #3a3a3a" : "",
      },
    },
  }}
                  >
                   <MenuItem
  value={"All"}
  sx={{
    color: dark ? "#ececec" : "",
    "&:hover": {
      backgroundColor: dark ? "#3a3a3a" : "",
    },
  }}
>
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
                <FormControl sx={{ m: 1, minWidth: 125,  "& .MuiOutlinedInput-notchedOutline": {
      borderColor: dark ? "#3a3a3a" : "",
    }, }} size="small">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rejected}
                        onChange={() => setRejected(!rejected)}
                        sx={{
                        color: dark ? "#a0a0a0" : "",
                        "&.Mui-checked": {
                          color: dark ? "#fb923c" : "",
                        },
                      }}
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
          <Divider sx={{ borderColor: dark ? "#3a3a3a" : "" }} />
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
              sx={{
    color: dark ? "#ececec" : "",
    borderColor: dark ? "#3a3a3a" : "",
    "&:hover": {
      borderColor: dark ? "#fb923c" : "",
      backgroundColor: dark ? "rgba(251,146,60,0.1)" : "",
    },
  }}
            >
              {" "}
              {translate("button.cancel")}
            </Button>
            <Button
              onClick={handleStatusChange}
              variant="contained"
              color="primary"
              size="small"
              className="clearAllBtn"
              sx={{
    backgroundColor: dark ? "#fb923c" : "",
    color: dark ? "#1e1e1e" : "",
    "&:hover": {
      backgroundColor: dark ? "#ea580c" : "",
    },
  }}
            >
              {" "}
              {translate("button.Apply")}
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};
export default FilterList;
