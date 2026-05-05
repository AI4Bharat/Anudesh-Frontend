import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { translate } from "@/config/localisation";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomizedSnackbars from "@/components/common/Snackbar";
import LoginAPI from "@/app/actions/api/user/Login";
import DeleteDataItemsAPI from "@/app/actions/api/dataset/DeleteDataItemsAPI";
import fetchParams from "@/Lib/fetchParams";
import { useTheme } from "@/context/ThemeContext";
import ENDPOINTS from "../../config/apiendpoint"

export default function DeleteDataItems() {
          /* eslint-disable react-hooks/exhaustive-deps */

    const classes = DatasetStyle();
    const { datasetId } = useParams();
    const { dark } = useTheme();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [startdataid, setStartDataId] = useState("");
    const [enddataid, setEndDataId] = useState("");
    const [loading, setLoading] = useState(false);
    const [radiobutton, setRadiobutton] = useState(true)
    const [dataIds, setDataIds] = useState("")
    const [openDialog, setOpenDialog] = useState(false);
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [openPreview, setOpenPreview] = useState(false); 
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    useEffect(() => {
        if (datasetId) {
          const fetchDataset = async () => {
            try {
              const params = fetchParams(`${ENDPOINTS.getDatasets}instances/${datasetId}/download/?export_type=JSON`);
              const response = await fetch(params.url, params.options);
              const jsonData = await response.json();
              console.log(jsonData)
              setData(jsonData)
              
            } catch (err) {
              console.log(err); // Handle any errors
            }
          };
    
          fetchDataset();
        }
      }, [datasetId]);
      console.log(JSON.stringify(data))

      useEffect(() => {
        if (data && data.length > 0) {
          const filterData = () => {
            let filtered;
            const idsToDelete = dataIds.split(',').map(id => Number(id.trim())); // Use trim()
    
            console.log(idsToDelete);
            if (radiobutton) {
              filtered = data.filter(item => item.id >= startdataid && item.id <= enddataid);
            } else {
                filtered = data.filter(item => idsToDelete.includes(Number(item.id)));
    
              console.log(filtered)
            }
            setFilteredData(filtered);
           
          };
          filterData();
        }
      }, [data, startdataid, enddataid, radiobutton, dataIds]);
      console.log(JSON.stringify(filteredData))
    const Dataitems = JSON.parse( localStorage.getItem("DataitemsList"))

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    let datasetitem = dataIds.split(",")
    var value = datasetitem.map(function (str) {
        return parseInt(str);
    });


    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClearSearch = () => {
        setAnchorEl(null);
        setStartDataId();
        setEndDataId();
        setDataIds("");

    };
    const handleDeletebyids = () => {
        setRadiobutton(true)

    }
    const handleDeletebyrange = () => {
        setRadiobutton(false)
    }


    const handledataIds = (e,) => {
        setDataIds(e.target.value);


    }
    const handleok = async() => {
        setOpenDialog(false);
        setAnchorEl(null);
        setStartDataId();
        setEndDataId();
        setDataIds("");
        let datasetObj;
        const DeleteDataItems = {
            data_item_start_id: parseInt(startdataid),
            data_item_end_id: parseInt(enddataid)
        }

        const dataitemids = {
            data_item_ids: value
        }

        if (radiobutton === true) {
            datasetObj = new DeleteDataItemsAPI(datasetId, DeleteDataItems)


        } else {
            datasetObj = new DeleteDataItemsAPI(datasetId, dataitemids)
        }
        // dispatch(APITransport(datasetObj));
        const res = await fetch(datasetObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(datasetObj.getBody()),
            headers: datasetObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "success",
            })

        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }  
    }

    const handleSearchSubmit = async () => {
        setOpenDialog(false);
        setOpenPreview(true);

    }
    const closePreview = () => {
        setOpenPreview(false);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const renderSnackBar = () => {
        return (
            <CustomizedSnackbars
                open={snackbar.open}
                handleClose={() =>
                    setSnackbarInfo({ open: false, message: "", variant: "" })
                }
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                variant={snackbar.variant}
                message={snackbar.message}
            />
        );
    };

    const emailId = localStorage.getItem("email_id");
    const [password, setPassword] = useState("");
    const handleConfirm = async () => {
      const apiObj = new LoginAPI(emailId, password);
        const res = await fetch(apiObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
        });
        const rsp_data = await res.json();
        if (res.ok) {
        handleok();
        }else{
        window.alert("Invalid credentials, please try again");
        }
    };

    return (
        <div >
            {renderSnackBar()}
            <Button
                sx={{ width: "100%" }}
                aria-describedby={id}
                variant="contained"
                color="error"
                onClick={handleClick}
                disabled={
                    Dataitems.length < 0
                      ? true
                      : false
                  }
                >
                Delete Data Item
            </Button>

           <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                PaperProps={{
                    sx: {
                    backgroundColor: dark ? "#2a2a2a" : "",
                    color: dark ? "#ececec" : "",
                    border: dark ? "1px solid #3a3a3a" : "",
                    boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.5)" : "",
                    }
                }}
                >
                <Grid container className={classes.root} >
                    <Grid item style={{ flexGrow: "1", padding: "10px" }}>
                        <FormControl >
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                defaultValue="deletebyrange"

                            >

                                <FormControlLabel value="deletebyrange" control={<Radio />} label="Delete by Range" onClick={handleDeletebyids} sx={{ color: dark ? "#ececec" : "" }} />
                                <FormControlLabel value="deletebyids" control={<Radio />} label="Delete by IDs" onClick={handleDeletebyrange} sx={{ color: dark ? "#ececec" : "" }} />

                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>

                {radiobutton === true &&
                    <>

                        <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                p: 1
                            }}
                        >

                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={4}
                                xl={4}
                            >
                                <Typography variant="body2" fontWeight='700' label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                                    Start Data ID:
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={6}
                                xl={6}
                                sm={6}
                            >
                               <TextField
                            size="small"
                            variant="outlined"
                            value={startdataid}
                            onChange={(e) => setStartDataId(e.target.value)}
                            inputProps={{
                                style: {
                                fontSize: "16px",
                                color: dark ? "#ececec" : "",
                                }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                backgroundColor: dark ? "#1e1e1e" : "",
                                "& fieldset": { borderColor: dark ? "#3a3a3a" : "" },
                                "&:hover fieldset": { borderColor: dark ? "#fb923c" : "" },
                                }
                            }}
                            />

                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                p: 1
                            }}
                        >
                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={4}
                                xl={4}
                            >
                                <Typography variant="body2" fontWeight='700' label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                                    End Data ID:
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={6}
                                xl={6}
                                sm={6}
                            >
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    value={enddataid}
                                    onChange={(e) => setEndDataId(e.target.value)}
                                    inputProps={{
                                        style: {
                                            fontSize: "16px"
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </>
                }
                {radiobutton === false &&
                    <Grid
                        container
                        direction='row'
                        sx={{
                            alignItems: "center",
                            p: 1
                        }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={3}
                            xl={3}
                        >
                            <Typography variant="body2" fontWeight='700' label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                                Data IDs:
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={6}
                            xl={6}
                            sm={6}
                        >

                            <TextField
                                size="small"
                                variant="outlined"
                                value={dataIds}
                                onChange={handledataIds}
                                inputProps={{
                                    style: {
                                        fontSize: "16px"
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                }


                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 1 }}>
                    <Button
                        onClick={handleClearSearch}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                    >
                        {" "}
                        {translate("button.clear")}
                    </Button>
                    <Button
                        onClick={handleSearchSubmit}
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                    // disabled={(!startdataid  || !enddataid  ) && !dataIds}
                    >
                        {" "}
                        {translate("button.submit")}
                    </Button>
                </Box>
            </Popover>
            <Dialog
  open={openPreview}
  onClose={closePreview}
  fullWidth
  maxWidth="md"
  PaperProps={{
    sx: {
      backgroundColor: dark ? "#2a2a2a" : "",
      color: dark ? "#ececec" : "",
      border: dark ? "1px solid #3a3a3a" : "",
    }
  }}
>
  <DialogTitle sx={{ color: dark ? "#ececec" : "" }}>Preview of Data Items to Delete</DialogTitle>
  <DialogContent sx={{ backgroundColor: dark ? "#2a2a2a" : "" }}>
                {filteredData.length > 0 ? (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer component={Paper} sx={{ backgroundColor: dark ? "#1e1e1e" : "" }}>
  <Table stickyHeader>
    <TableHead>
      <TableRow sx={{ "& .MuiTableCell-head": { backgroundColor: dark ? "#252525" : "", color: dark ? "#ececec" : "", borderBottom: dark ? "2px solid #3a3a3a" : "" } }}>
        <TableCell>Id</TableCell>
                        <TableCell>Metadata Json</TableCell>
                        <TableCell>Draft Data Json</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>No Of Turns</TableCell>
                        <TableCell>DateTime</TableCell>
                        <TableCell>Time Taken</TableCell>
                        <TableCell>Parent Data</TableCell>
                        <TableCell>Meta Info Language</TableCell>
                        <TableCell>Instruction id</TableCell>
                        <TableCell>Instance Id</TableCell>
                        
                    </TableRow>
                </TableHead>
                <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item.id} sx={{ "& .MuiTableCell-body": { color: dark ? "#d0d0d0" : "", borderBottom: dark ? "1px solid #2e2e2e" : "" }, "&:hover": { backgroundColor: dark ? "rgba(251, 146, 60, 0.08)" : "" } }}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.metadata_json}</TableCell>
                            <TableCell>{item.draft_data_json}</TableCell>
                            <TableCell>{item.model}</TableCell>
                            <TableCell>{item.no_of_turns}</TableCell>
                            <TableCell>{item.datetime}</TableCell>
                            <TableCell>{item.time_taken}</TableCell>
                            <TableCell>{item.parent_data}</TableCell>                         
                            <TableCell>{item.language}</TableCell>
                            <TableCell>{item.instruction_id}</TableCell>
                            <TableCell>{item.instance_id}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
) : (
    <Typography>No data found for the given IDs.</Typography>
)}


                </DialogContent>
                <DialogActions sx={{ backgroundColor: dark ? "#2a2a2a" : "", borderTop: dark ? "1px solid #3a3a3a" : "" }}>
                <Button onClick={closePreview} color="primary">
                    Cancel
                </Button>
                    <Button
                        onClick={() => {
                            closePreview();
                            setOpenDialog(true);
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
  PaperProps={{
    sx: {
      backgroundColor: dark ? "#2a2a2a" : "",
      color: dark ? "#ececec" : "",
      border: dark ? "1px solid #3a3a3a" : "",
    }
  }}
>
  <DialogContent sx={{ backgroundColor: dark ? "#2a2a2a" : "" }}>
    <DialogContentText id="alert-dialog-description" sx={{ color: dark ? "#a0a0a0" : "" }}>
      Are you sure you want to delete the data items? Please note this action cannot be undone.
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="password"
      label="Password"
      type="password"
      fullWidth
      variant="standard"
      onChange={(e) => setPassword(e.target.value)}
      sx={{
        "& .MuiInput-root": { color: dark ? "#ececec" : "" },
        "& .MuiInput-underline:before": { borderBottomColor: dark ? "#3a3a3a" : "" },
        "& .MuiInputLabel-root": { color: dark ? "#a0a0a0" : "" },
      }}
    />
  </DialogContent>
  <DialogActions sx={{ backgroundColor: dark ? "#2a2a2a" : "", borderTop: dark ? "1px solid #3a3a3a" : "" }}>
                    <Button onClick={handleCloseDialog}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn} > 
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}
                        variant="contained"
                        color="primary"
                        size="small" className={classes.clearAllBtn} autoFocus >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
