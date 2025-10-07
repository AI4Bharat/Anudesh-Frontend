import React, { Suspense, useEffect, useState } from "react";
import GlobalStyles from "@/styles/LayoutStyles";
import BackButton from "@/components/common/BackButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { translate } from "@/config/localisation";
import ErrorBoundary from "../ErrorBoundary";

const Header = React.lazy(() => import("@/components/common/Header"));

const Layout = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const { type, index, component, Backbutton, backPressNavigationPath } = props;
  const [show, setShow] = useState(false);
  const classes = GlobalStyles();

  useEffect(() => {
    if (show) {
      window.removeEventListener("scroll", (e) => {});
    }
  }, [show]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", (e) => {
      if (window.pageYOffset > 100 && !show) {
        setShow(true);
      }
    });
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("rtl") === "true") {
        let style = document.createElement("style");
        style.innerHTML = "input, textarea { direction: RTL; }";
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <div className={classes.root}>
      <Suspense fallback={<div>Loading....</div>}>
        <Header type={type} index={index} className={classes.headerContainer} />
      </Suspense>
      <div className={classes.container} style={{ marginTop: "88px" }}>
        {Backbutton && (
          <BackButton
            startIcon={<ArrowBackIcon />}
            sx={{ color: "white", m: { xs: 1, md: 1, lg: 2, xl: 2 } }}
            // onClick={handleBack}
            label={translate("label.backToPreviousPage")}
            backPressNavigationPath={
              backPressNavigationPath ? backPressNavigationPath : ""
            }

          />
        )}
        <Suspense fallback={<div>Loading....</div>}>
          <ErrorBoundary>{component}</ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
};

export default Layout;
