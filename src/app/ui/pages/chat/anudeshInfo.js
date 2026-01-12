import React from 'react';
import { Box, Grid, Typography, Container, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles'; 

const LOGO_URL = 'https://i.imgur.com/56Ut9oz.png';

const infoCards = [
  {
    title: 'What is Anudesh?',
    description: 'Anudesh is an open-source platform dedicated to advancing the development of state-of-the-art Large language models for Indian languages.'
  },
  {
    title: 'How Can You Help?',
    description: 'You can help us collect data based on instructional prompts, rate the performance of models, evaluate model responses, and analyse data using various metrics.'
  },
  {
    title: 'Why Should You Contribute?',
    description: 'By contributing to Anudesh, you can play a vital role in enhancing language understanding and generation capabilities in Indian languages.'
  }
];


const AnudeshInfo = () => {
  const theme = useTheme();

  const cardBackgroundColor = alpha(theme.palette.primary.main, 0.08);

  return (
    <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          p: 3,
          borderRadius: 4,
          backgroundColor: cardBackgroundColor,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Box
          component="img"
          src={LOGO_URL}
          alt="Anudesh Logo"
          sx={{
            width: 80,
            height: 80,
            flexShrink: 0,
          }}
        />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
            Namaste
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mt: 0.5 }}>
            Welcome to Anudesh
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            This page allows users to engage with the model freely, capturing interactions efficiently in an ordered tree format.
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {infoCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: cardBackgroundColor,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                height: '100%',
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.primary.main, mb: 1.5 }}>
                {card.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign='justify'>
                {card.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AnudeshInfo;