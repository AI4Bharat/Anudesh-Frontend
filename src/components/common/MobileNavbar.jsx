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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Modal from "@mui/material/Modal";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CustomizedSnackbars from "./Snackbar";
import GradingSharpIcon from "@mui/icons-material/GradingSharp";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import Link from "next/link";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { Menu, Close } from "@mui/icons-material";
import NotificationAPI from "@/app/actions/api/Notification/Notification";
import Logout from "@/Lib/Features/Logout";
import headerStyle from "@/styles/Header";
import ForgotPasswordAPI from "@/app/actions/api/user/ForgotPasswordAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import NotificationPatchAPI from "@/app/actions/api/Notification/NotificationPatchApi";
import APITransport from "@/app/actions/apitransport/apitransport";
import anudesh_Logo from "../../assets/logo.jpeg"

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%", // Increased width to better fit tabs
  bgcolor: "background.paper",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

function MobileNavbar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loggedInUserData, appSettings, userSettings, tabs, appInfo } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: "", variant: "success" });
  const classes = headerStyle();
  const [activeTab, setActiveTab] = useState(0);
  const [Notification, setnotification] = useState();
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [unread, setunread] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchNotifications = () => {
    let apiObj = new NotificationAPI();
    const endpoint =
      unread == null
        ? apiObj.apiEndPoint()
        : `${apiObj.apiEndPoint()}?seen=${unread}`;

    fetch(endpoint, {
      method: "get",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response?.json();
          setnotification(data);
        } else {
          setnotification([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  const markAsRead = (notificationId) => {
    const task = new NotificationPatchAPI(notificationId);
    setSelectedNotificationId(notificationId);
    dispatch(APITransport(task));
    fetchNotifications();
  };

  const markAllAsRead = () => {
    const notificationIds = Notification.map((notification) => notification.id);
    const tasks = new NotificationPatchAPI(notificationIds);
    setSelectedNotificationId(notificationIds);
    dispatch(APITransport(tasks));
    fetchNotifications();
  };

  const handleMarkAllAsReadClick = () => {
    markAllAsRead();
  };

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };

  useEffect(() => {
    fetchNotifications();
  }, [unread, selectedNotificationId]);

  const handleOpenModal = () => {
    setOpenModal(true);
    setOpenDrawer(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const unseenNotifications =
    Notification?.length > 0 &&
    Notification?.filter(
      (notification) =>
        notification?.seen_json == null ||
        !notification?.seen_json[loggedInUserData.id],
    );

  const handleOpenDialog = () => {
    setOpenDrawer(false);
    setTimeout(() => {
      setConfirmDialogOpen(true);
    }, 300); 
  };
  
  const handleCloseDialog = () => setConfirmDialogOpen(false);
  const handleCloseSnackbar = () => setSnackbarInfo({ ...snackbarInfo, open: false });

  const handleChangePassword = async (email) => {

    setConfirmDialogOpen(false);
    let obj = new ForgotPasswordAPI({ email: email });
    const res = await fetch(obj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: "Link to change password sent successfully on your email.",
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

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
            // height: "100%",
            position: "sticky",
            top: 0,
            zIndex: 10,
            pb: 2,
            // overflowX: "hidden", // Prevent horizontal overflow
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
              href={`/profile/${loggedInUserData.id}`}
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
                  borderColor: "#FEE0B3",
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
              // overflowY: "auto",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              // height: "100%",
            }}
          >
            <Box sx={{ mt: 1 }}>
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

            <Box sx={{ mt: 1}}>
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
                {appInfo.map((setting, index) => {
                  return (
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
                      onClick={() => {
                        if (setting.name === "Notifications") {
                          handleOpenModal();
                        } else {
                          setting.onclick()
                        }
                      }}
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
                  );
                })}
              </List>
            </Box>

            <Box sx={{ mt: 1}}>
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

            <Box sx={{ mt: 1}}>
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
                      onClick={handleOpenDialog}
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
          // overflowX: "hidden", // Prevent horizontal overflow
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
                src={anudesh_Logo}
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

      <Dialog open={confirmDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle> Password Change: </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change your password?
          </DialogContentText>
        </DialogContent>
        <Box>
        <DialogActions>
          <Button onClick={() => handleChangePassword(loggedInUserData.email)} color="primary" variant="contained">
            Confirm
          </Button>
          <Button onClick={handleCloseDialog} color="error" variant="contained">
            Cancel
          </Button>
        </DialogActions>
        </Box>
      </Dialog>

      <CustomizedSnackbars
         open={snackbarInfo.open}
         handleClose={handleCloseSnackbar}
         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
         variant={snackbarInfo.variant} 
         message={snackbarInfo.message}
      />
      {/* Modal for Notification */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="notification-modal-title"
        aria-describedby="notification-modal-description"
      >
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              id="notification-modal-title"
              variant="h6"
              component="h2"
            >
              Notifications
            </Typography>
            {Notification &&
              Notification.length > 0 &&
              unseenNotifications?.length > 0 && (
                <Tooltip title="Mark all as read">
                  <IconButton
                    aria-label="More"
                    onClick={handleMarkAllAsReadClick}
                  >
                    <GradingSharpIcon color="primary" />
                  </IconButton>
                </Tooltip>
              )}
          </Box>

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="All" />
            <Tab label="Unread" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
              {Notification && Notification.length > 0 ? (
                Notification.map((notification, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 1,
                      borderRadius: "8px",
                      backgroundColor:
                        notification?.seen_json &&
                        notification?.seen_json[loggedInUserData.id]
                          ? "background.paper"
                          : "#FFFDE6",
                      border: "1px solid",
                      borderColor: "divider",
                      position: "relative",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      navigate(notification.on_click);
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      {notification.title || "Notification"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message || "No message content"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>

                    {(!notification?.seen_json ||
                      !notification?.seen_json[loggedInUserData.id]) && (
                      <Tooltip title="Mark as read">
                        <IconButton
                          size="small"
                          sx={{ position: "absolute", bottom: 8, right: 8 }}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircleOutlineRoundedIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", py: 3 }}>
                  No notifications available
                </Typography>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
              {unseenNotifications && unseenNotifications.length > 0 ? (
                unseenNotifications.map((notification, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 1,
                      borderRadius: "8px",
                      backgroundColor: "#FFFDE6",
                      border: "1px solid",
                      borderColor: "#FEE0B3",
                      position: "relative",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      navigate(notification.on_click);
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      {notification.title || "Notification"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message || "No message content"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>

                    <Tooltip title="Mark as read">
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", bottom: 8, right: 8 }}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckCircleOutlineRoundedIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))
              ) : (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3 }}>
                <NotificationsOffIcon sx={{ fontSize: 50, color: "gray" }} />
                <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                  No unread notifications
                </Typography>
              </Box>

              )}
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
export default MobileNavbar;
