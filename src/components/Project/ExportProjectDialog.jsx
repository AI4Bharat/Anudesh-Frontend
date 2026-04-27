import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import ListItemIcon from "@mui/material/ListItemIcon";
import Chip from "@mui/material/Chip";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatasetStyle from "@/styles/dataset";
import CancelIcon from "@mui/icons-material/Cancel";
import { fetchDatasetByType } from "@/Lib/Features/datasets/getDatasetByType";
import { useTheme } from "@/context/ThemeContext";

const ExportProjectDialog = ({
  OpenExportProjectDialog,
  handleClose,
  datasetId,
  setDatasetId,
  datavalue,
  projectType,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
const { dark } = useTheme();
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const [instanceIds, setInstanceIds] = useState([]);

  const DatasetInstances = useSelector(
    (state) => state.getDatasetByType?.data,
  );

  useEffect(() => {
    let data ;
    if(projectType=="Instruction"){
       data = "Interaction"
    }
    else{
      data = "PromptAnswer"
    }

    dispatch(fetchDatasetByType(data));
  }, []);

  useEffect(() => {
    if (
      !(
        DatasetInstances &&
        Object.keys(DatasetInstances).length === 0 &&
        Object.getPrototypeOf(DatasetInstances) === Object.prototype
      )
    ) {
      setInstanceIds(DatasetInstances);
    }
  }, [DatasetInstances]);
  return (
    <Dialog
      open={OpenExportProjectDialog}
      PaperProps={{
        sx: {
          backgroundColor: dark ? "#1e1e1e" : "",
          color: dark ? "#ececec" : "",
          borderRadius: dark ? "10px" : "",
        }
      }}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
      sx={{
        backgroundColor: dark ? "#1e1e1e" : "",
        color: dark ? "#ececec" : "",
      }}
    >
        <DialogContentText id="alert-dialog-description">
          <Grid
            container
            direction="row"
            sx={{
              alignItems: "center",
              // justifyContent: "space-between",
            }}
          >
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl
  fullWidth
  size="small"
  variant="outlined"
  sx={{
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: dark ? "#3a3a3a" : "",
    },
  }}
>
  <InputLabel
    id="language-label"
    sx={{
      fontSize: "16px",
      color: dark ? "#a0a0a0" : "",
      backgroundColor: dark ? "#1e1e1e" : "#fff",
      px: 0.5,
    }}
  >
    Dataset Instance Id
  </InputLabel>
               <Select
                labelId="language-label"
                label="Dataset Instance Id"
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
                    }
                  }
                }}
                  id="language-select"
                  value={datasetId}
                  onChange={(e) => setDatasetId(e.target.value)}
                >
                  {instanceIds?.map((el) => (
                   <MenuItem
                  key={el.instance_id}
                  value={el.instance_id}
                  sx={{
                    color: dark ? "#ececec" : "",
                    "&:hover": {
                      backgroundColor: dark ? "#3a3a3a" : "",
                    },
                  }}
                ></MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "6px",color: dark ? "#fb923c" : "","&:hover": {
      backgroundColor: dark ? "rgba(251,146,60,0.1)" : "",
    }, }}
          
        >
          Close
        </Button>
        <Button variant="text" onClick={datavalue} sx={{ borderRadius: "6px", color: dark ? "#fb923c" : "",
    "&:hover": {
      backgroundColor: dark ? "rgba(251,146,60,0.1)" : "",
    }, }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportProjectDialog;
