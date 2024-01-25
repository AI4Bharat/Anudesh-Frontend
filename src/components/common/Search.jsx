import { InputBase,ThemeProvider,Grid } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef, useState } from "react";
import themeDefault from '../../themes/theme'
 import  "../../styles/Dataset.css";
 import { useDispatch, useSelector } from "react-redux";
import { setSearchProjectCard } from "@/Lib/Features/searchProjectCard";

const Search = (props) => {
  const ref = useRef(null);
         /* eslint-disable react-hooks/exhaustive-deps */

  
  const dispatch = useDispatch();
  
  const SearchProject = useSelector((state) => state.searchProjectCard?.data);
  const [searchValue, setSearchValue] = useState("");


  useEffect(() => {
    if (ref) ref.current.focus();
  }, [ref]);

  useEffect(() => {
    dispatch(setSearchProjectCard(""));
}, [])

  const handleChangeName = (value) => {
    setSearchValue(value);
    dispatch(setSearchProjectCard(value));
  };
 

  return (
   <Grid container justifyContent="end" sx={{marginTop:"20px"}}>
                <Grid   className="search">
                    <Grid className="searchIcon">
                        <SearchIcon fontSize="small" />
                    </Grid>
                    <InputBase
                        sx={{ ml: 4 }}
                        inputRef={ref}
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => handleChangeName(e.target.value)}
                         
                        inputProps={{ "aria-label": "search" }}
                        
                    />
                </Grid>
                </Grid>
          
  );
};

export default Search;