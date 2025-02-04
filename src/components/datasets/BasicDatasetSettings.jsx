
import { Grid, ThemeProvider, Typography, Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from '@/themes/theme'
import { useNavigate, useParams } from 'react-router-dom';
import OutlinedTextField from "../common/OutlinedTextField";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../common/Button";
import CustomizedSnackbars from "../common/Snackbar";
import { snakeToTitleCase } from "@/utils/utils";
import Spinner from "../common/Spinner";
import { fetchDatasetDetails } from "@/Lib/Features/datasets/getDatasetDetails";
import GetSaveButtonAPI from "@/app/actions/api/dataset/GetSaveButtonAPI";



const BasicDatasetSettings = (props) => {
      /* eslint-disable react-hooks/exhaustive-deps */

    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [value, setValue] = useState();
    const [loading, setLoading] = useState(false);
    const [newDetails, setNewDetails] = useState();
    const { datasetId } = useParams();
    const navigate = useNavigate();
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const DatasetDetails = useSelector(state => state.getDatasetDetails.data);
   
    const GetDatasetDetails = () => {
        dispatch(fetchDatasetDetails(datasetId));
    }

    useEffect(() => {
        GetDatasetDetails();
    }, []);

    useEffect(() => {
        setNewDetails({
            instance_name: DatasetDetails?.instance_name,
            instance_description: DatasetDetails?.instance_description=='' || DatasetDetails?.instance_description=='None'?'':DatasetDetails.instance_description,
        });
    }, [DatasetDetails]);

    const handleSave = async () => {

        const sendData = {
            instance_name: newDetails.instance_name,
            instance_description: newDetails.instance_description,

            parent_instance_id: DatasetDetails.parent_instance_id,
            dataset_type: DatasetDetails.dataset_type,
            organisation_id: DatasetDetails.organisation_id,
            users: DatasetDetails.users,
        }
        const DatasetObj = new GetSaveButtonAPI(datasetId, sendData);
        const res = await fetch(DatasetObj.apiEndPoint(), {
            method: "PUT",
            body: JSON.stringify(DatasetObj.getBody()),
            headers: DatasetObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: "success",
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

    function snakeToTitleCase(str) {
        return str.split("_").map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
    }
    useEffect(() => {
        setLoading(apiLoading);
    }, [apiLoading])

    const handleDatasetName = (event) => {

        event.preventDefault();
        setNewDetails((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

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
        <ThemeProvider theme={themeDefault}>

            {/* <Header /> */}
            {loading && <Spinner />}
            <Grid>
                {renderSnackBar()}

            </Grid>

            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        // justifyContent: "space-between",
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={3}
                        lg={2}
                        xl={2}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Dataset Name
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={9}
                        lg={9}
                        xl={9}
                    >
                        <OutlinedTextField
                            fullWidth
                            name="instance_name"
                            InputProps={{ style: { fontSize: "14px" } }}
                            // value={ProjectDetails.title}
                            value={newDetails?.instance_name}
                            onChange={handleDatasetName} />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        // justifyContent: "space-between",
                        mt: 2
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={3}
                        lg={2}
                        xl={2}
                    >

                        <Typography variant="body2" fontWeight='700'>
                            Dataset Description
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={9}
                        lg={9}
                        xl={9}
                    >
                        <OutlinedTextField
                            fullWidth
                            name="instance_description"
                            InputProps={{ style: { fontSize: "14px" } }}
                            value={newDetails?.instance_description}
                            onChange={handleDatasetName}
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
                    sx={{
                        mt: 4,
                        justifyContent: { xs: "center", md: "flex-start" },
                    }}
                >
                    <CustomButton sx={{ inlineSize: "max-content", marginRight: {sm:"20px"}, marginBottom:{xs:"10px", sm:0}, width: {xs:"100%",sm:"200px"} }}
                        onClick={() => navigate(-1)}
                        // onClick={handleCancel}
                        label="Cancel" />
                    <CustomButton sx={{ inlineSize: "max-content", width: {xs:"100%",sm:"200px"} }}
                        onClick={handleSave}
                        label="Save" />
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default BasicDatasetSettings;