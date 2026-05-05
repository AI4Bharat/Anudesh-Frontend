import  InputBase from "@mui/material/InputBase";
import  Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import themeDefault from "../../themes/theme";
import "../../styles/Dataset.css";
import { useDispatch, useSelector } from "react-redux";
import { setSearchProjectCard } from "@/Lib/Features/searchProjectCard";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import configs from "@/config/config";
import { useTheme } from "@/context/ThemeContext";

const Search = (props) => {
  const ref = useRef(null);
  /* eslint-disable react-hooks/exhaustive-deps */

  const dispatch = useDispatch();

  const SearchProject = useSelector(
    (state) => state.searchProjectCard?.searchValue,
  );
  const [searchValue, setSearchValue] = useState("");

  // useEffect(() => {
  //   if (ref) ref.current.focus();
  // }, [ref]);

  useEffect(() => {
    dispatch(setSearchProjectCard(""));
  }, []);

  const handleChangeName = (value) => {
    setSearchValue(value);
    dispatch(setSearchProjectCard(value));
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
    console.log(
      globalTransliteration,
      localStorage.getItem("globalTransliteration"),
    );
  }, [searchValue]);

  const { dark } = useTheme();
  const muiTheme = useMuiTheme(); 
  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <Grid className="search"
  sx={{
    backgroundColor: dark ? "#2a2a2a" : "",
    borderRadius: dark ? "16px" : "",
  }}>
        <Grid
          className="searchIcon"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: dark ? "#a0a0a0" : "" }} />
        </Grid>
        {globalTransliteration == "true" ? (
          <IndicTransliterate
            customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
            // enableASR={true}
            // asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
            apiKey={`JWT ${localStorage.getItem("anudesh_access_token")}`}
            renderComponent={(props) => (
              <textarea
                placeholder="Search here"
                {...props}
                style={{
                  background: "transparent",
                  color: dark ? "#ffffff" : "",
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
            style={{
              background: dark ? "#2a2a2a" : "#F0F0F0",
              color: dark ? "#ffffff" : "",
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
              ...(dark && {
              color: "#ffffff",
              "& input::placeholder": {
                color: "#a0a0a0",
                opacity: 1,
              },
    }),
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
