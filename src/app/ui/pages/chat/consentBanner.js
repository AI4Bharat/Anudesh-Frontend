import React, { useState } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

const ConsentBanner = () => {
  const initialConsent = localStorage.getItem('cookies_user_consent');
  const [showBanner, setShowBanner] = useState(!initialConsent);

  const handleConsent = (consentChoice) => {
    localStorage.setItem('cookies_user_consent', consentChoice);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '90%', md: 'auto' },
        maxWidth: '800px',
        p: 2,
        zIndex: 10,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" fontWeight="bold">We value your privacy</Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          We use cookies and collect browser data to improve our service and analyze traffic. By clicking "Accept", you agree to our use of this data.
          {/* <a href="/privacy-policy" style={{ marginLeft: '8px' }}>Learn More</a> */}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
        <Button variant="outlined" onClick={() => handleConsent(false)}>
          Decline
        </Button>
        <Button variant="contained" onClick={() => handleConsent(true)}>
          Accept
        </Button>
      </Box>
    </Paper>
  );
};

export default ConsentBanner;