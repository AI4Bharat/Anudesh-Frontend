'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Grid, Typography, FormHelperText, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { Link, useNavigate, useParams } from "react-router-dom";
import AppInfo from "../../../../components/user/AppInfo";
import OutlinedTextField from "../../../../components/common/OutlinedTextField";
import CustomizedSnackbars from "@/components/common/Snackbar";
import Button from "../../../../components/common/Button";
import "@/styles/Dataset.css";
import SignUpAPI from "@/app/actions/api/Admin/SignUp";

export default function SignUp() {
    /* eslint-disable react-hooks/exhaustive-deps */
    const { inviteCode } = useParams();

    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        UserName: "",
        email: "",
        password: "",
        confirmPassword: "",

    });    const handleFieldChange = (event) => {
        event.preventDefault();
        setCredentials((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    
    const ValidateEmail = (mail) => {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return (true)
        }
        else {
            return false;
        }
    }
    const comformdata = {
        username: values.UserName,
        email: values.email.toLowerCase(),
        password: values.password,

    }

    const handleSubmit = () => {
        let apiObj = new SignUpAPI(comformdata,inviteCode)
        var rsp_data = []
        fetch(apiObj.apiEndPointAuto(), {
            method: 'PATCH',
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers
        }).then(async response => {
            rsp_data = await response.json();
            setLoading(false)
            if (!response.ok) {

                return Promise.reject('');
            } else {
                setSnackbarInfo({
                    ...snackbar,
                    open: true,
                    message: rsp_data.message ? rsp_data.message : "Invalid email / password",
                    variant: 'success'
                })

                setValues({
                    UserName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                })

            }
        }).catch((error) => {
            setLoading(false)
            setSnackbarInfo({
                ...snackbar,
                open: true,
                message: rsp_data.message ? rsp_data.message : "Invalid email / password",
                variant: 'error'
            })
        });

    }

    const HandleSubmitValidate = () => {
        if (!ValidateEmail(values.email)) {
            setError({ ...error, email: true })
        }
        else if (!/^[A-Za-z0-9_ ]+$/.test(values.UserName)) {
            setError({ ...error, UserName: true })
        }
        else if (!(values.password.length > 7)) {
            setError({ ...error, password: true })
        }
        else if (values.password !== values.confirmPassword) {
            setError({ ...error, confirmPassword: true })
        }
        else {
            handleSubmit()
            setLoading(true);
        }


    }



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
            <Grid container spacing={3} style={{ width: "40%", }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                    <div className="createLogin">
                        <Typography variant={"body2"} className="Typo">Already have an account ?</Typography>
                        <Typography variant={"body2"}>
                            <Link className="link" to="/login" style={{ fontSize: "14px" }} >
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
            <Grid container className="loginGrid" >
                <Grid item xs={12} sm={3} md={3} lg={3} color={"primary"} className="appInfo">
                    <AppInfo />
                </Grid>
                <Grid item xs={12} sm={9} md={9} lg={9} className="parent" >
                    {TextFields()}
                </Grid>
            </Grid>
        </>
    )
}
