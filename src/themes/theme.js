import { createTheme } from "@mui/material/styles";
import Card from "../assets/Card.svg";

const themeDefault = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#fa723e",
      main: "#ee6633",
      dark: "#b33a0c",
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: "#FFFFFF",
      main: "#FFFFFF",
      dark: "#FFFFFF",
      contrastText: "#000000",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
      subtle: "#f5f5f5",
},
 text: {
  primary: "#111111",
  secondary: "#555555",
  disabled: "#aaaaaa",
},
divider: "rgba(0,0,0,0.12)",
custom: {
  cardBadge: "#FFD981",
  tableRowOdd: "#ffe0b2",
  tableRowEven: "#fffde7",
  tableRowOddHover: "#ffe0b2",
  tableRowEvenHover: "#fff3e0",
  tableRowDataOdd: "#D6EAF8",
  tableRowDataEven: "#E9F7EF",
  tableHeaderBg: "#fafafa",
  appBarGradient: "linear-gradient(to right, #f1f1f1, #ffffff)",
  navMenuHover: "#E0E0E0",
  profileHeaderBg: "#FEE0B3",
  notificationUnread: "#FFFDE6",
  notificationBorder: "#FEE0B3",
  videoNameBoxBg: "#fcf7e9",
  topBarBg: "#DEECFF",
  tabColor: "#3A3A3A",
  tabIndicator: "#FD7F23",
  paperBorder: "rgba(0,0,0,0.12)",
},
  },
 
  typography: {
    fontFamily: "Roboto",
    fontWeight: "400",
    h1: {
      fontSize: "3.125rem",
      fontFamily: '"Rowdies", "cursive","Roboto" ,"sans-serif"',
      fontWeight: "300",
      "@media (max-width:550px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontSize: "2.5rem",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "600",
      "@media (max-width:550px)": {
        fontSize: "1.5rem",
      },
    },
    h3: {
      fontSize: "1.6875rem",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "600",
      letterSpacing: "0px",
      "@media (max-width:550px)": {
        fontSize: "1.3rem",
      },
    },
    h4: {
      fontSize: "1.5rem",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "600",
      "@media (max-width:550px)": {
        fontSize: "0.9rem",
      },
    },
    h5: {
      fontSize: "1.3125rem",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "600",
      "@media (max-width:550px)": {
        fontSize: "1rem",
      },
    },
    h6: {
      fontSize: "1.125rem",
      fontFamily: "Roboto ,sans-serif",
      fontWeight: "600",
      paddingTop: "4px",
      "@media (max-width:550px)": {
        fontSize: "1rem",
      },
    },
    body1: {
      fontSize: "1.25rem",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "400",
    },
    body2: {
      fontSize: "0.875rem",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "400",
      //color: "#0C0F0F",
      lineHeight: "22px",
    },
    caption: {
      fontSize: "0.75rem",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "400",
      //color: "#3A3A3A",
    },
    subtitle1: {
      fontSize: "1.125rem",
      fontFamily: "'Roboto', sans-serif",
      fontWeight: "400",
      "@media (max-width:550px)": {
        fontSize: ".9rem",
      },
    },
    subtitle2: {
      fontSize: "1rem",
      fontFamily: "Roboto,sans-serif",
      fontWeight: "300",
      "@media (max-width:550px)": {
        fontSize: ".7rem",
      },
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#ffe0b2",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#fffde7",
          },
          "&.MuiTableRow-hover:hover:nth-of-type(odd)": {
            backgroundColor: "#ffe0b2",
          },
          "&.MuiTableRow-hover:hover:nth-of-type(even)": {
            backgroundColor: "#fff3e0",
          },
          "&.MuiTableRow-footer": {
            backgroundColor: "#fff",
          },
        },
      },
    },
    MUIDataTablePagination: {
      styleOverrides: {
        backgroundColor: "#fff",
      },
    },
    MUIDataTableFilterList: {
      styleOverrides: {
        chip: {
          display: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          minWidth: "210px",
        },
      },
    },
    MUIDataTableFilter: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          width: "80%",
          fontFamily: '"Roboto" ,"sans-serif"',
        },
        checkboxFormControl: {
          minWidth: "200px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          "@media (max-width:670px)": {
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          fontFamily: '"Roboto" ,"sans-serif"',
        },
        padding: {
          "@media (max-width:670px)": {
            padding: "0px",
            paddingLeft: "9px",
          },
        },
      },
    },
    MUIDataTable: {
      styleOverrides: {
        paper: {
          minHeight: "674px",
          boxShadow: "0px 0px 2px rgba(0,0,0,0.16)",
          border: "0",
          maxHeight: "100vh",
        },
        responsiveBase: {
          minHeight: "560px",
        },
      },
    },

    MUIDataTableToolbar: {
      styleOverrides: {
        filterPaper: {
          width: "310px",
        },
        MuiButton: {
          root: {
            display: "none",
            fontFamily: "Roboto ,sans-serif",
            fontWeight: 550,
          },
        },
      },
    },
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          padding: ".5rem .5rem .5rem .8rem",
          textTransform: "capitalize",
          fontFamily: '"Roboto" ,"sans-serif"',
        },

        stackedParent: {
          "@media (max-width: 400px)": {
            display: "table-row",
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        grid: {
          maxWidth: "100%",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          padding: ".6rem .5rem .6rem 1.5rem",
          backgroundColor: "#fafafa !important",
          marginLeft: "25px",
          letterSpacing: "0.74",
          fontWeight: "bold",
          minHeight: "700px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none !important",
          borderRadius: 0,
          border: "1px solid rgba(0,0,0,0.12)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { minWidth: "360px", minHeight: "116px" },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#b33a0c",
          color: "#FFFFFF",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "5%",
          fontWeight: 550,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxSizing: "border-box",
          margin: "-1px",
          padding: "0px",
          backgroundImage: "linear-gradient(to right, #f1f1f1, #ffffff)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          height: "36px",
        },
        label: {
          fontFamily: "Roboto ,sans-serif",
          fontSize: "0.875rem",
          "@media (max-width:640px)": {
            fontSize: "10px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: "25",
          borderRadius: "none",
          textTransform: "none",
          fontFamily: "Roboto ,sans-serif",
          fontWeight: 550,
        },
        label: {
          textTransform: "none",
          fontFamily: '"Roboto" ,sans-serif',
          fontSize: "16px",
          letterSpacing: "0.16px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          height: "19px",
          "@media (max-width:640px)": {
            fontSize: "10px",
          },
        },
        sizeLarge: {
          height: "40px",
          borderRadius: "20px",
        },
        sizeMedium: {
          height: "40px",
          borderRadius: "20px",
        },
        sizeSmall: {
          height: "30px",
          borderRadius: "20px",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#FD7F23",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          width: "auto",
          fontSize: "18px",
          fontWeight: "600",
          letterSpacing: "0px",
          fontFamily: "Roboto, sans-serif",
          padding: "0",
          textTransform: "none",
          marginRight: "28px",
          opacity: 1,
          color: "#3A3A3A",
          "&.Mui-selected": {
            color: "#3A3A3A",
          },
          "@media (min-width:600px)": {
            minWidth: "auto",
          },
          "@media (max-width:600px)": {
            marginRight: "20px",
            minWidth: "auto",
          },
          "@media (max-width:550px)": {
            fontSize: "1rem",
          },
        },
        textColorInherit: {
          color: "#3A3A3A",
          opacity: 1,
          "&.Mui-selected": {
            fontWeight: "bold",
          },
        },
        wrapper: {
          alignItems: "flex-start",
          textTransform: "none",
        },
      },
    },
    MuiBox: {
      root: {
        padding: "24px 0px",
      },
    },
    MUIDataTableBodyRow: {
      root: {
        "&:nth-of-type(odd)": {
          backgroundColor: "#D6EAF8",
        },
        "&:nth-of-type(even)": {
          backgroundColor: "#E9F7EF",
        },
      },
    },
    MUIDataTableFilterList: {
      chip: {
        display: "none",
      },
    },
    MUIDataTable: {
      paper: {
        minHeight: "674px",
        boxShadow: "0px 0px 2px #00000029",
        border: "1px solid rgba(0,0,0,0.12)",
      },
      responsiveBase: {
        minHeight: "560px",
      },
    },
    MUIDataTableToolbar: {
      filterPaper: {
        width: "310px",
      },
      MuiButton: {
        root: {
          display: "none",
          fontFamily: "Roboto ,sans-serif",
          fontSize: "16px",
          fontWeight: 550,
        },
      },
    },
    MUIDataTableFilter: {
      root: {
        backgroundColor: "white",
        width: "80%",
      },
      checkboxFormControl: {
        minWidth: "200px",
      },
    },
    MUIDataTableHeadCell: {
      root: {
        "&:nth-of-type(1)": {
          width: "25%",
        },
        "&:nth-of-type(2)": {
          width: "18%",
        },
        "&:nth-of-type(3)": {
          width: "18%",
        },
        "&:nth-of-type(4)": {
          width: "18%",
        },
      },
    },
    MUIDataTableBodyCell: {
      root: { padding: ".5rem .5rem .5rem .8rem", textTransform: "capitalize" },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: "0.875rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        sizeSmall: {
          fontSize: "0.875rem",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          fontSize: "0.875rem",
        },
      },
    },
  },
});

