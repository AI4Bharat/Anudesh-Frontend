import { Button } from "@mui/material"
import { useRouter } from 'next/navigation'

const BackButton = ({ label, backPressNavigationPath, ...rest }) =>{
  const router = useRouter();
  return (
    <>
     <Button {...rest} variant="contained" color="primary" onClick={() => backPressNavigationPath ? router.push(backPressNavigationPath) : router.back()}>
      {label}
    </Button>
     </>
  );
}
  
export default  BackButton;