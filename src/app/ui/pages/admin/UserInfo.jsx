import Grid from "@mui/material/Grid";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
  import React from "react";
  import { useState } from "react";
  import EditProfile from "../../../../components/admin/EditProfile";
  
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={2}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  const UserInfo = (props) => {
     /* eslint-disable react-hooks/exhaustive-deps */

    const {
      openDialog,
      handleCloseDialog,
      submit,
      Email,
      FirstName,
      LastName,
      Language,
      ParticipationType,
      Role,
      setRole,
      setUserName,
      userName,
      setActive,
      active,
      setFirstName,
      setLastName,
      setLanguage,
      setParticipationType,
      guest_user,
      setguest_user,
      organization,
      setorganization
    } = props;
    const [tabValue, setTabValue] = useState(0);
  
    const handleTabChange = (e, v) => {
      setTabValue(v);
    };
  
    return (
      <>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid>
                {/* <Grid>{renderSnackBar()}</Grid> */}
                <Box sx={{ mb: 2 }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="user-tabs"
                  >
                    <Tab
                      label="Profile"
                      sx={{
                        fontSize: 17,
                        fontWeight: "700",
                        marginRight: "28px !important",
                      }}
                    />
                  </Tabs>
                </Box>
                <Box sx={{ p: 1 }}>
                  <TabPanel value={tabValue} index={0}>
                    <EditProfile
                      handleCloseDialog={handleCloseDialog}
                      setRole={setRole}
                      submit={submit}
                      Email={Email}
                      FirstName={FirstName}
                      setFirstName={setFirstName}
                      LastName={LastName}
                      userName = {userName}
                      setUserName={setUserName}
                      active={active}
                      setActive={setActive}
                      setLastName={setLastName}
                      Language={Language}
                      setLanguage={setLanguage}
                      ParticipationType={ParticipationType}
                      Role={Role}
                      setParticipationType={setParticipationType}
                      guest_user={guest_user}
                      setguest_user={setguest_user}
                      organization={organization}
                      setorganization={setorganization}
                    />
                  </TabPanel>
                </Box>
              </Grid>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  export default UserInfo;
 