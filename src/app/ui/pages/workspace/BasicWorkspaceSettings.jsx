
import { Grid, ThemeProvider, Typography, Autocomplete, TextField, FormControlLabel, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
<<<<<<< HEAD:src/app/workspace/BasicWorkspaceSettings.jsx
import themeDefault from '../../themes/theme'
import OutlinedTextField from "../../components/common/OutlinedTextField";
import  "../../styles/Dataset.css";
import CustomButton from "../../components/common/Button";
import CustomizedSnackbars from "../../components/common/Snackbar";
import Spinner from "../../components/common/Spinner";
import { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";
import { snakeToTitleCase } from "@/utils/utils";
import GetWorkspaceSaveButtonAPI from "../actions/api/Projects/GetWorkspaceSaveButton";
import DatasetStyle from "@/styles/dataset";
import { useDispatch,useSelector } from "react-redux";
=======
import themeDefault from '../../../../themes/theme'
import OutlinedTextField from "../../../../components/common/OutlinedTextField";
import  "@/styles/Dataset.css";
import CustomButton from "../../../../components/common/Button";
import CustomizedSnackbars from "../../../../components/common/Snackbar";
import Spinner from "../../../../components/common/Spinner";


>>>>>>> navbar:src/app/ui/pages/workspace/BasicWorkspaceSettings.jsx

const BasicWorkspaceSettings = (props) => {
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [value, setValue] = useState();
    const [loading, setLoading] = useState(false);
    const [newDetails, setNewDetails] = useState();
    // const { id } = useParams();
    const id = 2;
    // const navigate = useNavigate();
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const [publicanalytics,setpublicanalytics] = useState(true)
   


    const handlepublicanalytics = async () => {
        // setLoading(true);
        setpublicanalytics((publicanalytics)=>!publicanalytics)
      };

    const workspaceDetails = useSelector(state => state.getWorkspaceDetails.data);
    console.log('test')
    console.log(workspaceDetails)
    const getWorkspaceDetails = () => {
        dispatch(fetchWorkspaceDetails(id));
    }

    useEffect(() => {
        getWorkspaceDetails();
    }, []);

    useEffect(() => {
        setNewDetails({
            workspace_name: workspaceDetails?.workspace_name
        });
    }, [workspaceDetails]);

    const handleSave = async () => {

        const sendData = {
            workspace_name: newDetails.workspace_name,
            organization: workspaceDetails.organization,
            is_archived: workspaceDetails.is_archived,
            public_analytics: publicanalytics
        }
        const workspaceObj = new GetWorkspaceSaveButtonAPI(id, sendData);
        const res = await fetch(workspaceObj.apiEndPoint(), {
            method: "PUT",
            body: JSON.stringify(workspaceObj.getBody()),
            headers: workspaceObj.getHeaders().headers,
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

    const handleWorkspaceName = (event) => {

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
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={2}
                        xl={2}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Workspace Name
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={9}
                        xl={9}
                        sm={12}
                    >
                        <OutlinedTextField
                            fullWidth
                            name="workspace_name"
                            InputProps={{ style: { fontSize: "14px", width: "500px" } }}
                            // value={ProjectDetails.title}
                            value={newDetails?.workspace_name}
                            onChange={handleWorkspaceName} />
                    </Grid>
                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={2}
                        xl={2}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Public Analytics
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={9}
                        xl={9}
                        sm={12}
                    >
                        <FormControlLabel
                            control={<Switch color="primary" />}
                            labelPlacement="start"
                            checked={publicanalytics}
                            onChange={handlepublicanalytics}
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sm={12}
                    sx={{
                        m: 7,
                        // justifyContent: "center",

                    }}
                >
                    <CustomButton sx={{ inlineSize: "max-content", marginRight: "10px", width: "80px" }}
                        onClick={() => navigate(`/workspace/:id/`)}
                        // onClick={handleCancel}
                        label="Cancel" />
                    <CustomButton sx={{ inlineSize: "max-content", width: "80px" }}
                        onClick={handleSave}
                        label="Save" />
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default BasicWorkspaceSettings;
