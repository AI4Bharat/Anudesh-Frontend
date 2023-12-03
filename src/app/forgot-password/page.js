'use client';
import { Grid, Link, Typography } from "@mui/material";
import LoginStyle from "@/styles/loginStyle";
import AppInfo from "../components/user/AppInfo";
import OutlinedTextField from "@/app/components/common/OutlinedTextField";
import { useState } from "react";
import Button from "../components/common/Button";
import CustomizedSnackbars from "@/app/components/common/Snackbar";

export default function ForgotPassword() {
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setError({ ...error, [prop]: false });
    };
    const [values, setValues] = useState({
        email: "",
    });
    const [error, setError] = useState({
        email: false,
    });
    const classes = LoginStyle();
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const ValidateEmail = (mail) => {
        if (
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                mail
            )
        ) {
            return true;
        } else {
            return false;
        }
    };
    const handleforgotPassword = () => {
        if (!ValidateEmail(values.email)) {
            setError({ ...error, email: true });
        } else {
            handleSubmit();
            setValues({
                email: "",
            });
            setLoading(true);
        }
    };
    const TextFields = () => {
        return (
            <Grid container spacing={2} style={{ marginTop: "2px", width: "40%" }}>
                <Grid>{renderSnackBar()}</Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="h3">Forgot password?</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="body2" className={classes.subTypo}>
                        Enter you email address and we will send a link to reset your
                        password.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="email"
                        placeholder="Enter your Email ID."
                        onChange={handleChange("email")}
                        error={error.email ? true : false}
                        value={values.email}
                        helperText={error.email ? "Please enter an email ID" : ""}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} textAlign={"right"}>
                    <Typography>
                        <Link href="/login" style={{ fontSize: "14px" }}>
                            {" "}
                            Back to Login
                        </Link>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                        fullWidth
                        label={"Send link"}
                        onClick={handleforgotPassword}
                    />
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
            <Grid container className={classes.loginGrid}>
                <Grid
                    item
                    xs={12}
                    sm={3}
                    md={3}
                    lg={3}
                    color={"primary"}
                    className={classes.appInfo}
                >
                    <AppInfo />
                </Grid>
                <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent}>
                    {TextFields()}
                </Grid>
            </Grid >
        </>
    )
}