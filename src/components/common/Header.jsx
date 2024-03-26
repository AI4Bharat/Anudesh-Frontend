import {
  AppBar,
  Avatar,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Popover,
  Switch,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import headerStyle from "@/styles/Header";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePathname } from 'next/navigation'
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

const Header = () => {
       /* eslint-disable react-hooks/exhaustive-deps */
  const currentUrl = window.location.href;
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElHelp, setAnchorElHelp] = useState(null);
  const [isSpaceClicked, setIsSpaceClicked] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [showTransliterationModel, setShowTransliterationModel] =
    useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  //const[checkClUI,setCheckClUI]=useState(null)
  const [moreHorizonAnchorEl, setMoreHorizonAnchorEl] = useState(null);

  if(localStorage.getItem("source") !== undefined){
    localStorage.setItem("source", "anudesh-frontend");
  }

  const handleMoreHorizonClick = (event) => {
    setMoreHorizonAnchorEl(event.currentTarget);
  };

  const handleMoreHorizonClose = () => {
    setMoreHorizonAnchorEl(null);
  };


  const loggedInUserData = useSelector(state => state.getLoggedInData?.data);

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
    if (typeof window !== 'undefined') {
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
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

const handleopenproject=(id,type)=>{
  if(type=="publish_project"){
    navigate(`/projects/${id}`);
  }
}

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleAnalytics = (event) => {
    console.log('Analytics clicked');
  }

  const handleLeaderboard = (event) => {
    console.log('Leaderboard clicked')
  }

  const handleOpenHelpMenu = (event) => {
    setAnchorElHelp(event.currentTarget);
  };

  const handleInfo = (event) => {
    console.log('Information button clicked!')
  }

  const handleCloseHelpMenu = () => {
    setAnchorElHelp(null);
  };

  const handleOpenSettingsMenu = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
  };

  const handleRTLChange = (event) => {
    if (typeof window !== 'undefined') {
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
  const handleTagsChange = (event) => {
  if (typeof window !== 'undefined') {
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
          // justifyContent="space-evenly"
          // spacing={0}
          columnGap={2}
          rowGap={2}
          xs={12}
          sm={12}
          md={7}
        >
          {/* <Typography variant="body1">
            <NavLink
              hidden={loggedInUserData.role === 1}
              to={
                loggedInUserData && loggedInUserData.organization
                  ? `/my-organization/${loggedInUserData.organization.id}`
                  : `/my-organization/1`
              }
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Organization
            </NavLink>
          </Typography> */}
          {/* <Typography variant="body1">
            <NavLink
              hidden={loggedInUserData.role === 1 || loggedInUserData.role === 3}
              to="/workspaces"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Workspaces
            </NavLink>
          </Typography> */}
          { loggedInUserData.guest_user ? <Typography variant="body1">
            <NavLink
              to="/guest_workspaces"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Guest Workspaces
            </NavLink>
          </Typography> : null}
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
          {/* <Typography variant="body1">
            <NavLink
              hidden={loggedInUserData.role === 1}
              to="/datasets"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Datasets
            </NavLink>
          </Typography> */}
        </Grid>
      );
    } else if (userRole.WorkspaceManager === loggedInUserData?.role) {
      return (
        <Grid
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
          {/* <Typography variant="body1">
            <NavLink
              to={
                loggedInUserData && loggedInUserData.organization
                  ? `/my-organization/${loggedInUserData.organization.id}`
                  : `/my-organization/1`
              }
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Organization
            </NavLink>
          </Typography> */}
          <Typography variant="body1">
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
          // justifyContent="space-evenly"
          // spacing={0}
          columnGap={2}
          rowGap={2}
          xs={12}
          sm={12}
          md={7}
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
          // justifyContent="space-evenly"
          // spacing={0}
          columnGap={2}
          rowGap={2}
          xs={12}
          sm={12}
          md={8}
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
    <Typography key={1} variant="body1">
      <NavLink
        hidden={
          userRole.Annotator === loggedInUserData?.role ||
          userRole.Reviewer === loggedInUserData?.role ||
          userRole.SuperChecker === loggedInUserData?.role ||
          userRole.WorkspaceManager === loggedInUserData?.role
        }
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
    </Typography>,
    <Typography variant="body1" key={2}>
      <NavLink
        hidden={userRole.WorkspaceManager !== loggedInUserData?.role}
        to="/workspaces"
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Workspaces
      </NavLink>
    </Typography>,
    <Typography key={3} variant="body1">
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
    <Typography key={4} variant="body1">
      <NavLink
        hidden={
          userRole.Annotator === loggedInUserData?.role ||
          userRole.Reviewer === loggedInUserData?.role ||
          userRole.SuperChecker === loggedInUserData?.role
        }
        to="/datasets"
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Datasets
      </NavLink>
    </Typography>,
    <Typography key={5} variant="body1">
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
    <Typography key={6} variant="body1">
      <NavLink
        to="/admin"
        hidden={userRole.Admin !== loggedInUserData?.role}
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Admin
      </NavLink>
    </Typography>,
  ];

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
          defaultChecked={() => { if (typeof window !== 'undefined') { localStorage.getItem("rtl") === "true"}}}
        />
      ),
    },
    /* {
      name: "Use Chitralekha Transcription Flow",
      control: (
        <Checkbox
          onChange={handleTranscriptionFlowChange}
          checked={checkClUI} 
        />
      ),
    }, */
    // {
    //   name: "Enable Tags Dropdown",
    //   control: (
    //     <Checkbox
    //       onChange={handleTagsChange}
    //       defaultChecked={localStorage.getItem("enableTags") === "true"}
    //     />
    //   ),
    // },

    // {
    //   name: "Help",
    //   onclick: () => {},
    // },
  ];
  const helpMenu = [
    {
      name: "Help",
      onclick: () => {
        const url = "https://github.com/AI4Bharat/Shoonya/wiki/Shoonya-FAQ";
        window.open(url, "_blank");
      },
    },

    // {
    //   name: "Feedback",
    //   onclick: () => {},
    // },
  ];

  const handleTransliterationModelClose = () => {
    setShowTransliterationModel(false);
  };

  const handleChangePassword = async (email) => {
    let obj = new ForgotPasswordAPI({email: email});
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
        })
    } else {
        setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "error",
        })
    }
  };

  const [globalTransliteration, setGlobalTransliteration] = useState(localStorage.getItem("globalTransliteration")=== "true" ? true : false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "");

  useEffect(() => {
    localStorage.setItem("globalTransliteration", globalTransliteration);
    localStorage.setItem("language", language);
  }, [language, globalTransliteration]);

  return (
    <Grid container direction="row" style={{ zIndex: 1 }}>
      <Box
        className={
          // pathname.includes("AudioTranscriptionLandingPage") ? classes.AudioparentContainers: 
        classes.parentContainer
        }
      >
        {isMobile ? (
          <MobileNavbar
            tabs={tabs}
            userSettings={userSettings}
            appSettings={appSettings}
            loggedInUserData={loggedInUserData}
          />
        ) : (
          <AppBar>
            <Toolbar className={classes.toolbar}>
            <Grid
              sx={{ display: "flex", alignItems: "center" }}
              xs={12}
              sm={12}
              md={3}
            >   
                <a style={{ display: "flex", alignItems: "center" }}>
                  <img 
                    onClick={() => navigate("/")} 
                    src="https://i.imgur.com/56Ut9oz.png"
                    alt="anudesh"
                    className={classes.headerLogo}
                    sx={{ marginTop: "5%" }}
                  />
                  <Typography
                    
                    onClick={() => navigate("/")} 
                    variant="h4"
                    className={classes.headerTitle}
                    sx={{
                      fontSize: "28px",
                      fontWeight: "lighter",
                    }}
                  >
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
              <Box sx={{ flexGrow: 0 }} xs={12} sm={12} md={4}>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  spacing={2}
                  sx={{ textAlign: "center", alignItems: "center", }}
                >
                  { currentUrl.includes('/projects/') && currentUrl.includes('/task/') && 
                  <Grid item xs={3} sm={3} md={2}>
                    <Tooltip title="Analytics">
                      <IconButton onClick={handleAnalytics}>
                        <PieChartOutlineOutlinedIcon
                          color="primary.dark"
                          fontSize="large"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>}

                  { currentUrl.includes('/projects/') && currentUrl.includes('/task/') && 
                  <Grid item xs={3} sm={3} md={2}>
                    <Tooltip title="Leaderboard">
                      <IconButton onClick={handleLeaderboard} style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
                        <LeaderboardOutlinedIcon
                          color="primary.dark"
                          fontSize="large"
                        />
                        <h3 className="text-orange-600 text-sm font-bold mt-4">100</h3>
                      </IconButton>
                    </Tooltip>
                  </Grid> }

                  <Grid item xs={3} sm={3} md={2}>
                    <Tooltip title="Help">
                      <IconButton onClick={handleInfo}>
                        <InfoOutlinedIcon
                          color="primary.dark"
                          fontSize="large"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={3} sm={3} md={2}>
                    <Tooltip title="Settings">
                      <IconButton onClick={handleOpenSettingsMenu}>
                        <SettingsOutlinedIcon
                          color="primary.dark"
                          fontSize="large"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={3} sm={3} md={2}>
                    <Tooltip title="User Options">
                      <IconButton onClick={handleOpenUserMenu}>
                        <Avatar
                          alt="user_profile_pic"
                          variant="contained"
                          src={loggedInUserData?.profile_photo ? loggedInUserData.profile_photo : ''}
                          className={classes.avatar}
                        >
                          {loggedInUserData &&
                            loggedInUserData?.username &&
                            loggedInUserData?.username.split("")[0]}
                        </Avatar>
                        <Typography
                          variant="body1"
                          color="black"
                          sx={{ p: 0, ml: 1 }}
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
                    <Switch onClick={() => {setGlobalTransliteration(!globalTransliteration)}} checked={globalTransliteration}/>
                  </MenuItem>
                  <MenuItem>
                    {globalTransliteration && <FormControl fullWidth>
                    <InputLabel id="language-select-label">Language</InputLabel>
                    <Select label="Language" labelId="language-select-label" value={language} onChange={(e) => {setLanguage(e.target.value)}}>
                      <MenuItem disabled value=""></MenuItem>
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
                    </FormControl>}
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
                  {!loggedInUserData.guest_user && 
                    <MenuItem key={3} onClick={() => {handleCloseUserMenu(); handleChangePassword(loggedInUserData.email);}}>
                    <Typography variant="body2" textAlign="center">
                      Change Password
                    </Typography>
                    </MenuItem>
                  }
                  <MenuItem key={4} onClick={() => onLogoutClick() } style={{cursor:"pointer"}}>
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
              </Box>
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
        style={{cursor:"pointer"}}
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
