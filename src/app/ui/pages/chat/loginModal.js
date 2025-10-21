import React, { useEffect, useState } from 'react';
import { Modal, Paper, Typography, Button, CircularProgress, Divider, TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from "@/firebase";
import GoogleLoginAPI from "../../../actions/api/user/GoogleLogin";
import { FetchLoggedInUserData } from "@/Lib/Features/getLoggedInData";
import { useDispatch } from "react-redux";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginAPI from '@/app/actions/api/user/Login';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid #ddd',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
    textAlign: 'center',
    outlineColor: '#FF6B6B',
    outline: '2px solid #FF6B6B',
};

const LoginModal = ({ open }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const getLoggedInUserData = () => {
        dispatch(FetchLoggedInUserData("me"));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        const apiObj = new LoginAPI(
          email.toLowerCase(),
          password,
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
          localStorage.setItem("email_id", email.toLowerCase());
          localStorage.setItem("isLoggedIn", "true");
          getLoggedInUserData();
        } else {
            console.error("Authentication error:", rsp_data?.message);
            setError("Failed to sign in. Please try again.");
        }
    
        setIsLoading(false);
      };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        if (typeof window !== "undefined") {
            signInWithPopup(auth, googleAuthProvider)
                .then(async (result) => {
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
                        localStorage.setItem("email_id", fireResult.claims.email.toLowerCase(),);
                        localStorage.setItem("isLoggedIn", "true");
                        getLoggedInUserData();
                    }
                })
                .catch((err) => {
                    console.error("Authentication error:", err);
                    setError("Failed to sign in. Please try again.");
                });
        }
        setIsLoading(false);
    };

    return (
        <Modal
            open={open}
            aria-labelledby="login-modal-title"
            BackdropProps={{
                sx: {
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <Paper sx={modalStyle}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Welcome to Anudesh!
                </Typography>
                <Typography variant="body1"  sx={{ mb: 3, color: 'text.secondary' }}>
                Anudesh is an open source platform where you can contribute to the development of state of the art LLMs for Indian languages by helping us create high quality conversational data.
                </Typography>

                <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    disabled={isLoading}
                    onClick={handleGoogleLogin}
                    startIcon={
                        <svg width="20" height="20" viewBox="0 0 40 40">
                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                            <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                            <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                        </svg>
                    }
                    sx={{ textTransform: 'none', fontSize: '1rem', color: 'text.primary', borderColor: 'grey.400' }}
                >
                    Sign in with Google
                </Button>

                <Divider sx={{ my: 3 }}>OR</Divider>

                <Box component="form" noValidate>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {isLoading ? (
                        <CircularProgress sx={{ mt: 2 }} />
                    ) : (
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2, color:'white' }}
                            onClick={handleSubmit}
                        >
                            Sign In
                        </Button>
                    )}
                </Box>

                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </Paper>
        </Modal>
    );
};

export default LoginModal;