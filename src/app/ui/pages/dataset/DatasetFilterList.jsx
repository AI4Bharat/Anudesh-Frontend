

import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  Popover,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Radio,
  Autocomplete,
  Box,

} from "@mui/material";
import { translate } from "@/config/localisation";
import { useDispatch, useSelector } from "react-redux";
import DatasetStyle from "@/styles/dataset";
import { snakeToTitleCase } from "@/utils/utils";
import MenuItems from "@/components/common/MenuItems"
import { fetchDatasetType } from "@/Lib/Features/datasets/GetDatasetType";

const datasetvisibility = ["all_public_datasets", "my_datasets"];
const DatasetFilterList = (props) => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  const {
    filterStatusData,
    currentFilters,
    updateFilters,
  
  } = props;
  /* eslint-disable react-hooks/exhaustive-deps */

  const [selectDatasetVisibility, setSelectDatasetVisibility] = useState(currentFilters.dataset_visibility || "");
  const [selectedDatasetType, setSelectedDatasetType] = useState(currentFilters.dataset_type || "");
      const [type, setType] = useState([]);

  
  const datasetType = useSelector(state => state.GetDatasetType.data);
  const getProjectDetails = () => {
    dispatch(fetchDatasetType());
  }

  useEffect(() => {
    getProjectDetails();

  }, []);

  useEffect(() => {
    if (datasetType && datasetType.length > 0) {
      let temp = [];
      datasetType.forEach((element) => {
        temp.push({
          name: element,
          value: element,

        });
      });
      setType(temp);
    }
  }, [datasetType]);


  const handleChange = (e) => {
    updateFilters({
      ...currentFilters,
      dataset_visibility :selectDatasetVisibility,
      dataset_type: selectedDatasetType,

    });
    props.handleClose();
  };
  console.log(selectDatasetVisibility,selectedDatasetType);

  const handleChangeCancelAll = () => {
    updateFilters({
        dataset_visibility: "",
        dataset_type: "",
    });
    setSelectedDatasetType("")
    setSelectDatasetVisibility("")
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
        <Grid container className={classes.filterContainer}>
        <Grid item xs={12} md={12} lg={12} xl={12} sm={12} sx={{width:"120px"}}>
        <Typography
              variant="body2"
              sx={{  mb: 1, fontWeight: "900" }}
            >
           Dataset Type :
            </Typography>
              <MenuItems
                menuOptions={type}
                handleChange={(value) => setSelectedDatasetType(value)}
                value={selectedDatasetType}
                label="menuitems"
               
              />
            </Grid>
       
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{mt:2}}>
            <Typography
              variant="body2"
              sx={{  mb: 1, fontWeight: "900" }}
            >
            Dataset Visibility :
            </Typography>
            <FormGroup>
              {datasetvisibility.map((type,i) => {
                return (
                  <FormControlLabel
                  key={i}
                    control={
                      <Radio
                        checked={ selectDatasetVisibility === type }
                        key={i}
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => setSelectDatasetVisibility(e.target.value)}
                    value={type}
                    label={snakeToTitleCase(type)}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                );
              })}
            </FormGroup>
          </Grid>
         
        </Grid>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            columnGap: "10px",
            padding:"15px"
          }}
        >
          <Button
            onClick={handleChangeCancelAll}
            variant="outlined"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            Clear All
          </Button>
          <Button
            onClick={handleChange}
            variant="contained"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            Apply
          </Button>
        </Box>
      </Popover>
    </div>
  );
};
export default DatasetFilterList;
