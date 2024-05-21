import { InputBase,ThemeProvider,Grid } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef, useState } from "react";
import themeDefault from '../../themes/theme'
 import  "../../styles/Dataset.css";
 import { useDispatch, useSelector } from "react-redux";
import { setSearchProjectCard } from "@/Lib/Features/searchProjectCard";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";


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

  const targetLang = localStorage.getItem("language") || "en";
  const globalTransliteration = localStorage.getItem("globalTransliteration") === "true" ? true : false;

  return (
   <Grid container justifyContent="end" sx={{marginTop:"20px"}}>
                <Grid   className="search">
                    <Grid className="searchIcon">
                        <SearchIcon fontSize="small" />
                    </Grid>
                    {globalTransliteration ? 
                    <IndicTransliterate 
                    renderComponent={(props) => (
                      <textarea
                      
                      placeholder="Search..."
                      {...props}
                      style={{background:"#F0F0F0", borderRadius:"16px", padding:"2px", height:"24px", width:"90%", marginLeft:"10%", resize:"none", marginTop:"2%", border: "none", outline: "none", overflow: "hidden"}}
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
                    /> : 
                    <InputBase
                        sx={{ ml: 4 }}
                        // inputRef={ref}
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => handleChangeName(e.target.value)}
                        inputProps={{ "aria-label": "search" }}
                    />}
                </Grid>
                </Grid>
          
  );
};

export default Search;