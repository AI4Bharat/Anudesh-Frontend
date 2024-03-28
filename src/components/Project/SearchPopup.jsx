import React, { useState } from "react";
import {
  Button,
  Divider,
  Typography,
  Popover,
  Box,
  TextField
} from "@mui/material";
import { translate } from "../../config/localisation";
import { snakeToTitleCase } from "@/utils/utils";
import  "../../styles/Dataset.css";

const SearchPopup = (props) => {
    
  const { currentFilters, updateFilters, searchedCol } = props;
  const [searchValue, setSearchValue] = useState(currentFilters["search_"+searchedCol]);
  
  const handleSearchSubmit = (e) => {
    if (typeof window !== 'undefined') {
    updateFilters({
      ...currentFilters,
      ["search_"+searchedCol]: searchValue,
    });
    document.getElementById(searchedCol + "_btn").style.color = "#2C2799";
    props.handleClose();
  }
  };

  const handleClearSearch = (e) => {
    if (typeof window !== 'undefined') {

    updateFilters({
        ...currentFilters,
        ["search_"+searchedCol]: "",
    });
    setSearchValue("");
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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
