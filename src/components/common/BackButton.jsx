import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";

const BackButton = ({ label, backPressNavigationPath, ...rest }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // 1️⃣ Explicit navigation path (highest priority)
    if (backPressNavigationPath) {
      navigate(backPressNavigationPath);
      return;
    }

    // 2️⃣ Existing state-based logic (keep this)
    if (location.state?.fromBackToProject) {
      navigate(-2);
      return;
    }

    // 3️⃣ Senior's referrer-based logic (NEW)
    const referrer = document.referrer;
    const taskRoutePattern = /\/projects\/[^/]+\/tasks\/[^/]+$/;

    if (referrer) {
      try {
        const previousPath = new URL(referrer).pathname;

        if (taskRoutePattern.test(previousPath)) {
          navigate(-3); // skip task page
          return;
        }
      } catch (e) {
        // ignore invalid URL errors
      }
    }

    // 4️⃣ Default fallback
    navigate(-1);
  };

  return (
    <Button
      {...rest}
      variant="contained"
      color="primary"
      onClick={handleBack}
    >
      {label}
    </Button>
  );
};

export default BackButton;
