import { InputBase,ThemeProvider,Grid } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import themeDefault from '../../themes/theme'
 import  "../../styles/Dataset.css";
 import { useDispatch, useSelector } from "react-redux";
import { setSearchProjectCard } from "@/Lib/Features/searchProjectCard";
import { IndicTransliterate } from "@/libs/dist";
import configs from "@/config/config";

const Search = (props) => {
  const ref = useRef(null);
         /* eslint-disable react-hooks/exhaustive-deps */

  
  const dispatch = useDispatch();
  
  const SearchProject = useSelector((state) => state.searchProjectCard?.searchValue);
  const [searchValue, setSearchValue] = useState("");

  // useEffect(() => {
  //   if (ref) ref.current.focus();
  // }, [ref]);

  useEffect(() => {
    dispatch(setSearchProjectCard(""));
}, [])

  const handleChangeName = (value) => {
    setSearchValue(value);
    dispatch(setSearchProjectCard(value));
  };

  const [targetLang, setTargetLang] = useState( localStorage.getItem("language"));

  const [globalTransliteration, setGlobalTransliteration] = useState(localStorage.getItem("globalTransliteration"));
  useEffect(() => {
    const storedGlobalTransliteration = localStorage.getItem("globalTransliteration");
    const storedLanguage = localStorage.getItem("language") ;
    setGlobalTransliteration(storedGlobalTransliteration);
    setTargetLang(storedLanguage);
    console.log(globalTransliteration,localStorage.getItem("globalTransliteration"));
  }, [searchValue]);

  const theme = useTheme();
  return (
   <Grid container justifyContent={{xs:"start",md:"end"}} sx={{marginTop:"20px",width:"100%"}}>
                <Grid   className="search">
                    <Grid className="searchIcon">
                        <SearchIcon fontSize="small" />
                    </Grid>
                    {globalTransliteration=="true" ? 
                    <IndicTransliterate 
                    customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                    apiKey={`JWT ${localStorage.getItem('anudesh_access_token')}`}
                    renderComponent={(props) => (
                      <textarea
                      
                      placeholder="Search here"
                      {...props}
                      style={{background: "transparent", borderRadius:"16px", padding:"2px", height:"24px", width:"90%", marginLeft:"10%", resize:"none", marginTop:"2%", border: "none", outline: "none", overflow: "hidden"}}
                      />

                    //   <InputBase
                    //   sx={{ ml: 4 }}
                    //   placeholder="Search..."
                    //   {...props}
                    // />
                    )}
                    value={searchValue}
                    onChangeText={(text) => {
                      handleChangeName(text);
                    }}
                    lang={targetLang}
                    style={{background:"#F0F0F0", borderRadius:"16px", padding:"2px", height:"24px", width:"90%", marginLeft:"10%", resize:"none", marginTop:"2%"}}
                    /> : (
                      <InputBase
                      sx={{
                        ml: 4,
                        width: "120px",
                      }}
                      placeholder="Search here"
                      value={searchValue}
                      onChange={(e) => handleChangeName(e.target.value)}
                      inputProps={{ "aria-label": "search" }}
                    />
                    )}
                </Grid>
                </Grid>
          
  );
};

export default Search;