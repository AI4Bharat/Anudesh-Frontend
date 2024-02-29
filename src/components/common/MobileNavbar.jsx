import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
//   makeStyles,
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

import headerStyle from "@/styles/Header";
import ForgotPasswordAPI from "@/app/actions/api/user/ForgotPasswordAPI";

// const useStyles = makeStyles(() => ({
//   Navlink: {
//     textDecoration: "none",
//     color: "blue",
//     fontSize: "20px",
//   },
//   icon: {
//     color: "white",
//   },
// }));

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
  const { loggedInUserData, appSettings, userSettings, tabs } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = headerStyle();

  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} PaperProps={{
        style: {
            padding: "16px"
        }
      }}>
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                paddingBottom: "16px"
            }}
        >
            <Box>
                <Link href="/profile" onClick={() => setOpenDrawer(false)} style={{
                    textDecoration: "none"
                }}>
                    <Box
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            columnGap: "16px",
                            paddingBottom: "16px",
                        }}
                    >
                        <Avatar
                            alt="user_profile_pic"
                            variant="contained"
                            className="avatar"
                        >
                            {loggedInUserData && loggedInUserData.username && loggedInUserData.username.split("")[0]}
                        </Avatar>
                        <Typography variant="h6" sx={{ p: 0, ml : 1 }} style={{
                            color: "black"
                        }}>
                            {loggedInUserData.username}
                        </Typography>
                    </Box>
                </Link>
                <Divider />
            </Box>
            <Box>
                <List>
                    {tabs.map((tab,i) => (
                        <ListItem key={i} onClick={() => setOpenDrawer(false)}>
                            {tab}
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box>
                <Typography variant="h6" align="center" style={{
                    fontSize: "1.1rem"
                }}>
                    App Settings
                </Typography>
                <Divider />
                <List>
                    {appSettings.map((setting) => (
                        <ListItem key={setting} onClick={setting.onclick}>
                            {setting.control ? 
                                <FormControlLabel
                                    control={setting.control}
                                    label={setting.name}
                                />
                                : 
                                <Typography variant="body1" textAlign="center">
                                    {setting.name}
                                </Typography>}
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box>
                <Typography variant="h6" align="center" style={{
                    fontSize: "1.1rem"
                }}>
                    User Settings
                </Typography>
                <Divider />
                <List>
                    {userSettings.map((setting) => (
                        <ListItem key={setting} onClick={() => {setting.onclick(); setOpenDrawer(false)}}>
                            <Typography variant="body1" textAlign="center">
                                {setting.name}
                            </Typography>
                        </ListItem>
                    ))}
                    {!loggedInUserData.guest_user && 
                        <ListItem key={3} onClick={() => {setOpenDrawer(false); handleChangePassword(loggedInUserData.email);}}>
                            <Typography variant="body1" textAlign="center">
                            Change Password
                            </Typography>
                        </ListItem>
                    }
                    <ListItem key={4} onClick={() => onLogoutClick() }>
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
                padding: "0 5%"
            }}
        > 
            <Grid item sx={{ display: "flex", alignItems: "center" }}>
                <Link href="/projects">
                    Anudesh
                    {/* <img alt="Anudesh" src={Shoonya_Logo} alt="logo" className="headerLogo" style={{marginBottom: "5%"}} /> */}
                </Link>
                <Typography
                  variant="h4"
                  className="headerTitle"
                  style={{
                    fontSize: "28px",
                    fontWeight: "lighter",
                    fontFamily: 'Rowdies,cursive,Roboto,sans-serif'

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
