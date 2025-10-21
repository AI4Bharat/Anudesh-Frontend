import  Button  from "@mui/material/Button"
import { useNavigate, useLocation } from "react-router-dom";

const BackButton = ({ label, backPressNavigationPath, ...rest }) =>{
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
     <Button {...rest} variant="contained" color="primary" onClick={() => {
        // window.scrollTo(0, 0);
        if (backPressNavigationPath) {
          navigate(backPressNavigationPath);
        } else {
          if (location.state?.fromBackToProject){
            navigate(-2);
          }
          else{
            navigate(-1);
          }
        }
      }}>
      {label}
    </Button>
    {/* <Button {...rest} variant="contained" color="primary" onClick={() => {
        window.history.back(); 
      }}
    >{label}</Button> */}
     </>
  );
}
  
export default  BackButton;