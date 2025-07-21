"use client"
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import CustomButton from "@/components/common/Button";
import OutlinedTextField from "@/components/common/OutlinedTextField";
import { translate } from "@/config/localisation";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import getDomains from "../../../actions/api/Annotate/getDomain";
import { setDomain } from "@/Lib/Features/actions/AddGlossary";

import CustomizedSnackbars from "@/components/common/Snackbar";
import { MenuProps } from "@/utils/utils";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import configs from "@/config/config";
import { languages } from "@/components/Transliteration/languages";

const SuggestAnEdit = ({
    openDialog,
    handleCloseDialog,
    addBtnClickHandler,
    sourceText,
    targetText,
    settargetText,
    domainValue,
    setDomainValue,
    data,
    targetlang
  }) => {
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    /* eslint-disable react-hooks/exhaustive-deps */

  const [Targetlanguage] = languages;
    const [snackbar, setSnackbarInfo] = useState({
      open: false,
      message: "",
      variant: "success",
    });
  
    const allDomains = useSelector((state) => state.getDomains);
  
    useEffect(() => {
      const domainApiObj = new getDomains();
      dispatch(setDomain(domainApiObj));
    }, []);
  
  
    const handleTargetTextChange = (e) => {
      settargetText(e.target.value);
    };
    const handleDomainChange = (e) => {
      setDomainValue(e.target.value);
    };
  
    var targetData = Targetlanguage?.filter((e)=>e.LangCode.includes(targetlang))
  
    const renderTargetText = (props) => {
      return (
        <div>
          <textarea
            {...props}
            placeholder={"Target Text"}
            rows={2}
            className={classes.textTransliteration}
          />
        </div>
      );
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
    return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid>
              <Grid>{renderSnackBar()}</Grid>
              <Card className={classes.SuggestAnEditCard}>
                <Typography
                  variant="h4"
                  gutterBottom
                  align="center"
                  sx={{ mb: 3 }}
                >
                  Suggest An Edit
                </Typography>
                <Typography
                  variant="body2"
                 // gutterBottom
                
                  sx={{ mb: 3 }}
                >
                  Note:- Source Text ({data.input_language}) , Target Text ({data.output_language})
                </Typography>
                <Grid
                  container
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center"
                 
                >
                  <OutlinedTextField
                    label="Source Text"
                    placeholder="Source Text"
                    sx={{  m: 1, width: 200 ,input: { color: 'rgba(0, 0, 0, 0.6)' } }}
                    value={sourceText}
                  />
  
                  { targetData.length > 0 && targetlang !== "en" ? (
                   <IndicTransliterate
                    customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                    // enableASR={true}
                    // asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
                    apiKey={`JWT ${localStorage.getItem('anudesh_access_token')}`}
                    lang={Targetlanguage.LangCode ? Targetlanguage.LangCode : (targetData.length > 0  ?  targetData[0]?.LangCode : "en" )}
                    value={targetText}
                    onChangeText={(targetText) => {
                      settargetText(targetText);
                    }}
                    renderComponent={(props) => renderTargetText(props)}
                  />): (
                   <OutlinedTextField
  
                    label="Target Text"
                    placeholder="Target Text"
                    sx={{ m: 1, width: 200 }}
                    value={targetText}
                    onChange={handleTargetTextChange}
                  />)}
  
                </Grid>
                <Grid
                  container
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center"
                  sx={{
                    mt: 4,
                  }}
                >
                  <FormControl sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Domain
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={domainValue}
                      label="Domain"
                      onChange={handleDomainChange}
                      sx={{
                        textAlign: "left",
                      }}
                      MenuProps={MenuProps}
                    >
                      {allDomains &&
                        allDomains.length > 0 &&
                        allDomains.map((el, i) => {
                          return <MenuItem key ={i} value={el.code}>{el.label}</MenuItem>;
                        })}
                    </Select>
                  </FormControl>
                  <Grid sx={{ m: 1, minWidth: 200 }}></Grid>
                </Grid>
  
                <Grid sx={{ textAlignLast: "end" }}>
                  <CustomButton
                    label={translate("button.submit")}
                    onClick={() => addBtnClickHandler()}
                    //disabled={SourceText && targetText && domain ? false : true}
                    sx={{
                      borderRadius: 2,
                      textDecoration: "none",
                    }}
                  />
                  <CustomButton
                    label={translate("button.cancel")}
                    onClick={handleCloseDialog}
                    sx={{
                      ml: 1,
                      borderRadius: 2,
                      textDecoration: "none",
                    }}
                  />
                </Grid>
              </Card>
            </Grid>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  };
  export default SuggestAnEdit;
  