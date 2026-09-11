import  InputBase from "@mui/material/InputBase";
import  Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import themeDefault from "../../themes/theme";
import "../../styles/Dataset.css";
import { useDispatch, useSelector } from "react-redux";
import { setSearchProjectCard } from "@/Lib/Features/searchProjectCard";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import configs from "@/config/config";

const Search = (props) => {
  const ref = useRef(null);
  /* eslint-disable react-hooks/exhaustive-deps */

   const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const SearchProject = useSelector(
    (state) => state.searchProjectCard?.searchValue,
  );
       const [searchValue, setSearchValue] = useState(() => {
    const savedMap = JSON.parse(localStorage.getItem("projectSearchState") || "{}");
    return savedMap[currentPath] || "";
  });

    // useEffect(() => {
  //   if (ref) ref.current.focus();
  // }, [ref]);

   useEffect(() => {
    const savedMap = JSON.parse(localStorage.getItem("projectSearchState") || "{}");
    const valueForThisPath = savedMap[currentPath] || "";
    setSearchValue(valueForThisPath);
    dispatch(setSearchProjectCard(valueForThisPath));
  }, [currentPath]);

  const debounceTimer = useRef(null);
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

      const handleChangeName = (value) => {
    setSearchValue(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const trimmedValue = value.trim();
      if (trimmedValue !== SearchProject) {
        dispatch(setSearchProjectCard(trimmedValue));
      }
          const savedMap = JSON.parse(localStorage.getItem("projectSearchState") || "{}");
      savedMap[currentPath] = trimmedValue;
      localStorage.setItem("projectSearchState", JSON.stringify(savedMap));
    }, 300);
  };
        const handleClearSearch = () => {
    setSearchValue("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    dispatch(setSearchProjectCard(""));
    const savedMap = JSON.parse(localStorage.getItem("projectSearchState") || "{}");
    savedMap[currentPath] = "";
    localStorage.setItem("projectSearchState", JSON.stringify(savedMap));
  };

  const [targetLang, setTargetLang] = useState(
    localStorage.getItem("language"),
  );

  const [globalTransliteration, setGlobalTransliteration] = useState(
    localStorage.getItem("globalTransliteration"),
  );
    useEffect(() => {
    const storedGlobalTransliteration = localStorage.getItem(
      "globalTransliteration",
    );
    const storedLanguage = localStorage.getItem("language");
    setGlobalTransliteration(storedGlobalTransliteration);
    setTargetLang(storedLanguage);
  }, []);

  const theme = useTheme();
  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <Grid className="search">
        <Grid
          className="searchIcon"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SearchIcon fontSize="small" />
        </Grid>
        {globalTransliteration == "true" ? (
          <IndicTransliterate
            customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
            // enableASR={true}
            // asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
            apiKey={`JWT ${localStorage.getItem("anudesh_access_token")}`}
                      renderComponent={(props) => (
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <textarea
                  placeholder="Search here"
                  {...props}
                  style={{
                    background: "transparent",
                    borderRadius: "1px",
                    padding: "2px",
                    height: "24px",
                    width: "100%",
                    resize: "none",
                    marginTop: "2%",
                    border: "none",
                    outline: "none",
                    overflow: "hidden",
                  }}
                />
                                {searchValue && (
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    aria-label="clear search"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            )}
            value={searchValue}
            onChangeText={(text) => {
              handleChangeName(text);
            }}
            lang={targetLang}
            style={{
              background: "#F0F0F0",
              borderRadius: "16px",
              padding: "2px",
              height: "24px",
              width: "100%",

              resize: "none",
            }}
          />
              ) : (
          <InputBase
            sx={{
              fontSize: "20px",
            }}
            placeholder="Search here"
            value={searchValue}
            onChange={(e) => handleChangeName(e.target.value)}
            inputProps={{ "aria-label": "search" }}
                        endAdornment={
              searchValue ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    aria-label="clear search"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null
            }
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Search;
