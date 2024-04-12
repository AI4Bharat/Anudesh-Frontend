import React, { Suspense, useEffect, useState } from "react";
import GlobalStyles from "@/styles/LayoutStyles";
import BackButton from "@/components/common/BackButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { translate } from "@/config/localisation";
const Header = React.lazy(() => import("@/components/common/Header"));


const Layout= (props) => {
    /* eslint-disable react-hooks/exhaustive-deps */
  const { type, index, component,Backbutton, backPressNavigationPath } = props;
  const [show, setShow] = useState(false);
  const classes = GlobalStyles();

  useEffect(() => {
    if (show) {
      window.removeEventListener('scroll', (e) => { });
    }
  }, [show])

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', e => {
        if (window.pageYOffset > 100 && !show) {
            setShow(true);
        }
    })
  }

  useEffect(() => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('rtl') === "true") {
      let style = document.createElement('style');
      style.innerHTML = 'input, textarea { direction: RTL; }'
      document.head.appendChild(style);
    }
  }
  }, []);

  return (
      <div 
      className={classes.root}
      >
        <Suspense fallback={<div>Loading....</div>}>
          <Header
            type={type}
            index={index}
            className={classes.headerContainer}
          />
        </Suspense>
        <div
        className={classes.container}
        style={{marginTop:"88px"}}
        >
          { Backbutton  && 
           < BackButton startIcon={<  ArrowBackIcon />} sx={{ color:"white" ,   mb:2 ,mt:2 }} backPressNavigationPath={backPressNavigationPath ? backPressNavigationPath : ""} label={translate("label.backToPreviousPage")}/>
           }
          <Suspense fallback={<div>Loading....</div>}>
            {component}
          </Suspense>
        </div>
      </div>
  );
}
export default Layout;
