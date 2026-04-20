import React, { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import { translate } from "../../config/localisation";
import  "../../styles/Dataset.css";
import { snakeToTitleCase } from "@/utils/utils";
import { useTheme } from "@mui/material/styles";



const SuperCheckerFilter = (props) => {
  const { dark } = useTheme();
  
  const { filterStatusData, currentFilters, updateFilters } = props;
  const [selectedStatus, setSelectedStatus] = useState(currentFilters?.supercheck_status);
  const [selectAnnotator, setSelectAnnotator] = useState("All");

  


  const handleStatusChange = (e) => {
    let statusvalue = !!currentFilters?.supercheck_status ? "supercheck_status" : ""
    const { start_date, end_date, ...restFilters } = currentFilters;
    updateFilters({
      ...restFilters,
      [statusvalue]:selectedStatus,
    })
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
        <Box  className="filterContainer"
  sx={{
    backgroundColor: dark ? "#1f1f1f" : "",
    color: dark ? "#eaeaea" : "",
  }}>
            <Typography
  variant="body2"
  sx={{
    mr: 5,
    fontWeight: "700",
    color: dark ? "#f0f0f0" : "",
  }}
  className="filterTypo"
>
              {translate("label.filter.status")} :
            </Typography>
            <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
              {filterStatusData.Status.map((type,i) => {
                return (
                  <FormControlLabel
                  
                  key={i}
                    control={
                      <Radio
  checked={selectedStatus === type ? true : false}
  name={type}
  sx={{
    color: dark ? "#888" : "",
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
                      color: dark ? "#d6d6d6" : "",
                      "& .MuiFormControlLabel-label": {
                        color: dark ? "#d6d6d6" : "",
                      },
                    }} 
                  />
                );
              })}
            </FormGroup>
            <Divider sx={{ borderColor: dark ? "#333" : "" }} />
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
                sx={{
                  color: dark ? "#e5e5e5" : "",
                  borderColor: dark ? "#444" : "",
                  "&:hover": {
                    backgroundColor: dark ? "#2a2a2a" : "",
                  },
                }}
                variant="outlined"
                color="primary"
                size="small"
                className="clearAllBtn"
              >
                {" "}
                {translate("button.cancel")}
              </Button>
              <Button
                onClick={handleStatusChange}
                sx={{
                  backgroundColor: dark ? "#fb923c" : "",
                  color: dark ? "#111" : "",
                  "&:hover": {
                    backgroundColor: dark ? "#f97316" : "",
                  },
                }}
                variant="contained"
                color="primary"
                size="small"
                className="clearAllBtn"
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
export default SuperCheckerFilter;
