import {AppBar,Avatar,Box,Checkbox,Divider,FormControlLabel,Grid,IconButton,Menu,MenuItem,Toolbar,Tooltip,
  Typography,Popover,Badge,Stack,Tabs,Tab,Switch,Select,InputLabel,FormControl,Dialog,DialogTitle,DialogContent ,DialogActions ,Button } from "@mui/material";
import { useEffect, useState } from "react";
import headerStyle from "@/styles/Header";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePathname } from "next/navigation";
import MobileNavbar from "./MobileNavbar";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import Logout from "@/Lib/Features/Logout";
import Modal from "./Modal";
import Image from "next/image";
import Transliteration from "../Transliteration/Transliteration";
import CustomizedSnackbars from "../common/Snackbar";
import userRole from "@/utils/UserMappedByRole/Roles";
import UpdateUIPrefsAPI from "@/Lib/Features/user/UpdateUIPrefs";
import { FetchLoggedInUserData } from "@/Lib/Features/getLoggedInData";
import { Link, NavLink } from "react-router-dom";
import ForgotPasswordAPI from "@/app/actions/api/user/ForgotPasswordAPI";
import NotificationAPI from "@/app/actions/api/Notification/Notification";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import GradingSharpIcon from "@mui/icons-material/GradingSharp";
import { formatDistanceToNow, format } from "date-fns";
import NotificationPatchAPI from "@/app/actions/api/Notification/NotificationPatchApi";
import APITransport from "@/app/actions/apitransport/apitransport";

