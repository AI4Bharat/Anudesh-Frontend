import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  Grid,
  AppBar, 
  Divider,
  Avatar,
  Typography,
  Box,
  FormControlLabel,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "@mui/icons-material";
import Logout from "@/Lib/Features/Logout";
import headerStyle from "@/styles/Header";
import ForgotPasswordAPI from "@/app/actions/api/user/ForgotPasswordAPI";
import {  useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const handleChangePassword = async (email) => {
    let obj = new ForgotPasswordAPI({email: email});
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
  const { loggedInUserData, appSettings, userSettings, tabs } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = headerStyle();

  const onLogoutClick = () => {
    dispatch(Logout());
    if (typeof window !== 'undefined') {
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
            padding: 2,
            width: { xs: "75%", sm: "50%", md: "30%" }, 
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            pb: 2,
          }}
        >
          <Box>
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
                  justifyContent: "center",
                  gap: 2,
                  pb: 2,
                }}
              >
                <Avatar
                  alt="user_profile_pic"
                  className="avatar"
                  sx={{ bgcolor: "primary.main" }}
                >
                  {loggedInUserData?.username?.[0]}
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    ml: 1,
                    color: "text.primary",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  {loggedInUserData.username}
                </Typography>
              </Box>
            </Link>
            <Divider />
          </Box>

          <Box>
            <List>
              {tabs.map((tab, i) => (
                <ListItem
                  key={i}
                  sx={{
                    cursor: "pointer",
                    py: 1,
                    px: 2,
                  }}
                  onClick={() => setOpenDrawer(false)}                 
                >
                  {tab}
                </ListItem>
              ))}
            </List>
          </Box>

          {/* App Settings Section */}
          <Box>
            <Typography
              variant="h6"
              align="center"
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, pb: 1 }}
            >
              App Settings
            </Typography>
            <Divider />
            <List>
              {appSettings.map((setting, index) => (
                <ListItem
                  key={index}
                  sx={{
                    cursor: "pointer",
                    py: 1,
                    px: 2,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={setting.onclick}
                >
                  {setting.control ? (
                    <FormControlLabel
                      control={setting.control}
                      label={setting.name}
                    />
                  ) : (
                    <Typography variant="body1" textAlign="center">
                      {setting.name}
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>

          <Box>
            <Typography
              variant="h6"
              align="center"
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, pb: 1 }}
            >
              User Settings
            </Typography>
            <Divider />
            <List>
              {userSettings.map((setting) => (
                <ListItem
                  key={setting.name}
                  sx={{
                    cursor: "pointer",
                    py: 1,
                    px: 2,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => {
                    setting.onclick();
                    setOpenDrawer(false);
                  }}
                >
                  <Typography variant="body1" textAlign="center">
                    {setting.name}
                  </Typography>
                </ListItem>
              ))}
              {!loggedInUserData.guest_user && (
                <ListItem
                  key="change-password"
                  sx={{
                    cursor: "pointer",
                    py: 1,
                    px: 2,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => {
                    setOpenDrawer(false);
                    handleChangePassword(loggedInUserData.email);
                  }}
                >
                  <Typography variant="body1" textAlign="center">
                    Change Password
                  </Typography>
                </ListItem>
              )}
              <ListItem
                key="logout"
                sx={{
                  cursor: "pointer",
                  py: 1,
                  px: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={onLogoutClick}
              >
                <Typography variant="body1" textAlign="center">
                  Logout
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
      <AppBar style={{ backgroundColor: "#ffffff", padding: "8px 0" }}>
        <Grid
          container
          direction="row"
          justifyContent={"space-between"}
          style={{
            padding: "0 5%",
          }}
        >
          <Grid
            item
            sx={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Link href="/projects">
              <Image
                onClick={() => navigate("/")}
                src="https://i.imgur.com/56Ut9oz.png"
                alt="anudesh"
                height="100"
                width="100"
                className={classes.headerLogo}
                sx={{ marginTop: "5%" }}
              />
            </Link>
            <Typography
              className="headerTitle"
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                fontFamily: 'Rowdies,"Roboto,sans-serif',
                color: "#000000",
              }}
            >
              Anudesh
            </Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
              <Menu />
            </IconButton>
          </Grid>
        </Grid>
      </AppBar>
    </>
  );
}
export default MobileNavbar;
