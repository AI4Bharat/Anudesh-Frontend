
import { Grid, ThemeProvider, Typography, Autocomplete, TextField, FormControlLabel, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from '../../../../themes/theme'
import OutlinedTextField from "../../../../components/common/OutlinedTextField";
import "../../../../styles/Dataset.css";
import CustomButton from "../../../../components/common/Button";
import CustomizedSnackbars from "../../../../components/common/Snackbar";
import Spinner from "../../../../components/common/Spinner";



const BasicWorkspaceSettings = (props) => {
     /* eslint-disable react-hooks/exhaustive-deps */

    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [value, setValue] = useState();
    const [loading, setLoading] = useState(false);
    const [newDetails, setNewDetails] = useState();
    
    const [publicanalytics,setpublicanalytics] = useState(true)
   


    const handlepublicanalytics = async () => {
        // setLoading(true);
        setpublicanalytics((publicanalytics)=>!publicanalytics)
      };




    function snakeToTitleCase(str) {
        return str.split("_").map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
    }


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
                        // onClick={handleSave}
                        label="Save" />
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default BasicWorkspaceSettings;