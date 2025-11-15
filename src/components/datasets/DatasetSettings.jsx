import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Tooltip, Button } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useDispatch, useSelector } from "react-redux";
import { translate } from "@/config/localisation";
import CustomButton from "@/components/common/Button";
//import Modal from "@/components/common/Modal";
import { FileUploader } from "react-drag-drop-files";
import Switch from "@mui/material/Switch";
import DownloadDatasetButton from "./DownloadDataSetButton";
import DeleteDataItems from "./DeleteDataItems";
import CustomizedSnackbars from "@/components/common/Snackbar";
import DeduplicateDataItems from "./DeduplicateDataItems";
import UploaddataAPI from "@/app/actions/api/dataset/UploaddataAPI";
import { fetchDatasetDownloadCSV } from "@/Lib/Features/datasets/GetDatasetDownloadCSV";
import { fetchSampleDatasetDownload } from "@/Lib/Features/datasets/GetSampleDatasetDownload";
import { fetchFileTypes } from "@/Lib/Features/datasets/GetFileTypes";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  //border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const label = { inputProps: { "aria-label": "Switch demo" } };

export default function DatasetSettings() {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { datasetId } = useParams();
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState([]);
  const [filetype, setFiletype] = useState("");
  const [type, setType] = useState([]);
  const [switchs, setswitchs] = useState("True");
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const GetFileTypes = useSelector((state) => state.GetFileTypes.data);
  const sampleDataset = useSelector((state) => state.fetchSampleDatasetDownload?.data);
  const FileTypes = () => {
    // const projectObj = new GetFileTypesAPI();
    dispatch(fetchFileTypes());
  };
  const handleSampleDatasetDownload = () =>{
    dispatch(fetchSampleDatasetDownload((datasetId)));
  }

  useEffect(() => {
    if (GetFileTypes && GetFileTypes.length > 0) {
      let temp = [];
      GetFileTypes.forEach((element) => {
        temp.push({
          name: element,
          value: element,
        });
      });
      setType(temp);
    }
  }, [GetFileTypes]);

  const handleClick = () => {
    setLoading(true);
    dispatch(fetchDatasetDownloadCSV((datasetId)));
  };

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleChange = (file) => {
    setFile(file[0]);
  };

  const handleUpload = (e) => {
    setModal(true);
    FileTypes();
  };

  const handleModalClose = () => {
    setModal(false);
    setFile([]);
    setFiletype("");
  };

  const handleUploadFile = async () => {
    let UploadFile = new FormData();
    UploadFile.append("dataset", file);
    UploadFile.append("filetype", filetype);
    UploadFile.append("deduplicate", switchs);
    setLoading(true);
    const projectObj = new UploaddataAPI(datasetId, UploadFile);
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: projectObj.getBody(),
      headers: projectObj.getHeaders().headers,
    });

    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    handleModalClose();
  };

  const handleswitchchange = () => {
    setswitchs("false");
  };

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

  return (
    <Grid container>
      {renderSnackBar()}
      <Card
        sx={{
          width: "100%",
          padding:2
        }}
      >
        <Grid container gap={2} justifyContent="space-between" alignItems="center">
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Grid
              container
              columns={16}
              sx={{gap:{xs:2,lg:1}}}
              justifyContent="space-evenly"
              >
              <Grid item xs={12} sm={6} lg={3}>
                {/* <CustomButton
								label={translate("button.downloadDataset")}
								onClick={handleClick}
							/> */}

                <DownloadDatasetButton />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Button
                  sx={{  p: 2, borderRadius: 5,width:"100%" }}
                  variant="contained"
                  onClick={handleUpload}
                >
                 {translate("button.uploadData")}
                 <Tooltip title="Sample Download Button">
                   <InfoOutlinedIcon 
                   sx={{ cursor: "pointer", marginLeft: "0.5rem" }}
                   onClick={(e) =>{ 
                    e.stopPropagation();
                    handleSampleDatasetDownload();
                  }}
                   />
                 </Tooltip>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <DeleteDataItems />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <DeduplicateDataItems />
              </Grid>
              </Grid>
              <div>
                <Modal
                  open={modal}
                  onClose={() => handleModalClose()}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Grid
                      container
                      // direction="row"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        backgroundColor: "#f5f5f5",
                        padding: "1rem",
                        marginBottom: 2,
                      }}
                    >
                      <Typography variant="h5">Upload Data</Typography>
                    </Grid>
                    <Grid container spacing={2} sx={{ padding: 3 }}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent={"space-between"}
                        sx={{
                          alignItems: "center",
                          mt: 3,
                        }}
                      >
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            component="div"
                          >
                            Select File :
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={8} lg={8} xl={8} sm={12}>
                          <FileUploader
                            multiple={true}
                            handleChange={handleChange}
                            name="file"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent={"space-between"}
                        sx={{
                          alignItems: "center",
                          mt: 3,
                        }}
                      >
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            component="div"
                          >
                            Select File Format :
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={8} lg={8} xl={8} sm={12}>
                
                          <FormControl fullWidth sx={{ minWidth: 120 }}>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={filetype}
                              onChange={(e) => setFiletype(e.target.value)}
                              sx={{ fontSize: "14px" }}
                            >
                              {type.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                  {option.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent={"space-between"}
                        sx={{
                          alignItems: "center",
                          mt: 3,
                        }}
                      >
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            component="div"
                          >
                            Delete Duplicate Records :
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={8} lg={8} xl={8} sm={12}>
                          <Switch
                            {...label}
                            defaultChecked
                            value={switchs}
                            onChange={handleswitchchange}
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{ justifyContent: "flex-end", mt: 2 }}
                      >
                        <CustomButton
                          label={"Upload"}
                          disabled={file.length == 0 ? true : false}
                          onClick={handleUploadFile}
                        />
                        <CustomButton
                          sx={{ ml: 1 }}
                          label={"Close"}
                          onClick={() => handleModalClose()}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              </div>
            </>
          )}
        </Grid>
      </Card>
    </Grid>
  );
}