themeDefault.container = {
  backgroundImage: `url(${Card})`,
};

themeDefault.typography.lightText = {
  fontSize: "0.75rem",
  fontFamily: "Roboto, sans-serif",
  fontWeight: "400",
  //color: "rgb(255 255 255 / 82%)",
};

export const lightTheme = themeDefault;

export const darkTheme = createTheme({
  ...themeDefault,
  palette: {
    ...themeDefault.palette,
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
      subtle: "#2a2a2a",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
      disabled: "#555555",
    },
    divider: "rgba(255,255,255,0.12)",
    custom: {
      cardBadge: "#5a4a00",
      tableRowOdd: "#2a2a2a",
      tableRowEven: "#252525",
      tableRowOddHover: "#333333",
      tableRowEvenHover: "#2d2d2d",
      tableRowDataOdd: "#1a2a3a",
      tableRowDataEven: "#1a2a2a",
      tableHeaderBg: "#1a1a1a",
      appBarGradient: "linear-gradient(to right, #1a1a1a, #2d2d2d)",
      navMenuHover: "#333333",
      profileHeaderBg: "#2a1a00",
      notificationUnread: "#2a2500",
      notificationBorder: "rgba(255,255,255,0.12)",
      videoNameBoxBg: "#2a2500",
      topBarBg: "#1a2a3a",
      tabColor: "#ffffff",
      tabIndicator: "#FD7F23",
      paperBorder: "rgba(255,255,255,0.12)",
    },
  },
  components: {
    ...themeDefault.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121212",
          color: "#ffffff",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": { backgroundColor: "#2a2a2a" },
          "&:nth-of-type(even)": { backgroundColor: "#252525" },
          "&.MuiTableRow-hover:hover:nth-of-type(odd)": { backgroundColor: "#333333" },
          "&.MuiTableRow-hover:hover:nth-of-type(even)": { backgroundColor: "#2d2d2d" },
          "&.MuiTableRow-footer": { backgroundColor: "#121212" },
        },
      },
    },
    MUIDataTableFilter: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          width: "80%",
          fontFamily: '"Roboto" ,"sans-serif"',
        },
        checkboxFormControl: {
          minWidth: "200px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          padding: ".6rem .5rem .6rem 1.5rem",
          backgroundColor: "#1a1a1a !important",
          marginLeft: "25px",
          letterSpacing: "0.74",
          fontWeight: "bold",
          minHeight: "700px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none !important",
          borderRadius: 0,
          border: "1px solid rgba(255,255,255,0.12)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxSizing: "border-box",
          margin: "-1px",
          padding: "0px",
          backgroundImage: "linear-gradient(to right, #1a1a1a, #2d2d2d)",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          ...themeDefault.components.MuiTab.styleOverrides.root,
          color: "#ffffff",
          "&.Mui-selected": {
            color: "#ffffff",
          },
        },
        textColorInherit: {
          color: "#ffffff",
          opacity: 1,
          "&.Mui-selected": {
            fontWeight: "bold",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ee6633",
          color: "#FFFFFF",
        },
      },
    },
    MUIDataTablePagination: {
      styleOverrides: {
        backgroundColor: "#1e1e1e",
      },
    },
    MUIDataTable: {
      paper: {
        minHeight: "674px",
        boxShadow: "0px 0px 2px rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.12)",
      },
      responsiveBase: {
        minHeight: "560px",
      },
    },
    MUIDataTableBodyRow: {
      root: {
        "&:nth-of-type(odd)": { backgroundColor: "#1a2a3a" },
        "&:nth-of-type(even)": { backgroundColor: "#1a2a2a" },
      },
    },
  },
});

export default themeDefault;
