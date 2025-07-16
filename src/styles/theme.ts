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
  },
});

export const buttonStyles = {
  paddingX: 3.9,
  paddingY: 0.9,
  textTransform: "none",
  fontSize: 12,
  borderRadius: "8px",
  fontWeight: 1,
  color: 'white'
};

export default lightTheme;
