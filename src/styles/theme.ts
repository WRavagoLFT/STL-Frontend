import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F8F0E3",
    },
    text: {
      primary: "#0038A8",
      secondary: "#0038A8",
    },
  },
  typography: {
    fontFamily: `'Montserrat', sans-serif`,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "#FFFFFF",
          borderRadius: 5,
          backgroundColor: "#0038A8",
          "&:hover": {
            backgroundColor: "#0066CC",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          backgroundColor: "#F8F0E3",
          padding: "5px 12px",
          border: "1px solid",
          borderColor: "#0038A8",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#F8F0E3",
          borderRadius: 5,
          borderCollapse: "collapse",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          borderBottom: "2px solid #E0DCBD",
          padding: "2px",
        },
        head: {
          padding: "10px",
          color: "#FFFFFF",
          fontWeight: "bold",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#E97451",
          lineHeight: "1.5rem",
          textTransform: "uppercase",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#E97451 !important",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: "0.5px solid #E0DCBD",
          "&:hover": {
            backgroundColor: "#E0DCBD",
          },
          "&.Mui-selected": {
            backgroundColor: "#2F2F2F",
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: "0px",
          borderRadius: "0px",
          boxShadow: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          borderRadius: "0px",
        },
        paper: {
          boxShadow: "0px 5px 5px -2px rgba(0,0,0,0.2)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: "#E0DCBD",
          padding: "17px 55px 17px 12px",
          borderRadius: "0px",
          fontSize: 14,
          "&.Mui-selected": {
            backgroundColor: "#E0DCBD",
            color: "#0038A8",
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          overflow: "hidden",
          maxHeight: "48px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#F8F0E3",
          borderRadius: "6px",
          // padding: "25px 8px 27px 8px",
          padding: "20px 8px 12px 8px",
          boxShadow: "0px 5px 5px -2px rgba(0,0,0,0.2)",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          height: "auto",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "25px",
          fontWeight: "700",
          marginBottom: "-0.3rem",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontSize: "0.85rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "15px",
          //color: "#ACA993 !important",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "0.70rem",
          marginBottom: "0px !important",
          marginLeft: "0px",
          // color: '#CE1126 !important',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          width: "100% !important",
          fontSize: "0.85rem",
          color: "#000000 !important",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#2F2F2F !important", // Custom background color
          color: "#fff",
          fontSize: "12px",
        },
      },
    },
  },
});

export const buttonStyles = {
  paddingX: 3.9,
  paddingY: 0.9,
  textTransform: "none",
  fontSize: 12,
  borderRadius: "8px",
  fontWeight: 1,
};

export const buttonStylesretail = {
  textTransform: "none",
  fontSize: 12,
  borderRadius: "8px",
  width: "35%",
  fontWeight: 1,
};

export const deleteStyles = {
  paddingX: 3,
  paddingY: 0.9,
  textTransform: "none",
  fontSize: 12,
  borderRadius: "8px",
  backgroundColor: "#F05252",
  width: "auto",
  marginRight: "0.9rem",
  "&:hover": {
    backgroundColor: "#D43D38",
  },
};

export const inputStyles = {
  "& .MuiOutlinedInput-root": {
    input: {
      padding: "12px 16px !important",
    },
    "& fieldset": {
      borderColor: "#D1D5DB",
      padding: "10px 16px !important",
    },
    "&.Mui-error fieldset": { borderColor: "#FF7A7A" },
  },
};

export const selectStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#D1D5DB",
      padding: "14px 40px 10px 14px",
    },
  },
};

export const inputErrorStyles = {
  display: "flex",
  color: "#FF7A7A",
  fontSize: "13px",
  paddingTop: "0.3rem",
};

export const filterStyles = {
  marginTop: 0,
  marginBottom: 0,
  color: "#E0DCBD !important",
  padding: "4px",
  fontSize: "12px",
  backgroundColor: "none",
  "& .MuiFilledInput-input::placeholder": {
    color: "#E0DCBD" ,
    opacity: 1, // ensure full opacity if needed
    fontSize: "12px",
  },
  "& .MuiInputBase-input": {
    padding: 0,
    paddingBottom: 0,
    color: '#E0DCBD',
    fontSize: "12px",
    margin: 0,
  },
};

export const cardDashboardStyles = {
  height: "auto",
  border: "1px solid",
  borderColor: "#0038A8",
  backgroundColor: "transparent",
  borderRadius: "8px",
  paddingY: "1.9rem",
  paddingX: "1rem",
  margin: "0 auto",
};

export const buttonDrawStyles = {
  width: "auto",
  height: "auto",
  border: "1px solid",
  borderColor: "#575757",
  borderRadius: "8px",
  py: 1.5,
  paddingLeft: "0.8rem",
  paddingRight: "3.7rem",
};

export const skeletonRowStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: 2,
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  mt: 2,
};

export const buttonUpdateStyles = {
  backgroundColor: "#F6BA12",
  textTransform: "none",
  borderRadius: "8px",
  color: "#181A1B",
  width: "100%",
  "&:hover": {
    backgroundColor: "#FFD100", // Hover color
  },
};

export const legendCircle = {
  width: 16,
  height: 16,
  borderRadius: "50%",
  mr: 1,
  fontSize: "10px !important",
};

export const selectDrawStyles = {
  backgroundColor: "#F6BA12 !important",
};

export default lightTheme;
