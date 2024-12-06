import themeDefault from "./theme";
import { createTheme } from "@mui/material/styles";

const tableTheme = createTheme({
  ...themeDefault,
  components: {
    ...themeDefault.components,
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "16px",
          minWidth: "25",
          borderRadius: "none",
          textTransform: "none",
          fontFamily: "Roboto ,sans-serif",
          fontWeight: 550,
        },
        label: {
          textTransform: "none",
          fontFamily: "Roboto ,sans-serif",
          fontSize: "100px",
          letterSpacing: "0.16px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          height: "19px",
          "@media (max-width:640px)": {
            fontSize: "10px",
          },
        },
      },
    },
    MUIDataTable: {
      styleOverrides: {
        root: {
          fontSize: "16px",
          fontFamily: '"Roboto" ,sans-serif',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Roboto", sans-serif',
          fontSize: "16px",
        },
        head: {
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 700,
          fontSize: "16px",
          backgroundColor: "#FAFAFA",
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          maxHeight: "30%",
        },
      },
    },
    MUIDataTableFilter: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          width: "80%",
          fontFamily: '"Roboto" ,sans-serif',
          fontSize: "16px",
        },
        checkboxFormControl: {
          minWidth: "120px",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
  },
});

export default tableTheme;
