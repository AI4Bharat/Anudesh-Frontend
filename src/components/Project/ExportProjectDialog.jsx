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

const ExportProjectDialog = ({
  OpenExportProjectDialog,
  handleClose,
  datasetId,
  setDatasetId,
  datavalue,
  projectType,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */

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
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
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
              <FormControl fullWidth size="small">
                <InputLabel id="language-label" sx={{ fontSize: "16px" }}>
                  Dataset Instance Id
                </InputLabel>
                <Select
                  labelId="language-label"
                  id="language-select"
                  value={datasetId}
                  label="Dataset Instance Id"
                  onChange={(e) => setDatasetId(e.target.value)}
                >
                  {instanceIds?.map((el) => (
                    <MenuItem key={el.instance_id} value={el.instance_id}>
                      {el.instance_name}
                    </MenuItem>
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
          sx={{ lineHeight: "1", borderRadius: "6px" }}
        >
          Close
        </Button>
        <Button variant="text" onClick={datavalue} sx={{ borderRadius: "6px" }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportProjectDialog;
