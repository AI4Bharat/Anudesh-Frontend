"use client";
"use client";
import "@/styles/Dataset.css";
import { Box, Grid, Link } from "@mui/material";
import LoginStyle from "../../../../styles/loginStyle";
import AppInfo from "../../../../components/user/AppInfo";
import CustomCard from "../../../../components/common/Card";
import OutlinedTextField from "../../../../components/common/OutlinedTextField";
import { useEffect, useState } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { Visibility } from "@mui/icons-material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../../components/common/Button";
import APITransport from "@/Lib/apiTransport/apitransport";
import { useNavigate } from "react-router-dom";
import { translate } from "@/config/localisation";
import CustomizedSnackbars from "../../../../components/common/Snackbar";
import "./login.css";
import LoginAPI from "../../../actions/api/user/Login";
import { auth, googleAuthProvider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleLoginAPI from "../../../actions/api/user/GoogleLogin";
import { authenticateUser, getLoggedInUserData } from "@/utils/utils";
import { FetchLoggedInUserData } from "@/Lib/Features/getLoggedInData";

export default function Login() {
  /* eslint-disable react-hooks/exhaustive-deps */
  /* eslint-disable-next-line react/jsx-key */
  /* eslint-disable react-hooks/exhaustive-deps */
  /* eslint-disable-next-line react/jsx-key */

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/projects");
    }
  }, []);

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
  const getLoggedInUserData = () => {
    dispatch(FetchLoggedInUserData("me"));
  };

  const handleSubmit = async () => {
    // setLoading(true);
    const apiObj = new LoginAPI(
      credentials.email.toLowerCase(),
      credentials.password,
    );
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });

    const rsp_data = await res.json();
    if (res.ok && typeof window !== "undefined") {
      localStorage.setItem("anudesh_access_token", rsp_data.access);
      localStorage.setItem("anudesh_refresh_token", rsp_data.refresh);
      localStorage.setItem("email_id", credentials.email.toLowerCase());
      localStorage.setItem("isLoggedIn", "true");
      navigate("/projects");
    } else {
      setSnackbarInfo({
        open: true,
        message: rsp_data?.message,
        variant: "error",
      });
    }

    // setLoading(false);
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
    <CustomCard
      className="items-center"
      title={"Sign in to Anudesh"}
      cardContent={TextFields()}
    >
      <Grid container spacing={2} style={{ width: "100%", cursor: "pointer" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} textAlign={"right"}>
          <Link onClick={() => navigate("/forgot-password")}>
            {translate("forgotPassword")}
          </Link>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <CustomButton
            style={{
              backgroundColor: "#ee6633",
              borderRadius: "20px",
              color: "#FFFFFF",
            }}
            fullWidth
            onClick={handleSubmit}
            label={"Login"}
          />
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

  const googleLogin = () => {
    if (typeof window !== "undefined") {
      signInWithPopup(auth, googleAuthProvider)
        .then(async (result) => {
          setSnackbarInfo({
            open: true,
            message: "login successfull",
            variant: "success",
          });
          const { user } = result;
          const fireResult = await user.getIdTokenResult();
          const apiObj = new GoogleLoginAPI(fireResult.token);
          const res = await fetch(apiObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers,
          });

          const rsp_data = await res.json();
          if (res.ok && typeof window !== "undefined") {
            localStorage.setItem("anudesh_access_token", rsp_data.access);
            localStorage.setItem("anudesh_refresh_token", rsp_data.refresh);
            localStorage.setItem(
              "email_id",
              fireResult.claims.email.toLowerCase(),
            );
            getLoggedInUserData();
            navigate("/projects");
          } else {
            setSnackbarInfo({
              open: true,
              message: rsp_data?.message,
              variant: "error",
            });
          }
        })
        .catch((err) => {
          setSnackbarInfo({
            open: true,
            message: err,
            variant: "error",
          });
        });
    }
  };

  return (
    <>
      {renderSnackBar()}
      <div
        container
        className="flex flex-col md:flex-row justify-center items-center h-auto md:h-full"
      >
        <div
          item
          // color={"primary"}
          className="appInfo bg-orange-500 h-auto md:w-2/5 md:block"
          justifyContent="center"
          alignItems="center"
        >
          <AppInfo />
        </div>
        <div item className="w-full px-10 md:w-3/5 flex flex-col items-center">
          <form autoComplete="off" className="lg:w-1/2 ">
            {renderCardContent()}
          </form>
          <div className="w-full flex items-center justify-between my-4 m-auto">
            <span className="border-b w-1/4"></span>
            <a href="#" className="text-xs text-center text-gray-500 uppercase">
              or login with google
            </a>
            <span className="border-b w-1/4"></span>
          </div>

          <button
            onClick={() => googleLogin()}
            className="w-full flex items-center justify-center mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg hover:bg-gray-50 m-auto lg:w-1/2"
          >
            <div className="px-4 py-2">
              <svg className="w-6 h-6" viewBox="0 0 40 40">
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#FFC107"
                />
                <path
                  d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                  fill="#FF3D00"
                />
                <path
                  d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                  fill="#4CAF50"
                />
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#1976D2"
                />
              </svg>
            </div>
            <span className="w-5/6 px-4 py-3 font-bold text-center">
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
