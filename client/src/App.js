import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./utils/protectedRoutes";
import MainPage from "./pages/main";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import RegisterPage from "./pages/register";
import RecoveryPage from "./pages/recovery";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterMoment}>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" exact element={<MainPage />}></Route>
              <Route path="/room/:roomId" exact element={<MainPage />}></Route>
              <Route path="/profile" exact element={<ProfilePage />}></Route>
            </Route>
            <Route path="/login" exact element={<LoginPage />}></Route>
            <Route path="/signup" exact element={<RegisterPage />}></Route>
            <Route path="/recovery" exact element={<RecoveryPage />}></Route>
          </Routes>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
