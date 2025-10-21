'use client';
import { useEffect, useState } from 'react';
import { bookmarkProject, unbookmarkProject, getUserProjects } from '@/Lib/Features/projects/bookmarkService';
import { IconButton, CircularProgress, Tooltip } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const BookmarkButton = ({ projectId, onBookmarkChange }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
    async function fetchAndCheckBookmark() {
      try {
        const response = await getUserProjects();        
        if (response && Array.isArray(response.results)) {
          const project = response.results.find(p => p.id === Number(projectId));
          if (project) {
            setIsBookmarked(!!project.is_bookmarked);
          }
        }
      } catch (error) {
        console.error('Error fetching user projects:', error);
      }
    }
    fetchAndCheckBookmark();
  }, [projectId]);

  const handleBookmarkToggle = async () => {
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await unbookmarkProject(projectId);
        setIsBookmarked(false);
        onBookmarkChange?.(projectId, false);
      } else {
        await bookmarkProject(projectId);
        setIsBookmarked(true);
        onBookmarkChange?.(projectId, true);
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