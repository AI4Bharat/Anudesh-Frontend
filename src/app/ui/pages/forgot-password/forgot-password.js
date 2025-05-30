"use client";
import React, { useEffect, useState } from "react";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@/components/common/Button";
import OutlinedTextField from "@/components/common/OutlinedTextField";
import LoginStyle from "@/styles/loginStyle";
import themeDefault from "@/themes/theme";
import { useNavigate } from "react-router-dom";
import AppInfo from "@/components/user/AppInfo";
import ForgotPasswordAPI from "../../../actions/api/user/ForgotPasswordAPI";
import { useDispatch } from "react-redux";
import CustomizedSnackbars from "@/components/common/Snackbar";

const ForgotPassword = () => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const classes = LoginStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
  });
  const [error, setError] = useState({
    email: false,
  });
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setError({ ...error, [prop]: false });
  };
  const ForgotPassword = {
    email: values.email.toLowerCase(),
  };
  const handleSubmit = async () => {
    setLoading(true);
    let obj = new ForgotPasswordAPI(ForgotPassword);
    const res = await fetch(obj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      navigate("/login");
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };
  const ValidateEmail = (mail) => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail,
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
          <Typography onClick={() => navigate("/login")}>
            <Link style={{ fontSize: "14px", cursor: "pointer" }}>
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

  return (
    <ThemeProvider theme={themeDefault}>
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
      </Grid>
    </ThemeProvider>
  );
};

export default ForgotPassword;
