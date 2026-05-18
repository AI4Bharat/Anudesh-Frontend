import themeDefault from "./theme";
import { createTheme } from "@mui/material/styles";

/**
 * Same as tableTheme but adds MUIDataTableToolbar overrides that compact the
 * toolbar shell and hide its default title/left section — scoped ONLY to
 * ProjectDetail child tables (TaskTable, SuperCheckerTasks, MembersTable).
 *
 * Construction pattern mirrors tableTheme exactly (spread themeDefault, spread
 * themeDefault.components) so all base styles are preserved correctly.
 */
const projectDetailTableTheme = createTheme({
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
    // ── ProjectDetail-specific: compact toolbar shell ──────────────────────
    MUIDataTableToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: "0px !important",
          paddingRight: "0px !important",
          paddingTop: "0px !important",
          paddingBottom: "0px !important",
          minHeight: "auto !important",
        },
        actions: {
          flex: "1 1 100%",
          textAlign: "right",
        },
        titleRoot: {
          display: "none !important",
        },
        left: {
          display: "none !important",
        },
      },
    },
    // ──────────────────────────────────────────────────────────────────────
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
    // ── ProjectDetail-specific: table row colors ───────────────────────────
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#fff5f1",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#ffffff",
          },
          "&.MuiTableRow-hover:hover:nth-of-type(odd)": {
            backgroundColor: "#ffebe3",
          },
          "&.MuiTableRow-hover:hover:nth-of-type(even)": {
            backgroundColor: "#f5f5f5",
          },
          "&.MuiTableRow-footer": {
            backgroundColor: "#fff",
          },
        },
      },
    },
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          padding: ".5rem .5rem .5rem .8rem",
          textTransform: "capitalize",
          color: "#374151",
        },
      },
    },
    // ──────────────────────────────────────────────────────────────────────
  },
});

export default projectDetailTableTheme;
