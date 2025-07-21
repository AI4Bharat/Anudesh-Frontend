import React, { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { translate } from "../../config/localisation";
import { snakeToTitleCase } from "@/utils/utils";
import "../../styles/Dataset.css";
import Langcode from "@/utils/searchmap";

const SearchPopup = (props) => {
  const { currentFilters, updateFilters, searchedCol } = props;
  
  const [displayValue, setDisplayValue] = useState(
    currentFilters["search_"+searchedCol] ? 
      (typeof currentFilters["search_"+searchedCol] === 'string' ? 
        currentFilters["search_"+searchedCol] : 
        '') 
      : ''
  );

  const handleSearchSubmit = (e) => {
    if (typeof window !== 'undefined') {
      if (searchedCol === 'meta_info_language') {
        const lower = displayValue.toLowerCase().trim();
        const matchedCodes = Object.entries(Langcode)
          .filter(([key, value]) => key.toLowerCase().includes(lower))
          .map(([key, value]) => value);
        
        updateFilters({
          ...currentFilters,
          ["search_" + searchedCol]: matchedCodes.join(','), // Send as comma-separated string
        });
      } else {
        updateFilters({
          ...currentFilters,
          ["search_" + searchedCol]: displayValue,
        });
      }
      
      document.getElementById(searchedCol + "_btn").style.color = "#2C2799";
      props.handleClose();
    }
  };

  const handleClearSearch = (e) => {
    if (typeof window !== 'undefined') {
      const newFilters = {...currentFilters};
      delete newFilters["search_" + searchedCol];
      
      updateFilters(newFilters);
      setDisplayValue("");
      document.getElementById(searchedCol + "_btn").style.color = "rgba(0, 0, 0, 0.54)";
      props.handleClose();
    }
  };

  return (
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
          horizontal: "center",
        }}
      >
       <Box sx={{p:2, display: "flex", flexDirection: "column", gap: 2}}>
        <TextField 
            size="small" 
            variant="outlined" 
            placeholder={`Search ${snakeToTitleCase(searchedCol)}`} 
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
            inputProps={{
                style: {
                    fontSize: "16px"
                }
            }}          
        />
        <Divider />
        <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2}}>
            <Button
                onClick={handleClearSearch}
                variant="outlined"
                color="primary"
                size="small"
                className="clearAllBtn"
            >
                {" "}
                {translate("button.clear")}
            </Button>
            <Button
                onClick={handleSearchSubmit}
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
  );
};
export default SearchPopup;
