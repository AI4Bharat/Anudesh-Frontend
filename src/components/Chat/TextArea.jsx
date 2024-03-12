import './textarea.css';
import {styled} from '@mui/system';
import {Grid} from '@mui/material';
import { translate } from "@/config/localisation";
import IconButton from '@mui/material/IconButton';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CircularProgress from '@mui/material/CircularProgress';
import {
  TextareaAutosize as BaseTextareaAutosize,
} from '@mui/base/TextareaAutosize';

export default function Textarea({handleButtonClick, handleOnchange, size, grid_size, class_name, loading}) {
  const orange = {
    200: 'pink',
    400: '#EE6633', //hover-border
    600: '#EE663366',
  };

  const grey = {
    50: '#F3F6F9',
    200: '#DAE2ED',
    300: '#C7D0DD',
    700: '#434D5B',
    900: '#1C2025',
  };

  const Textarea = styled (BaseTextareaAutosize) (
    ({theme}) => `
    resize: none;
    margin-right: 5px;
    font-size: 1rem;
    width: 60%;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    &:hover {
      border-color: ${orange[400]};
    }
    &:focus {
      outline: 0;
      border-color: ${orange[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? orange[600] : orange[200]};
    }
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  return (
    <Grid
      item
      xs={size}
      backgroundColor="#FFF"
      justifyContent={'center'}
      alignItems={'center'}
      display={'flex'}
      position={'fixed'}
      bottom={0}
      width={grid_size}
      className={class_name}
    >
      <Textarea
        xs={size}
        maxRows={10}
        aria-label="empty textarea"
        placeholder={translate("chat_placeholder")}
        onChange={e => {
          handleOnchange (e.target.value);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && e.ctrlKey) {
            handleButtonClick ();
          }
        }}
      />
      <IconButton size="large" onClick={handleButtonClick}>
        <SendRoundedIcon style={{color: '#EE6633', height: '4rem'}} />
      </IconButton>
      {loading && <CircularProgress style={{ color: '#EE6633' }} />}
    </Grid>
  );
}
