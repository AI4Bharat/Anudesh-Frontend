import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Avatar,
  Tooltip,
  Menu,
  ListItemIcon,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import TranslateIcon from '@mui/icons-material/Translate';
import LogoutIcon from '@mui/icons-material/Logout';
import Image from "next/image";
import CustomizedSnackbars from "@/components/common/Snackbar";
import PostChatLogAPI from "@/app/actions/api/UnauthUserManagement/PostChatLogAPI";
import PostChatInteractionAPI from "@/app/actions/api/UnauthUserManagement/PostChatInteractionAPI";
import CodeBlock from './codeBlock';
import headerStyle from '@/styles/Header';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from "@/firebase";
import LoginModal from './loginModal';
import AnudeshInfo from './anudeshInfo';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ModelSelectorDialog from './modelSelectorDialog';
import HubIcon from '@mui/icons-material/Hub';
import BoltIcon from '@mui/icons-material/Bolt';
import AllOutIcon from '@mui/icons-material/AllOut';
import ReactMarkdown from "react-markdown";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import configs from "@/config/config";
import { translate } from "@/config/localisation";
import ImagePreview from './imagePreview';
import ENDPOINTS from "../../../../config/apiendpoint";
import config from '@/config/config';
import ConsentBanner from './consentBanner';
import RestoreIcon from '@mui/icons-material/Restore';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { FetchLoggedInUserData } from '@/Lib/Features/getLoggedInData';
import BackButton from '@/components/common/BackButton';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#FFC107',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#121212',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const modelsData = [
  {
    provider: 'OpenAI',
    models: [
      {
        id: 'GPT3.5',
        name: 'GPT 3.5',
        description: 'Advanced reasoning model',
        icon: <AutoAwesomeIcon sx={{ color: '#8E44AD' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'GPT4',
        name: 'GPT 4',
        description: 'Efficient reasoning model',
        icon: <AutoAwesomeIcon sx={{ color: '#D252E4' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'GPT4O',
        name: 'GPT 4o',
        description: 'Efficient reasoning model',
        icon: <AutoAwesomeIcon sx={{ color: '#D252E4' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'GPT4OMini',
        name: 'GPT 4o Mini',
        description: 'Efficient reasoning model',
        icon: <AutoAwesomeIcon sx={{ color: '#D252E4' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
    ],
  },
  {
    provider: 'Sarvam',
    models: [
      {
        id: 'SARVAM_M',
        name: 'Sarvam M',
        description: 'Advanced hybrid-reasoning model',
        icon: <BoltIcon sx={{ color: '#F39C12' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
    ],
  },
  {
    provider: 'Google',
    models: [
      {
        id: 'google/gemma-3-12b-it',
        name: 'Gemma 3 12B Instruct',
        description: 'Advanced reasoning model',
        icon: <AutoAwesomeIcon sx={{ color: '#8E44AD' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'google/gemma-3-27b-it',
        name: 'Gemma 3 27B Instruct',
        description: 'Efficient reasoning model',
        icon: <AutoAwesomeIcon sx={{ color: '#D252E4' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
    ],
  },
  {
    provider: 'Meta',
    models: [
      {
        id: 'LLAMA2',
        name: 'LLAMA2',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
        name: 'Llama 4 Maverick 17B 128E Instruct FP8',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: true, voice: true },
      },
      {
        id: 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
        name: 'Llama 4 Scout 17B 16E Instruct',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: true, voice: true },
      },
      {
        id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        name: 'Meta Llama 3.1 8B Instruct Turbo',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'eta-llama/Llama-3.2-3B-Instruct',
        name: 'Llama 3.2 3B Instruct',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        name: 'Llama 3.3 70B Instruct Turbo',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
        name: 'Meta Llama 3.1 70B Instruct Turbo',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'meta-llama/Llama-3.3-70B-Instruct',
        name: 'Llama 3.3 70B Instruct',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
        name: 'Meta Llama 3.1 70B Instruct',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
      {
        id: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
        name: 'Meta Llama 3.1 8B Instruct',
        description: 'Advanced reasoning model',
        icon: <HubIcon sx={{ color: '#3498DB' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
    ],
  },
  {
    provider: 'Qwen',
    models: [
      {
        id: 'Qwen/Qwen3-30B-A3B',
        name: 'Qwen3 30B A3B',
        description: 'Advanced hybrid-reasoning model',
        icon: <AllOutIcon sx={{ color: '#F39C12' }} />,
        capabilities: { reasoning: true, image: false, voice: true },
      },
    ],
  },
];

const orange = {
  200: "pink",
  400: "#EE6633",
  600: "#EE663366",
};

const grey = {
  50: "#F3F6F9",
  200: "#DAE2ED",
  300: "#C7D0DD",
  700: "#434D5B",
  900: "#1C2025",
};

const formatPrompt = (prompt) => {
  const lines = prompt.split('\n');
  const markdownString = lines.join('  \n');
  return markdownString;
}

function GuestChatPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedModel, setSelectedModel] = useState('GPT3.5');
  const [selectedLang, setSelectedLang] = useState("en");
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [enableImageUpload, setEnableImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [processedChatHistory, setProcessedChatHistory] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef(null);
  const [imageUploadStatus, setImageUploadStatus] = useState('idle');
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const navigate = useNavigate();
  const classes = headerStyle();
  const [isModelsModalOpen, setIsModelsModalOpen] = useState(false);
  const currentModel = useMemo(() => {
    for (const group of modelsData) {
      const found = group.models.find(m => m.id === selectedModel);
      if (found) {
        setEnableImageUpload(found?.capabilities.image);
        return found;
      }
    }
    return null;
  }, [selectedModel]);
  const userDetails = useSelector((state) => state.getLoggedInData.data);
  const getLoggedInUserData = () => {
    dispatch(FetchLoggedInUserData("me"));
  };

  useEffect(() => {
    getLoggedInUserData();
  }, []);

  const modelsMap = useMemo(() => {
    const map = {};
    modelsData.forEach(group => {
      group.models.forEach(model => {
        map[model.id] = model;
      });
    });
    return map;
  }, []);

  const ResponseCard = ({ modelName, content }) => {
    const model = modelsMap[modelName];
    return (
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 4,
          borderColor: '#e0e0e0',
          height: '100%',
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: '6px' }}>
          {model.icon}
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary">{model.name}</Typography>
        </Box>
        {content.map((res, resIndex) => (
          <>
            {res.type === "text" ?
              <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                <ReactMarkdown>{formatPrompt(res.value)}</ReactMarkdown>
              </Typography>
              : res.type === "code" ?
                <CodeBlock language={res.language} codeString={res.value} />
                :
                <Alert severity="error" variant="outlined" sx={{ mt: 1, borderColor: 'error.light' }}>
                  <AlertTitle sx={{ fontWeight: 'bold' }}>Request Failed</AlertTitle>
                  {res.value}
                </Alert>
            }
          </>
        ))}
      </Paper>
    )
  };

  useEffect(() => {
    const storedHistoryProcessed = JSON.parse(sessionStorage.getItem("interaction_json_processed"));
    if (storedHistoryProcessed && storedHistoryProcessed.length > 0) {
      setProcessedChatHistory(storedHistoryProcessed);
    }
    const storedHistory = JSON.parse(sessionStorage.getItem("interaction_json"));
    if (storedHistory && storedHistory.length > 0) {
      setChatHistory(storedHistory);
    }
  }, []);

  useEffect(() => {
    if (processedChatHistory.length > 0) {
      sessionStorage.setItem("interaction_json_processed", JSON.stringify(processedChatHistory));
    }
    if (chatHistory.length > 0) {
      sessionStorage.setItem("interaction_json", JSON.stringify(chatHistory));
    }
  }, [processedChatHistory, chatHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [processedChatHistory]);

  const uploadImageAndGetUrl = async (imageFile) => {
    if (!imageFile) return null;
    setImageUploadStatus('loading');

    const formData = new FormData();
    formData.append('image', imageFile, imageFile.name);

    try {
      const response = await fetch(`${config.BASE_URL_AUTO}${ENDPOINTS.functions}upload_chat_image`,
        {
          method: 'POST',
          body: formData,
          headers: {
            "Authorization": `JWT ${localStorage.getItem("anudesh_access_token")}`
          },
        });
      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      setImageUploadStatus('idle');
      return result.image_url;
    } catch (err) {
      console.error('Failed to upload image:', err);
      setImageUploadStatus('error');
      return null;
    }
  };

  const getImageAsBase64 = async (imageFile) => {
    if (!imageFile) return null;
    setImageUploadStatus('loading');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        setImageUploadStatus('idle');
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        console.error('Failed to convert image to base64:', error);
        setImageUploadStatus('error');
        reject(null);
      };

      reader.readAsDataURL(imageFile);
    });
  };


  const handleImageUpload = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const imgFile = event.target.files[0];
      setUploadedImage(imgFile);
      setImageUploadStatus('idle');
      // const image_url = await uploadImageAndGetUrl(event.target.files[0]);
      const image_url = await getImageAsBase64(imgFile);
      setUploadedImageUrl(image_url);
      console.log("Image uploaded:", imgFile.name);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedImageUrl(null);
    setImageUploadStatus('idle');
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

  const formatResponse = (response) => {
    response = String(response);
    const output = [];
    let count = 0;

    while (response) {
      response = response.trim();
      let index = response.indexOf("```");
      if (index == -1) {
        output.push({
          type: "text",
          value: response,
        });
        break;
      } else {
        count++;
        if (count % 2 !== 0) {
          output.push({
            type: "text",
            value: response.substring(0, index),
          });
          response = response.slice(index + 3);
        } else if (count % 2 === 0) {
          let next_space = response.indexOf("\n");
          let language = response.substring(0, next_space);
          response = response.slice(next_space + 1);
          let new_index = response.indexOf("```");
          let value = response.substring(0, new_index);
          output.push({
            type: "code",
            value: value,
            language: language,
          });
          response = response.slice(new_index + 3);
        }
      }
    }
    return output;
  };

  function createMessageObject(userPrompt, imageUrl) {
    if (!imageUrl) {
      return [
        { type: "text", text: userPrompt }
      ];
    } else {
      return [
        { type: "text", text: userPrompt },
        { type: "image_url", image_url: { url: imageUrl } }
      ];
    }
  }

  const getBrowserData = () => {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
    };
  };

  const handleButtonClick = async () => {
    event.preventDefault();
    if (inputValue) {
      const message = createMessageObject(inputValue, uploadedImageUrl);
      const userMessage = { role: 'user', content: message };
      setProcessedChatHistory(prev => [...prev, userMessage]);
      setInputValue("");
      handleRemoveImage();
      setLoading(true);
      const body = {
        message: message,
        model: selectedModel,
        history: chatHistory,
      };
      const ChatInteractionObj = new PostChatInteractionAPI(body);
      const interactionRes = await fetch(ChatInteractionObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(ChatInteractionObj.getBody()),
        headers: ChatInteractionObj.getHeaders().headers,
      });
      if (!interactionRes.ok) {
        const responses = [
          {
            modelName: selectedModel, content: [{
              type: "error",
              value: "The model failed to generate a response. Please try again.",
            }]
          },
        ];
        const aiMessage = { role: 'assistant', content: responses };
        setProcessedChatHistory(prev => [...prev, aiMessage]);
        setLoading(false);
      }
      const interactionData = await interactionRes.json();
      if (interactionData) {
        const formattedResponse = formatResponse(interactionData.message);
        const newEntry = {
          prompt: message[0].text,
          output: interactionData.message,
        };
        const updatedChatHistory = [...chatHistory, newEntry];
        setChatHistory(updatedChatHistory);
        const responses = [
          { modelName: interactionData.model, content: formattedResponse },
        ];
        const aiMessage = { role: 'assistant', content: responses };
        setProcessedChatHistory(prev => [...prev, aiMessage]);
        setLoading(false);
        let user_data = {};
        if (localStorage.getItem('cookies_user_consent') === "true") {
          user_data = getBrowserData();
        }
        const chatLogBody = {
          interaction_json: updatedChatHistory,
          user_data: user_data,
        };
        const ChatLogObj = new PostChatLogAPI(chatLogBody);
        const logRes = await fetch(ChatLogObj.apiEndPoint(), {
          method: "POST",
          body: JSON.stringify(ChatLogObj.getBody()),
          headers: ChatLogObj.getHeaders().headers,
        });
        const logData = await logRes.json();
      }
    } else {
      alert("Please provide a prompt.");
    }
  };

  const unifiedSelectorStyle = {
    fontSize: '0.8rem',
    fontWeight: theme.typography.fontWeightRegular,
    color: 'text.secondary',
    textTransform: 'none',
    borderRadius: '8px',
    p: '4px 8px',
    ml: 1,
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    },
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      if (inputValue) {
        event.preventDefault();
        handleButtonClick();
      }
    }
  };

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      handleUserMenuClose();
      sessionStorage.removeItem("interaction_json_processed");
      sessionStorage.removeItem("interaction_json");
      if (typeof window !== "undefined") {
        localStorage.removeItem("anudesh_access_token");
        localStorage.removeItem("anudesh_refresh_token");
        localStorage.removeItem("email_id");
        localStorage.removeItem("isLoggedIn");
      }
      await signOut(auth);
      setUser(null);
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    if (document.readyState !== "loading") {
      if (typeof window !== "undefined") {
        if (localStorage.getItem("anudesh_access_token") === null || localStorage.getItem("anudesh_access_token") === undefined) {
          handleSignOut();
        }
      }
    }
  }, []);

  useEffect(() => {
    if(userDetails?.username){
      setUser(userDetails);
    }else{
      setUser(null);
    }
    setAuthLoading(false);
  }, [userDetails]);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (currentUser) => {
  //       setUser(currentUser);
  //       setAuthLoading(false);
  //       // getLoggedInUserData();
  //   });
  // }, [])

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const resetChat = () => {
    setProcessedChatHistory([]);
    setChatHistory([]);
    handleUserMenuClose();
  };

  return (
    <ThemeProvider theme={lightTheme}>
      {renderSnackBar()}
      <CssBaseline />
      <LoginModal open={!user} />
      <ConsentBanner />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundImage: `url("https://i.postimg.cc/76Mw8q8t/chat-bg.webp")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Box sx={{ py: 1, bgcolor: 'white', display: 'flex', justifyContent: 'space-between', px: '4%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4%', cursor:'pointer' }} onClick={() => {navigate("/")}} >
            <Image
              width={50}
              height={50}
              src="https://i.postimg.cc/nz91fDCL/undefined-Imgur.webp"
              priority
            />
            <Typography variant="h5" className={classes.headerTitle}>
              Anudesh
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" noWrap className={classes.headerTitle} style={{ flexGrow: 1, minWidth: 0 }}>
              {user && user.username.split(" ", 2).join(" ")}
            </Typography>
            <IconButton onClick={handleUserMenuOpen} size="small" sx={{ ml: 1 }}>
              <Avatar
                sx={{ width: 45, height: 45, bgcolor: 'primary.main' }}
                src={user && user.photoURL}
                alt={user && user.username}
              >
                {user && user.username ? user && user.username[0] : <PersonIcon />}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleUserMenuClose}
              MenuListProps={{
                'aria-labelledby': 'user-menu-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{ mt: 1 }}
            >
              <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1 } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">{user && user.email}</Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={() => navigate("/edit-profile")}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Edit Profile
              </MenuItem>
              <MenuItem onClick={resetChat}>
                <ListItemIcon>
                  <RestoreIcon fontSize="small" />
                </ListItemIcon>
                Reset Chat
              </MenuItem>
              <MenuItem onClick={async () => {await handleSignOut(); navigate('/');}}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </div>
        </Box>
        
         <Box sx={{ px: '4%', py: 1 }}>
           <BackButton
             startIcon={<ArrowBackIcon />}
             sx={{ 
               color: "white", 
               m: {xs:1,md:1,lg:2,xl:2},
               borderRadius: '18px',
               textTransform: 'none'
             }}
             label={translate("label.backToPreviousPage")}
           />
         </Box>
        
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {processedChatHistory.length === 0 ? (
            <AnudeshInfo />
          ) : (
            <>
              {processedChatHistory.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  {message.role === 'assistant' && (
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                      <AutoAwesomeIcon fontSize='small' />
                    </Avatar>
                  )}

                  <Box sx={{ maxWidth: message.role === 'user' ? '70%' : '93.7%' }}>
                    {message.role === 'user' ? (
                      <Paper elevation={0} sx={{ p: '12px 16px', borderRadius: '18px', bgcolor: 'rgba(255, 107, 107, 0.1)' }}>
                        {message.content.length == 2 && <img height={140} width={140} src={message.content[1].image_url.url} />}
                        <Typography variant="body1" color="text.primary">{message.content[0].text}</Typography>
                      </Paper>
                    ) : (
                      <Grid container spacing={2}>
                        {message.content.map((res, resIndex) => (
                          <Grid item xs={12} md={12 / message?.content[0]?.value?.length} key={resIndex}>
                            <ResponseCard modelName={res.modelName} content={res.content} />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>

                  {message.role === 'user' && (
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }} alt={user && user.username} src={user && user.photoURL}>
                      {user && user.username ? user && user.username[0] : <PersonIcon />}
                    </Avatar>
                  )}
                </Box>
              ))}
            </>
          )}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                <AutoAwesomeIcon fontSize='small' />
              </Avatar>
              <CircularProgress size={24} />
            </Box>
          )}
          <div ref={chatEndRef} />
        </Box>

        <Box sx={{ p: 1 }}>
          <Paper
            elevation={2}
            sx={{
              p: '4px 8px',
              paddingTop: '12px',
              alignItems: 'center',
              borderRadius: '18px',
              border: `1px solid ${lightTheme.palette.primary.main}`,
              width: '100%',
              maxWidth: '1200px',
              mx: 'auto',
              transition: 'box-shadow 0.3s',
              boxShadow: `0 0 12px 1px rgba(255, 107, 107, 0.35)`,
              '&:focus-within': {
                boxShadow: `0 0 12px 2px rgba(255, 107, 107, 0.6)`,
              },
            }}
          >
            {uploadedImage && (
              <Box sx={{ p: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <ImagePreview
                  file={uploadedImage}
                  onRemove={handleRemoveImage}
                  status={imageUploadStatus}
                />
              </Box>
            )}
            <IndicTransliterate
              key={`indic-${selectedLang || 'default'}-${showLanguageSelect}`}
              customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
              enableASR={showLanguageSelect ? true : false}
              asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
              apiKey={`JWT ${localStorage.getItem("anudesh_access_token")}`}
              renderComponent={(props) => (
                <textarea
                  onInput={(e) => {
                    const textarea = e.target;
                    textarea.style.height = 'auto';
                    const scrollHeight = textarea.scrollHeight;
                    const maxHeight = showLanguageSelect ? 120 : 96;
                    if (scrollHeight <= maxHeight) {
                      textarea.style.height = `${scrollHeight}px`;
                      textarea.style.overflowY = 'hidden';
                    } else {
                      textarea.style.height = `${maxHeight}px`;
                      textarea.style.overflowY = 'auto';
                    }
                    if (props.onInput) props.onInput(e);
                  }}
                  rows={1}
                  maxRows={4}
                  placeholder={translate("chat_placeholder")}
                  {...props}
                />
              )}
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
              }}
              onKeyDown={handleKeyDown}
              lang={selectedLang}
              style={{
                flex: 1,
                width: "100%",
                outline: 'none',
                maxHeight: showLanguageSelect ? '120px' : '96px',
                minHeight: showLanguageSelect ? '30px' : '24px',
                display: 'flex',
                lineHeight: '1.5',
                resize: 'none',
                padding: theme.spacing(0, 1),
                fontSize: '1rem',
                fontFamily: 'inherit',
                color: 'inherit',
                background: 'transparent',
                border: 'none',
              }}
              horizontalView={true}
              enabled={selectedLang !== null ? selectedLang === "en" ? false : showLanguageSelect === false ? false : true : true}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Button
                  variant="text"
                  onClick={() => setIsModelsModalOpen(true)}
                  startIcon={currentModel?.icon}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={unifiedSelectorStyle}
                >
                  {currentModel?.name || 'Select Model'}
                </Button>
                {showLanguageSelect && (
                  <Select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    IconComponent={KeyboardArrowDownIcon}
                    variant="standard"
                    disableUnderline
                    sx={unifiedSelectorStyle}
                  >
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
                )}
              </div>
              <div>
                <Tooltip title="Transliteration" >
                  <IconButton
                    onClick={() => setShowLanguageSelect(prev => !prev)}
                    sx={{ color: showLanguageSelect ? 'primary.main' : 'text.secondary' }}
                  >
                    <TranslateIcon />
                  </IconButton>
                </Tooltip>
                {enableImageUpload &&
                  <Tooltip title="Upload Image" >
                    <IconButton component="label" sx={{ color: 'text.secondary' }}>
                      <ImageOutlinedIcon />
                      <input type="file" accept="image/*" hidden onChange={handleImageUpload} ref={fileInputRef} />
                    </IconButton>
                  </Tooltip>
                }
                {/* <IconButton sx={{ color: 'text.secondary' }}>
                  <MicNoneOutlinedIcon />
                </IconButton> */}
                <IconButton type="submit" color="primary" disabled={!inputValue.trim() || loading} onClick={handleButtonClick}>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </Paper>
        </Box>
      </Box>
      <ModelSelectorDialog
        open={isModelsModalOpen}
        onClose={() => setIsModelsModalOpen(false)}
        modelsData={modelsData}
        selectedValue={selectedModel}
        onValueChange={setSelectedModel}
      />
    </ThemeProvider>
  );
}

export default GuestChatPage;