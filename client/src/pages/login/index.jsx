import { useState, forwardRef, useEffect } from "react";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { Login } from "../../utils/api";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = "*";
  }
  if (!values.password) {
    errors.password = "*";
  }
  return errors;
};
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [ip, setIP] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const [alert, setAlertData] = useState([]);
  const navigate = useNavigate();
  const getip = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data);
    setIP(res.data.ip);
  };
  useEffect(() => {
    getip();
  }, []);
  const handleSubmit = async (values) => {
    const { username, password } = values;
    try {
      await Login(username, password, ip, window.navigator.userAgent)
        .then(({ data }) => {
          setAlertData({
            type: "success",
            message: data.message,
          });
          setOpen(true);
          localStorage.setItem("user", JSON.stringify(data.user));
          cookies.set("TOKEN", data.token, { path: "/" });
          navigate("/");
        })
        .catch((e) => {
          setAlertData({
            type: "error",
            message: e.response.data.message,
          });
          setOpen(true);
        });
    } catch (e) {
      return;
    }
  };
  return (
    <>
      <Container maxWidth="xs">
        <Formik
          initialValues={{ username: "", password: "" }}
          validate={validate}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Stack spacing={2} sx={{ padding: 1, marginTop: "20vh" }}>
                <Typography variant="h4" component="h4" align="center">
                  LOG IN
                </Typography>
                <TextField
                  error={Boolean(props.errors.username)}
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  name="username"
                  label="Username"
                  variant="outlined"
                  onChange={props.handleChange}
                  value={props.values.username}
                />
                <FormControl
                  sx={{ width: "100%" }}
                  variant="outlined"
                  error={Boolean(props.errors.password)}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={props.handleChange}
                    value={props.values.password}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                <Stack
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Link
                    variant="body2"
                    onClick={() => {
                      navigate("/recovery");
                    }}
                    align="right"
                  >
                    Forgot password?
                  </Link>
                  <Link
                    variant="body2"
                    onClick={() => {
                      navigate("/signup");
                    }}
                    align="right"
                  >
                    Sign Up
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ width: "100%" }}
                >
                  Log In
                </Button>
              </Stack>
            </form>
          )}
        </Formik>

        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={alert.type}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
