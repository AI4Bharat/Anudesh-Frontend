import React, { useState, useRef } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  Popover,
  List,
  ListItem,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Radio,
  Autocomplete,
  Tooltip,
  Box
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import  "../../styles/Dataset.css";
import { translate } from "../../config/localisation";


const ColumnList = (props) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef();

  return (
    <div>
      {/* <Tooltip title="View Columns">
        <Button onClick={() => setIsOpen(!isOpen)} ref={buttonRef}>
          <ViewColumnIcon />
        </Button>
      </Tooltip> */}

      <Tooltip
      title={
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>
          View Columns
        </span>
      }
    >
      <Button onClick={() => setIsOpen(!isOpen)} ref={buttonRef}>
        <ViewColumnIcon />
      </Button>
    </Tooltip>
      <Popover
        id={props.id}
        open={isOpen}
        anchorEl={buttonRef.current}
        onClose={() => setIsOpen(false)}
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
        <Typography
          variant="body2"
          sx={{ mr: 5, fontWeight: "700" }}
          className="filterTypo"
        >
          {translate("label.filter.column")} :
        </Typography>
        <List sx={{ width: "100%" }}>
          {props.columns.map((column, index) => (
            <ListItem key={index} sx={{padding: "0"}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.selectedColumns.includes(column.name)}
                    onChange={() => {
                      if (props.selectedColumns.includes(column.name)) {
                        props.setColumns(
                          props.selectedColumns.filter(
                            (selectedColumn) => selectedColumn !== column.name
                          )
                        );
                      } else {
                        props.setColumns((prev) => [...prev, column.name]);
                      }
                    }}
                  />
                }
                label={column.label}
              />
            </ListItem>
          ))}
        </List>
        {/* <Divider />
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
            onClick={() => setIsOpen(false)}
            variant="outlined"
            color="primary"
            size="small"
            className="clearAllBtn"
          >
            {" "}
            Close
          </Button>
        </Box> */}
      </Box>
      </Popover>
    </div>
  );
};
export default ColumnList;
