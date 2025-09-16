import React from 'react';
import { useState } from 'react';
import { Box, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism'; 
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const CodeBlock = ({ language, codeString }) => {
  const theme = useTheme();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        my: 2,
        backgroundColor: '#f7f8fa',
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 2, 
          py: 0.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {language || 'code'}
        </Typography>
        <IconButton 
          onClick={handleCopy} 
          size="small" 
          sx={{ color: isCopied ? 'success.main' : 'text.secondary' }}
        >
          {isCopied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Box>

      <SyntaxHighlighter
        language={language}
        style={vs}
        customStyle={{
          margin: 0,
          padding: theme.spacing(2),
          backgroundColor: '#ffffff',
        }}
        codeTagProps={{
          style: {
            fontFamily: '"Fira Code", "monospace"',
            fontSize: '0.875rem',
          }
        }}
      >
        {String(codeString).replace(/\n$/, '')} 
      </SyntaxHighlighter>
    </Paper>
  );
};

export default CodeBlock;