import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "next/link";
import Image from "next/image";
import { Menu, Close } from "@mui/icons-material";
import Logout from "@/Lib/Features/Logout";
import headerStyle from "@/styles/Header";
import ForgotPasswordAPI from "@/app/actions/api/user/ForgotPasswordAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const handleChangePassword = async (email) => {
  let obj = new ForgotPasswordAPI({ email: email });
  const res = await fetch(obj.apiEndPoint(), {
    method: "POST",
    body: JSON.stringify(obj.getBody()),
    headers: obj.getHeaders().headers,
  });
  const resp = await res.json();
};

function MobileNavbar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loggedInUserData, appSettings, userSettings, tabs, appInfo} = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = headerStyle();

  const onLogoutClick = () => {
    dispatch(Logout());
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    navigate("/");
  };

  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: {
            padding: 0,
            width: { xs: "85%", sm: "60%", md: "35%" },
            maxWidth: "100vw",
            borderRadius: "0 10px 10px 0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease-in-out",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
        transitionDuration={{ enter: 400, exit: 300 }}
      >
        <Box
          sx={{
            height: "100%",
            position: "sticky",
            top: 0,
            zIndex: 10,
            pb: 2,
            overflowX: "hidden", // Prevent horizontal overflow
          }}
        >
          <Box sx={{ position: "sticky", top: 0, zIndex: 10 }}>
            <IconButton
              onClick={() => setOpenDrawer(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                zIndex: 10,
                color: "text.secondary",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "primary.main",
                  transform: "rotate(90deg)",
                },
              }}
            >
              <Close />
            </IconButton>

            <Link
              href="/profile"
              onClick={() => setOpenDrawer(false)}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 2,
                  p: 3,
                  pb: 3,
                  backgroundColor: "#FEE0B3",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Avatar
                  alt="user_profile_pic"
                  className="avatar"
                  sx={{
                    bgcolor: "primary.main",
                    width: 50,
                    height: 50,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {loggedInUserData?.username?.[0]}
                </Avatar>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.primary",
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                      fontWeight: 600,
                    }}
                  >
                    {loggedInUserData.username}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    }}
                  >
                    View Profile
                  </Typography>
                </Box>
              </Box>
            </Link>
          </Box>

          <Box
            sx={{
              overflowY: "auto",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: "100%",
            }}
          >
            <Box sx={{ mt: 1, overflow: "hidden" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  px: 3,
                  // mt: 3,
                  mb: 1,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Organization
              </Typography>
              <Divider sx={{ mx: 2 }} />
              <List sx={{ px: 1 }}>
                {tabs.map((tab, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      cursor: "pointer",
                      py: 1.5,
                      px: 2,
                      mt: 1,
                      mb: 0.5,
                      borderRadius: "8px",
                      mx: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "translateX(5px)",
                      },
                    }}
                    onClick={() => setOpenDrawer(false)}
                  >
                    {tab}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ mt: 1, overflowX: "hidden" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  px: 3,
                  // py: 1,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                App Information
              </Typography>
              <Divider sx={{ mx: 2 }} />
              <List sx={{ px: 1 }}>
                {appInfo.map((setting, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      cursor: "pointer",
                      py: 1.5,
                      px: 2,
                      borderRadius: "8px",
                      mx: 1,
                      mb: 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "translateX(5px)",
                      },
                    }}
                    onClick={setting.onclick}
                  >
                    {setting.control ? (
                      <FormControlLabel
                        control={setting.control}
                        label={
                          <Typography sx={{ fontSize: "0.95rem" }}>
                            {setting.name}
                          </Typography>
                        }
                      />
                    ) : (
                      <Typography variant="body1">{setting.name}</Typography>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ mt: 1, overflowX: "hidden" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  px: 3,
                  // py: 1,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                App Settings
              </Typography>
              <Divider sx={{ mx: 2 }} />
              <List sx={{ px: 1 }}>
                {appSettings.map((setting, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      cursor: "pointer",
                      py: 1.5,
                      px: 2,
                      borderRadius: "8px",
                      mx: 1,
                      mb: 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "translateX(5px)",
                      },
                    }}
                    onClick={setting.onclick}
                  >
                    {setting.control ? (
                      <FormControlLabel
                        control={setting.control}
                        label={
                          <Typography sx={{ fontSize: "0.95rem" }}>
                            {setting.name}
                          </Typography>
                        }
                      />
                    ) : (
                      <Typography variant="body1">{setting.name}</Typography>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ mt: 1, overflowX: "hidden" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  px: 3,
                  // py: 1,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                User Settings
              </Typography>
              <Divider sx={{ mx: 2 }} />
              <List sx={{ px: 1 }}>
                {userSettings.map((setting) => (
                  <ListItem
                    key={setting.name}
                    sx={{
                      cursor: "pointer",
                      py: 1.5,
                      px: 2,
                      borderRadius: "8px",
                      mx: 1,
                      mb: 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "translateX(5px)",
                      },
                    }}
                    onClick={() => {
                      setting.onclick();
                      setOpenDrawer(false);
                    }}
                  >
                    <Typography variant="body1">{setting.name}</Typography>
                  </ListItem>
                ))}
                {!loggedInUserData.guest_user && (
                  <ListItem
                    key="change-password"
                    sx={{
                      cursor: "pointer",
                      py: 1.5,
                      px: 2,
                      borderRadius: "8px",
                      mx: 1,
                      mb: 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "translateX(5px)",
                      },
                    }}
                    onClick={() => {
                      setOpenDrawer(false);
                      handleChangePassword(loggedInUserData.email);
                    }}
                  >
                    <Typography variant="body1">Change Password</Typography>
                  </ListItem>
                )}
                <ListItem
                  key="logout"
                  sx={{
                    cursor: "pointer",
                    py: 1.5,
                    px: 2,
                    borderRadius: "8px",
                    mx: 1,
                    mb: 0.5,
                    color: "error.main",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "error.light",
                      transform: "translateX(5px)",
                    },
                  }}
                  onClick={onLogoutClick}
                >
                  <Typography variant="body1" fontWeight={500}>
                    Logout
                  </Typography>
                </ListItem>
              </List>
            </Box>
          </Box>
        </Box>
      </Drawer>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          backgroundColor: "#ffffff",
          padding: "8px 0",
          transition: "all 0.3s ease",
          width: "100%", // Ensure it doesn't overflow
          overflowX: "hidden", // Prevent horizontal overflow
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent={"space-between"}
          alignItems="center"
          sx={{
            padding: "0 5%",
            width: "100%", // Ensure it doesn't overflow
            margin: 0,
          }}
        >
          <Grid
            item
            sx={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Link href="/projects">
              <Image
                onClick={() => navigate("/")}
                src="https://i.postimg.cc/nz91fDCL/undefined-Imgur.webp"
                alt="anudesh"
                height="100"
                width="100"
                className={classes.headerLogo}
                sx={{ marginTop: "5%" }}
                priority
              />
            </Link>
            <Typography
              className="headerTitle"
              sx={{
                fontSize: "28px",
                fontWeight: "bold",
                fontFamily: 'Rowdies,"Roboto,sans-serif',
                color: "#000000",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Anudesh
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => setOpenDrawer(!openDrawer)}
              sx={{
                color: theme.palette.primary.main,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "rotate(90deg)",
                },
              }}
            >
              <Menu />
            </IconButton>
          </Grid>
        </Grid>
      </AppBar>
    </>
  );
}
export default MobileNavbar;
