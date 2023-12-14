'use client';
import { Grid, Link } from "@mui/material";
import LoginStyle from "../../styles/loginStyle";
import AppInfo from "../components/user/AppInfo";
import CustomCard from "../components/common/Card";
import OutlinedTextField from "../components/common/OutlinedTextField";
import { useState } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { Visibility } from "@material-ui/icons";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CustomButton from "../components/common/Button";
import { useRouter } from 'next/navigation';
import { translate } from "../../config/localisation";
import CustomizedSnackbars from "../components/common/Snackbar";

export default function Login() {
    const router = useRouter()
    const classes = LoginStyle();
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });
    const handleFieldChange = (event) => {
        event.preventDefault();
        setCredentials((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const TextFields = () => {
        return (
            <Grid container spacing={2} style={{ marginTop: "2px" }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="email"
                        onChange={handleFieldChange}
                        value={credentials["email"]}
                        placeholder={translate("enterEmailId")}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="password"
                        type={values.showPassword ? "text" : "password"}
                        onChange={handleFieldChange}
                        value={credentials["password"]}
                        placeholder={translate("enterPassword")}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
        );
    };

    const renderCardContent = () => (
        <CustomCard title={"Sign in to Anudesh"} cardContent={TextFields()}>
            <Grid container spacing={2} style={{ width: "100%", cursor: "pointer" }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} textAlign={"right"}>
                    <Link onClick={() => router.push("/forgot-password")}>
                        {translate("forgotPassword")}
                    </Link>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <CustomButton style={{
                        backgroundColor: "#ee6633",
                        borderRadius: "20px",
                        color: "#FFFFFF"
                    }} fullWidth
                        // onClick={createToken} 
                        label={"Login"} />
                </Grid>
            </Grid>
        </CustomCard>
    );

    const renderSnackBar = () => {
        return (
            <CustomizedSnackbars
                open={snackbar.open}
                handleClose={() =>
                    setSnackbarInfo({ open: false, message: "", variant: "" })
                }
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant={snackbar.variant}
                message={snackbar.message}
            />
        );
    };

    return (
        <>
            {renderSnackBar()}
            <Grid container>
                <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    lg={3}
                    color={"primary"}
                    className={classes.appInfo}
                >
                    <AppInfo />
                </Grid>
                <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent}>
                    <form autoComplete="off">{renderCardContent()}
                    </form>
                </Grid>
            </Grid>
        </>
    )
}