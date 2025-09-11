import React from 'react';
import { Box, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImagePreview = ({ file, onRemove, status = 'idle' }) => {
  const imageUrl = React.useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: 80,
        height: 80,
        borderRadius: 2,
        overflow: 'hidden',
        flexShrink: 0,
        '& > img': {
          filter:
            status === 'loading' ? 'blur(3px)' :
            status === 'error' ? 'blur(3px) grayscale(50%)' : 'none',
          transition: 'filter 0.3s ease-in-out',
        },
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt="Image preview"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            status === 'loading' ? 'rgba(0, 0, 0, 0.3)' :
            status === 'error' ? 'rgba(211, 47, 47, 0.4)' : 'transparent',
          transition: 'background-color 0.3s ease-in-out',
        }}
      >
        {status === 'loading' && <CircularProgress size={24} color="inherit" sx={{ color: 'white' }} />}
      </Box>

      {status !== 'loading' && (
        <IconButton
          size="small"
          onClick={onRemove}
          aria-label="remove image"
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default ImagePreview;