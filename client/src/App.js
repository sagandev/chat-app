import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./utils/protectedRoutes";
import MainPage from "./pages/main";
import RoomPage from "./pages/room";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import RegisterPage from "./pages/register";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          <Route path="/" exact element={<MainPage />}></Route>
          <Route path="/room/:roomId" exact element={<RoomPage />}></Route>
          <Route path="/profile" exact element={<ProfilePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<RegisterPage />}></Route>
        </Routes>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