const Header = () => {
  /* eslint-disable react-hooks/exhaustive-deps */
  /* eslint-disable-next-line react/jsx-key */

  const currentUrl = window.location.href;
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElHelp, setAnchorElHelp] = useState(null);
  const [isSpaceClicked, setIsSpaceClicked] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [showTransliterationModel, setShowTransliterationModel] =
    useState(false);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  //const[checkClUI,setCheckClUI]=useState(null)
  const [open, setOpen] = useState(false);
  const [emailToChange, setEmailToChange] = useState("");
  const [moreHorizonAnchorEl, setMoreHorizonAnchorEl] = useState(null);
  const [Notification, setnotification] = useState();
  const [unread, setunread] = useState(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  //below one is for Unreaded notification count countinue from line No. 157
  const [notificationCount, setNotificationCount] = useState(0);

  if (localStorage.getItem("source") !== undefined) {
    localStorage.setItem("source", "anudesh-frontend");
  }

  const handleMoreHorizonClick = (event) => {
    setMoreHorizonAnchorEl(event.currentTarget);
  };

  const handleMoreHorizonClose = () => {
    setMoreHorizonAnchorEl(null);
  };

  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathname = usePathname();
  const classes = headerStyle();

  const getLoggedInUserData = () => {
    dispatch(FetchLoggedInUserData("me"));
  };

  const fetchNotifications = () => {
    let apiObj = new NotificationAPI();
    const endpoint = unread == null ? apiObj.apiEndPoint() : `${apiObj.apiEndPoint()}?seen=${unread}`;
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
  const fetchUnreadCount = async () => {
    try {
      let apiObj = new NotificationAPI();
      const endpoint = `${apiObj.apiEndPoint()}unread`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: apiObj.getHeaders().headers,
      });
      if (!response.ok) {
        throw new Error(`Error fetching unread notifications: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // Assuming the response contains a total_count field
      setNotificationCount(data.total_count || 0);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      setNotificationCount(0);
    }
  };
  // Fetch unread notifications on mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);


  const markAsRead =  (notificationId) => {
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

  // useEffect(() => {
  //   fetchNotifications();
  // }, [unread,selectedNotificationId]);
  
  useEffect(() => {
    getLoggedInUserData();
  }, []);

  /* useEffect(()=>{
    if(loggedInUserData?.prefer_cl_ui !== undefined){
      setCheckClUI(loggedInUserData?.prefer_cl_ui)
    }
  },[loggedInUserData]) */

  // const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const onLogoutClick = () => {
    handleCloseUserMenu();
    dispatch(Logout());
    // ExpireSession();
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    navigate("/");
  };

  // const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const keyPress = (e) => {
    if (e.code === "Escape" && showTransliterationModel) {
      handleTransliterationModelClose();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", keyPress);
    return () => {
      window.removeEventListener("keydown", keyPress);
    };
  }, [keyPress]);
  const handleTitleMouseEnter = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handleTitleMouseLeave = () => {
    setPopoverAnchorEl(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleopenproject = (id, type) => {
    if (type == "publish_project") {
      navigate(`/projects/${id}`);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenHelpMenu = (event) => {
    setAnchorElHelp(event.currentTarget);
  };

  const handleInfo = () => {
    window.open("https://github.com/AI4Bharat/Anudesh/wiki", "_blank");
  };

  const handleCloseHelpMenu = () => {
    setAnchorElHelp(null);
  };

  const handleOpenSettingsMenu = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
  };

  const handleOpenNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };
const [isRtl, setIsRtl] = useState(false);

useEffect(() => {
  if (typeof window !== "undefined") {
    setIsRtl(localStorage.getItem("rtl") === "true");
  }
}, []);



  const handleRTLChange = (event) => {
    if (typeof window !== "undefined") {
        const value = event.target.checked;
  setIsRtl(value);

      let style;
      if (event.target.checked) {
        localStorage.setItem("rtl", true);
        style = document.createElement("style");
        style.innerHTML = "input, textarea { direction: RTL; }";
        document.head.appendChild(style);
      } else {
        localStorage.setItem("rtl", false);
        style = document.createElement("style");
        style.innerHTML = "input, textarea { direction: unset; }";
        document.head.appendChild(style);
      }
    }
  };

  const handleTranscriptionFlowChange = async (event) => {
    const obj = new UpdateUIPrefsAPI(event.target.checked);
    // dispatch(APITransport(loggedInUserObj));
    const res = await fetch(obj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      getLoggedInUserData();
      setSnackbarInfo({
        open: true,
        message: resp.message,
        variant: "success",
      });
    }
  };
  const handleTabChange = async (index) => {
    if (index === 0) {
      await setunread(null);
    } else if (index === 1) {
      await setunread("False");
    }
  };

  // const handleTabChange = (newValue) => {
  //   setValue(newValue);
  //   setunread(newValue === 0 ? "False" : null);
  //   fetchNotifications();
  // };

  
  const handleTagsChange = (event) => {
    if (typeof window !== "undefined") {
      if (event.target.checked) {
        localStorage.setItem("enableTags", true);
        setSnackbarInfo({
          open: true,
          message: "Please type blackslash ( \\ ) to access the tags",
          variant: "info",
        });
      } else {
        localStorage.setItem("enableTags", false);
      }
    }
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
  const unseenNotifications =
    Notification?.length > 0 &&
    Notification?.filter(
      (notification) =>
        notification?.seen_json == null ||
        !notification?.seen_json[loggedInUserData.id],
    );

  const renderTabs = () => {
    if (
      userRole.Annotator === loggedInUserData?.role ||
      userRole.Reviewer === loggedInUserData?.role ||
      userRole.SuperChecker === loggedInUserData?.role
    ) {
      return (
        <Grid
          container
          direction="row"
          sx={{ width: "fit-content", gap: "5px" }}
        >
          {loggedInUserData.guest_user ? (
            <Typography variant="body1">
              <NavLink
                to="/guest_workspaces"
                className={({ isActive }) =>
                  isActive ? classes.highlightedMenu : classes.headerMenu
                }
                activeClassName={classes.highlightedMenu}
              >
                Guest Workspaces
              </NavLink>
            </Typography>
          ) : null}
          <Typography variant="body1">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Projects
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Analytics
            </NavLink>
          </Typography>
        </Grid>
      );
    } else if (userRole.WorkspaceManager === loggedInUserData?.role) {
      return (
        <Grid
          container
          direction="row"
          sx={{ width: "fit-content", gap: "5px" }}
        >
          <Typography variant="body1">
            <NavLink
              to={`/workspaces/${loggedInUserData?.organization?.id}`}
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Workspaces
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Projects
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/datasets"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Datasets
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Analytics
            </NavLink>
          </Typography>
        </Grid>
      );
    } else if (userRole.OrganizationOwner === loggedInUserData?.role) {
      return (
        <Grid
          container
          direction="row"
          sx={{ width: "fit-content", gap: "5px" }}
        >
          <Typography variant="body1">
            <NavLink
              to={
                loggedInUserData && loggedInUserData?.organization
                  ? `/organizations/${loggedInUserData?.organization.id}`
                  : `/organizations/1`
              }
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Organization
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Projects
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/datasets"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Datasets
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Analytics
            </NavLink>
          </Typography>
        </Grid>
      );
    } else if (userRole.Admin === loggedInUserData?.role) {
      return (
        <Grid
          container
          direction="row"
          sx={{ width: "fit-content", gap: "5px" }}
        >
          <Typography variant="body1">
            <NavLink
              to={
                loggedInUserData && loggedInUserData?.organization
                  ? `/organizations/${loggedInUserData?.organization.id}`
                  : `/organizations/1`
              }
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Organization
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Projects
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/datasets"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Datasets
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Analytics
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Admin
            </NavLink>
          </Typography>
        </Grid>
      );
    } else {
      return null;
    }
  };

  const tabs = [
    // Guest Workspaces tab - only shown for guest users who are Annotators, Reviewers, or SuperCheckers
    loggedInUserData?.guest_user &&
    (userRole.Annotator === loggedInUserData?.role ||
      userRole.Reviewer === loggedInUserData?.role ||
      userRole.SuperChecker === loggedInUserData?.role) ? (
      <Typography key="guest" variant="body1">
        <NavLink
          to="/guest_workspaces"
          className={({ isActive }) =>
            isActive ? classes.highlightedMenu : classes.headerMenu
          }
          activeClassName={classes.highlightedMenu}
        >
          Guest Workspaces
        </NavLink>
      </Typography>
    ) : null,

    // Organization tab - only shown for Organization Owners and Admins
    userRole.OrganizationOwner === loggedInUserData?.role ||
    userRole.Admin === loggedInUserData?.role ? (
      <Typography key="organization" variant="body1">
        <NavLink
          to={
            loggedInUserData && loggedInUserData?.organization
              ? `/organizations/${loggedInUserData?.organization.id}`
              : `/organizations/1`
          }
          className={({ isActive }) =>
            isActive ? classes.highlightedMenu : classes.headerMenu
          }
          activeClassName={classes.highlightedMenu}
        >
          Organization
        </NavLink>
      </Typography>
    ) : null,

    // Workspaces tab - only shown for Workspace Managers
    userRole.WorkspaceManager === loggedInUserData?.role ? (
      <Typography key="workspaces" variant="body1">
        <NavLink
          to="/workspaces"
          className={({ isActive }) =>
            isActive ? classes.highlightedMenu : classes.headerMenu
          }
          activeClassName={classes.highlightedMenu}
        >
          Workspaces
        </NavLink>
      </Typography>
    ) : null,

    // Projects tab - shown for all roles
    <Typography key="projects" variant="body1">
      <NavLink
        to="/projects"
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Projects
      </NavLink>
    </Typography>,

    // Datasets tab - only shown for Workspace Managers, Organization Owners, and Admins
    userRole.WorkspaceManager === loggedInUserData?.role ||
    userRole.OrganizationOwner === loggedInUserData?.role ||
    userRole.Admin === loggedInUserData?.role ? (
      <Typography key="datasets" variant="body1">
        <NavLink
          to="/datasets"
          className={({ isActive }) =>
            isActive ? classes.highlightedMenu : classes.headerMenu
          }
          activeClassName={classes.highlightedMenu}
        >
          Datasets
        </NavLink>
      </Typography>
    ) : null,

    // Analytics tab - shown for all roles
    <Typography key="analytics" variant="body1">
      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Analytics
      </NavLink>
    </Typography>,

    // Admin tab - only shown for Admins
    userRole.Admin === loggedInUserData?.role ? (
      <Typography key="admin" variant="body1">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive ? classes.highlightedMenu : classes.headerMenu
          }
          activeClassName={classes.highlightedMenu}
        >
          Admin
        </NavLink>
      </Typography>
    ) : null,
  ];

  // Filter out null values
  const filteredTabs = tabs.filter((tab) => tab !== null);

  const userSettings = [
    {
      name: "My Profile",
      onclick: () => {
        handleCloseUserMenu();
        navigate(`/profile/${loggedInUserData?.id}`);
      },
    },
    {
      name: "My Progress",
      onclick: () => {
        handleCloseUserMenu();
        navigate(`/progress/${loggedInUserData?.id}`);
      },
    },
  ];

  const appSettings = [
    {
      name: "Transliteration",
      onclick: () => {
        // navigate("/transliteration");
        handleCloseSettingsMenu();
        setShowTransliterationModel(true);
      },
    },
    {
      name: "Enable RTL-typing",
      control: (
        <Checkbox
          onChange={handleRTLChange}
          checked={isRtl}
        />
      ),
    },
  ];
  const helpMenu = [
    {
      name: "Help",
      onclick: () => {
        const url = "https://github.com/AI4Bharat/Shoonya/wiki/Shoonya-FAQ";
        window.open(url, "_blank");
      },
    },
  ];

  const appInfo = [
    {
      name: "Help",
      onclick: () => {
        const url = "https://github.com/AI4Bharat/Anudesh/wiki";
        window.open(url, "_blank");
      },
    },

    {
      name: "Notifications",
    },
  ];

  const handleTransliterationModelClose = () => {
    setShowTransliterationModel(false);
  };

  const handleClickOpen = (email) => {
    setEmailToChange(email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmailToChange("");
  };

  const handleApply = async () => {
    await handleChangePassword(emailToChange);
    handleClose();
  };

  const handleChangePassword = async (email) => {
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

  const [globalTransliteration, setGlobalTransliteration] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "",
  );

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);
  useEffect(() => {
    localStorage.setItem("globalTransliteration", globalTransliteration);
  }, [globalTransliteration]);

  return (
    <Grid container direction="row" style={{ zIndex: 1 }}>
      <Box className={classes.parentContainer}>
        {isMobile ? (
          <MobileNavbar
            tabs={filteredTabs}
            userSettings={userSettings}
            appSettings={appSettings}
            appInfo={appInfo}
            loggedInUserData={loggedInUserData}
          />
        ) : (
          <AppBar
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Toolbar className={classes.toolbar}>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                }}
              >
                <a
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    gap: "10px",
                  }}
                  onClick={() => navigate("/")}
                >
                  <Image
                    src="https://i.postimg.cc/nz91fDCL/undefined-Imgur.webp"
                    alt="anudesh"
                    height="100"
                    width="100"
                    className={classes.headerLogo}
                    priority
                  />
                  <Typography variant="h4" className={classes.headerTitle}>
                    Anudesh
                  </Typography>
                </a>
              </Grid>

              {/* <Grid
                container
                direction="row"
                // justifyContent="space-evenly"
                // spacing={0}
                columnGap={2}
                rowGap={2}
                xs={12}
                sm={12}
                md={7}
              >
                {tabs.map((tab) => tab)}
              </Grid> */}
              {renderTabs()}
              {renderSnackBar()}
              <Grid container sx={{ width: "fit-content" }}>
                <Grid
                  container
                  direction="row"
                  sx={{
                    width: "fit-content",
                  }}
                >
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip
                      title={
                        <span style={{ fontFamily: "Rowdies" }}>
                          Notifications
                        </span>
                      }
                    >
                     <IconButton onClick={handleOpenNotification}>
                        <Badge badgeContent={notificationCount > 0 ? notificationCount : null} color="primary">
                          <NotificationsIcon
                            color="primary.dark"
                            fontSize="large"
                          />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip
                      title={
                        <span style={{ fontFamily: "Roboto, sans-serif" }}>
                          Help
                        </span>
                      }
                    >
                      <IconButton onClick={handleInfo}>
                        <InfoOutlinedIcon
                          color="primary.dark"
                          fontSize="36px"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip
                      title={
                        <span style={{ fontFamily: "Roboto, sans-serif" }}>
                          Settings
                        </span>
                      }
                    >
                      <IconButton onClick={handleOpenSettingsMenu}>
                        <SettingsOutlinedIcon
                          color="primary.dark"
                          fontSize="36px"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip
                      title={
                        <span style={{ fontFamily: "Roboto, sans-serif" }}>
                          User Options
                        </span>
                      }
                    >
                      <IconButton onClick={handleOpenUserMenu}>
                        <Avatar
                          alt="user_profile_pic"
                          variant="contained"
                          src={
                            loggedInUserData?.profile_photo
                              ? loggedInUserData.profile_photo
                              : ""
                          }
                          className={classes.avatar}
                        >
                          {loggedInUserData &&
                            loggedInUserData?.username &&
                            loggedInUserData?.username.split("")[0]}
                        </Avatar>
                        <Typography
                          variant="body1"
                          color="black"
                          sx={{
                            ml: 1,
                            fontSize: "1rem",
                            fontWeight: 500,
                            display: {
                              xs: "block",
                              sm: "block",
                              md: "none",
                              lg: "block",
                            },
                          }}
                        >
                          {loggedInUserData?.username}
                        </Typography>
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElSettings}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElSettings)}
                  onClose={handleCloseSettingsMenu}
                >
                  {appSettings.map((setting) => (
                    <MenuItem key={setting} onClick={setting.onclick}>
                      {setting.control ? (
                        <FormControlLabel
                          control={setting.control}
                          label={setting.name}
                          labelPlacement="start"
                          sx={{ ml: 0 }}
                        />
                      ) : (
                        <Typography variant="body2" textAlign="center">
                          {setting.name}
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <Typography variant="body2" textAlign="center">
                      Global Transliteration
                    </Typography>
                    <Switch
                      onClick={() => {
                        setGlobalTransliteration(!globalTransliteration);
                      }}
                      checked={globalTransliteration}
                    />
                  </MenuItem>
                  <MenuItem>
                    {globalTransliteration && (
                      <FormControl fullWidth>
                        <InputLabel id="language-select-label">
                          Language
                        </InputLabel>
                        <Select
                          label="Language"
                          labelId="language-select-label"
                          value={language}
                          onChange={(e) => {
                            setLanguage(e.target.value);
                          }}
                        >
                          <MenuItem disabled value=""></MenuItem>
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="hi">Hindi</MenuItem>
                          <MenuItem value="mr">Marathi</MenuItem>
                          <MenuItem value="ta">Tamil</MenuItem>
                          <MenuItem value="te">Telugu</MenuItem>
                          <MenuItem value="kn">Kannada</MenuItem>
                          <MenuItem value="gu">Gujarati</MenuItem>
                          <MenuItem value="pa">Punjabi</MenuItem>
                          <MenuItem value="bn">Bengali</MenuItem>
                          <MenuItem value="ml">Malayalam</MenuItem>
                          <MenuItem value="as">Assamese</MenuItem>
                          <MenuItem value="brx">Bodo</MenuItem>
                          <MenuItem value="doi">Dogri</MenuItem>
                          <MenuItem value="ks">Kashmiri</MenuItem>
                          <MenuItem value="mai">Maithili</MenuItem>
                          <MenuItem value="mni">Manipuri</MenuItem>
                          <MenuItem value="ne">Nepali</MenuItem>
                          <MenuItem value="or">Odia</MenuItem>
                          <MenuItem value="sd">Sindhi</MenuItem>
                          <MenuItem value="si">Sinhala</MenuItem>
                          <MenuItem value="ur">Urdu</MenuItem>
                          <MenuItem value="sat">Santali</MenuItem>
                          <MenuItem value="sa">Sanskrit</MenuItem>
                          <MenuItem value="gom">Goan Konkani</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </MenuItem>
                </Menu>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Typography variant="body2" sx={{ pl: "1rem", mt: 1 }}>
                    Signed in as <b>{loggedInUserData?.last_name}</b>
                  </Typography>
                  <Divider sx={{ mb: 2, mt: 1 }} />
                  {userSettings.map((setting) => (
                    <MenuItem key={setting} onClick={setting.onclick}>
                      <Typography variant="body2" textAlign="center">
                        {setting.name}
                      </Typography>
                    </MenuItem>
                  ))}
                  {!loggedInUserData.guest_user && (
                    <MenuItem
                      key={3}
                      onClick={() => {
                        handleCloseUserMenu();
                        handleClickOpen(loggedInUserData.email);
                        // handleChangePassword(loggedInUserData.email);
                      }}
                    >
                      <Typography variant="body2" textAlign="center">
                        Change Password
                      </Typography>
                    </MenuItem>
                  )}
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Change Password:</DialogTitle>
                  <DialogContent>
                   Are you sure you want to change your password?
                 </DialogContent>
                 <DialogActions>
                 <Button onClick={handleApply} color="primary" variant="contained">
                   Confirm
                  </Button>
                  <Button onClick={handleClose} color="error" variant="contained">
                   Cancel
                  </Button>
                 </DialogActions>
                </Dialog>
                  <MenuItem
                    key={4}
                    onClick={() => onLogoutClick()}
                    style={{ cursor: "pointer" }}
                  >
                    <Typography variant="body2" textAlign="center">
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElHelp}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElHelp)}
                  onClose={handleCloseHelpMenu}
                >
                  {helpMenu.map((help) => (
                    <MenuItem key={help} onClick={help.onclick}>
                      {help.control ? (
                        <FormControlLabel
                          control={help.control}
                          label={help.name}
                          labelPlacement="start"
                          sx={{ ml: 0 }}
                        />
                      ) : (
                        <Typography variant="body2" textAlign="center">
                          {help.name}
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Menu>
                <Menu
                  sx={{ mt: "45px", display: "flex", flexDirection: "row" }}
                  id="menu-appbar"
                  anchorEl={anchorElNotification}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  style={{ overflow: "scroll" }}
                  open={Boolean(anchorElNotification)}
                  onClose={handleCloseNotification}
                >
                  <Stack
                    direction="row"
                    style={{
                      justifyContent: "space-between",
                      padding: "0 10px 0 10px",
                    }}
                  >
                    <Typography variant="h4">Notifications</Typography>
                    {Notification &&
                    Notification?.length > 0 &&
                    unseenNotifications?.length > 0 ? (
                      <Tooltip title="Mark all as read">
                        <IconButton
                          aria-label="More"
                          onClick={handleMarkAllAsReadClick}
                        >
                          <GradingSharpIcon color="primary" />
                        </IconButton>{" "}
                      </Tooltip>
                    ) : null}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    style={{ padding: "0 0 10px 10px" }}
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      sx={{
                        "& .MuiTabs-indicator": {
                          backgroundColor: (theme) =>
                            theme.palette.primary.main,
                        },
                      }}
                    >
                      <Tab label="All" onClick={() => handleTabChange(0)} />
                      <Tab label="Unread" onClick={() => handleTabChange(1)} />
                    </Tabs>
                  </Stack>
                  {Notification && Notification?.length > 0 ? (
                    <>
                      {Notification.map((notification, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                          }}
                        >
                          <div
                            style={{ marginRight: "10px", cursor: "pointer" }}
                          >
                            <FiberManualRecordIcon
                              color={
                                notification?.seen_json
                                  ? notification?.seen_json[loggedInUserData.id]
                                    ? "action"
                                    : "primary"
                                  : "primary"
                              }
                            />
                          </div>
                          <Link
                            style={{
                              color: "rgba(0, 0, 0, 0.87)",
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                            to={notification.on_click}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                fontFamily="Roboto, sans-serif"
                                fontWeight="bold"
                              >{`ID: ${
                                notification?.title?.split("\n")[0]
                              }`}</Typography>
                              <Typography
                                style={{ paddingLeft: "10px" }}
                                variant="subtitle2"
                                fontFamily="Roboto, sans-serif"
                                fontWeight="bold"
                              >{`TITLE: ${notification?.notification_type}`}</Typography>
                              <Typography
                                style={{ padding: "5px 5px 0px 5px" }}
                                variant="caption"
                                color="action"
                              >{`${formatDistanceToNow(
                                new Date(notification?.created_at),
                                { addSuffix: true },
                              )}`}</Typography>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                style={{
                                  justifyContent: "flex-start",
                                  width: "100%",
                                }}
                                variant="body2"
                              >
                                {notification?.title?.split("\n")[1]}
                              </Typography>
                              {/* {notification?.seen_json==null || !notification?.seen_json[loggedInUserData.id] ?
                              <Tooltip title="Mark as read"><IconButton aria-label="More" onClick={() => handleMarkAsRead(notification?.id)}>
                                <CheckCircleOutlineRoundedIcon color="primary"/>
                              </IconButton></Tooltip>:null} */}
                            </div>
                            <Typography
                              variant="caption"
                              color="action"
                            >{`Sent on: ${format(
                              new Date(notification?.created_at),
                              "MMM d, yyyy",
                            )}`}</Typography>
                            {index !== Notification?.length - 1 && <Divider />}
                          </Link>
                          {notification?.seen_json == null ||
                          !notification?.seen_json[loggedInUserData.id] ? (
                            <Tooltip title="Mark as read">
                              <IconButton
                                aria-label="More"
                                onClick={() =>
                                  handleMarkAsRead(notification?.id)
                                }
                              >
                                <CheckCircleOutlineRoundedIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <NotificationsOffIcon color="disabled" fontSize="large" />
                      <Typography
                        variant="h5"
                        color="textSecondary"
                        style={{ marginTop: "10px" }}
                      >
                        No notifications found
                      </Typography>
                    </div>
                  )}
                </Menu>
                <Popover
                  open={Boolean(moreHorizonAnchorEl)}
                  anchorEl={moreHorizonAnchorEl}
                  onClose={handleMoreHorizonClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleMarkAllAsReadClick}>
                    Mark All as read
                  </MenuItem>
                </Popover>
                <Popover
                  open={Boolean(popoverAnchorEl)}
                  anchorEl={popoverAnchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleMarkAsRead}>Mark as Read</MenuItem>
                </Popover>
              </Grid>
            </Toolbar>
          </AppBar>
        )}
      </Box>
      <Modal
        open={showTransliterationModel}
        onClose={() => handleTransliterationModelClose}
        top={50}
        left={50}
        topTranslate={"40"}
        leftTranslate={"-50"}
        isTransliteration={true}
        style={{ cursor: "pointer" }}
        // sx={{width: "400px"}}
      >
        <Transliteration
          onCancelTransliteration={() => handleTransliterationModelClose}
          setIsSpaceClicked={setIsSpaceClicked}
          isSpaceClicked={isSpaceClicked}
          setShowTransliterationModel={setShowTransliterationModel}
        />
      </Modal>
    </Grid>
  );
};

export default Header;