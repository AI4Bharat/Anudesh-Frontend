'use client';
import { Grid, Link, Typography } from "@mui/material";
import LoginStyle from "@/styles/loginStyle";
import AppInfo from "../../components/user/AppInfo";
import OutlinedTextField from "@/app/components/common/OutlinedTextField";
import { useState } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useRouter } from 'next/navigation';
import CustomizedSnackbars from "@/app/components/common/Snackbar";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import Button from "../../components/common/Button";

export default function SignUp() {
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

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setError({ ...error, [prop]: false });
    };

    const [error, setError] = useState({
        UserName: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const TextFields = () => {
        return (
            <Grid container spacing={2} style={{ width: "40%", }}>
                <Grid>
                    {renderSnackBar()}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="h3" align="center" >Create new account</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="email"
                        placeholder="Enter your Email ID."
                        onChange={handleChange("email")}
                        error={error.email ? true : false}
                        value={values.email}
                        helperText={error.email ? "Invalid email" : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MailOutlineIcon style={{ color: "#75747A" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="name"
                        placeholder="Enter your Username."
                        onChange={handleChange("UserName")}
                        error={error.UserName ? true : false}
                        value={values.UserName}
                        helperText={error.UserName ? "UserName is not proper" : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlinedIcon style={{ color: "#75747A" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid> <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="password"
                        placeholder="Enter your Password."
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange("password")}
                        error={error.password ? true : false}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyOutlinedIcon
                                        sx={{
                                            color: "#75747A",
                                            animation: "spin 0.1s linear infinite",
                                            "@keyframes spin": {
                                                "0%": {
                                                    transform: "rotate(-225deg)",
                                                },
                                                "100%": {
                                                    transform: "rotate(-225deg)",
                                                },
                                            },
                                        }}
                                    />
                                </InputAdornment>
                            ),
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
                    {error.password && <FormHelperText error={true}>
                        Minimum length is 8 characters with combination of uppercase, lowercase, number and a special character</FormHelperText>}
                </Grid> <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="password"
                        placeholder="Re-enter your Password."
                        error={error.confirmPassword ? true : false}
                        value={values.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyOutlinedIcon
                                        sx={{
                                            color: "#75747A",
                                            animation: "spin 0.1s linear infinite",
                                            "@keyframes spin": {
                                                "0%": {
                                                    transform: "rotate(-225deg)",
                                                },
                                                "100%": {
                                                    transform: "rotate(-225deg)",
                                                },
                                            },
                                        }}
                                    />

                                </InputAdornment>
                            ),

                        }}
                    />
                    {error.confirmPassword && <FormHelperText error={true}>Both password must match.</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                    <Button fullWidth label={"Submit"} onClick={() => {
                        HandleSubmitValidate();
                    }} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  >
                    <div className={classes.createLogin}>
                        <Typography variant={"body2"} className={classes.Typo}>Already have an account ?</Typography>
                        <Typography variant={"body2"}>
                            <Link className={classes.link} href="/login" style={{ fontSize: "14px" }} >
                                {" "}
                                Sign in
                            </Link>
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        );
    };

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
            <Grid container className={classes.loginGrid} >
                <Grid item xs={12} sm={3} md={3} lg={3} color={"primary"} className={classes.appInfo}>
                    <AppInfo />
                </Grid>
                <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent} >
                    {TextFields()}
                </Grid>
            </Grid>
        </>
    )
}