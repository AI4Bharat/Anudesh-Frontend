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



const SuperCheckerFilter = (props) => {
  
  const { filterStatusData, currentFilters, updateFilters } = props;
  const [selectedStatus, setSelectedStatus] = useState(currentFilters?.supercheck_status);
  const [selectAnnotator, setSelectAnnotator] = useState("All");

  


  const handleStatusChange = (e) => {
    let statusvalue =  !!currentFilters?.supercheck_status? "supercheck_status":""
    updateFilters({
      ...currentFilters,
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
        <Box className="filterContainer">
            <Typography variant="body2" sx={{ mr: 5, fontWeight: "700" }} className="filterTypo">
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
                        color="primary"
                      />
                    }
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    value={type}
                    label={snakeToTitleCase(type)}
                    sx={{
                      fontSize: "1rem",
                    }} 
                  />
                );
              })}
            </FormGroup>
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
                {" "}
                {translate("button.cancel")}
              </Button>
              <Button
                onClick={handleStatusChange}
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
