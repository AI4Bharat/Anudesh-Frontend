'use client';
import { useState } from 'react';
import { bookmarkProject, unbookmarkProject } from '@/Lib/Features/projects/bookmarkService';
import { IconButton, CircularProgress, Tooltip } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const BookmarkButton = ({ project, onBookmarkChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(project.is_bookmarked || false);

  const handleBookmarkToggle = async () => {
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await unbookmarkProject(project.id);
        setIsBookmarked(false);
        onBookmarkChange?.(project.id, false);
      } else {
        await bookmarkProject(project.id);
        setIsBookmarked(true);
        onBookmarkChange?.(project.id, true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('Failed to update bookmark. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
      <span>
        <IconButton
          onClick={handleBookmarkToggle}
          disabled={isLoading}
          sx={{
            color: isBookmarked ? 'warning.main' : 'action.disabled',
            '&:hover': {
              color: isBookmarked ? 'warning.dark' : 'primary.main',
            },
            transition: 'color 0.3s ease',
          }}
        >
          {isLoading ? (
            <CircularProgress size={22} thickness={6} />
          ) : isBookmarked ? (
            <StarIcon fontSize="medium" />
          ) : (
            <StarBorderIcon fontSize="medium" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default BookmarkButton;
