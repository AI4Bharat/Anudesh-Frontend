import { Grid, Typography, TextField,ThemeProvider,Autocomplete } from "@mui/material";
import themeDefault from '../../../themes/theme';
import OutlinedTextField from "../common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import CustomButton from "../common/Button";
import CustomizedSnackbars from "../common/Snackbar";
import {useState} from "react";
import Spinner from "../common/Spinner";

const BasicSettings = () => {
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [sourceLanguage, setSourceLanguage] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("");
    const [languageOptions, setLanguageOptions] = useState("");
    const [loading, setLoading] = useState(false);
    const [newDetails, setNewDetails] = useState();
    const classes = DatasetStyle();

    const handleSave = async () => {
        // Functionality removed for UI code snippet
    };

    const handleProjectName = (event) => {
        event.preventDefault();
        // Functionality removed for UI code snippet
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
        <ThemeProvider theme={themeDefault}>
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
                <Grid container direction='row' sx={{ alignItems: "center" }}>
                    <Grid items 
                            xs={12} 
                            sm={12}
                            md={12} 
                            lg={2}
                            xl={2}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Project Name
                        </Typography>
                    </Grid>
                    <Grid item 
                            xs={12}
                            md={12}
                            lg={9}
                            xl={9}
                            sm={12}
                    >
                        <OutlinedTextField
                            fullWidth
                            name="title"
                            InputProps={{ style: { fontSize: "14px", width: "500px" } }}
                            // value={ProjectDetails.title}
                            value={newDetails?.title}
                            onChange={handleProjectName} />
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
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={2}
                        xl={2}
                    >

                        <Typography variant="body2" fontWeight='700'>
                            Project Description
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
                            name="description"
                            InputProps={{ style: { fontSize: "14px", width: "500px" } }}
                            value={newDetails?.description}
                            onChange={handleProjectName}
                        />
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
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={2}
                                xl={2}
                            >
                                <Typography variant="body2" fontWeight='700' label="Required">
                                {"Target Language"}
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
                                <Autocomplete
                                    onChange={(e, newVal) => setTargetLanguage(newVal)}
                                    options={languageOptions}
                                    value={targetLanguage}
                                    style={{ fontSize: "14px", width: "500px" }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            inputProps={{ ...params.inputProps, style: { fontSize: "14px" } }}
                                            placeholder={"Enter target language"}
                                        />
                                    )}
                                />
                            </Grid>

                        </Grid>




                <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                mt: 2
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
                                    Max Pending Tasks Per User
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
                                    name="max_pending_tasks_per_user"
                                    InputProps={{ step: 1, min: 0, max: 99999, type: 'number', style: { fontSize: "14px", width: "500px" } }}
                                    value={newDetails?.max_pending_tasks_per_user}
                                    onChange={handleProjectName} />
                            </Grid>
                        </Grid>

                <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                mt: 2
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
                                    Tasks Pull Count Per Batch
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
                                    name="tasks_pull_count_per_batch"
                                    InputProps={{ step: 1, min: 0, max: 99999, type: 'number', style: { fontSize: "14px", width: "500px" } }}
                                    value={newDetails?.tasks_pull_count_per_batch}
                                    onChange={handleProjectName} />
                            </Grid>
                        </Grid>
            
                    
                {/* ... Other form fields */}
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
                        onClick={() => navigate(`/projects/:id/`)}
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

export default BasicSettings;


