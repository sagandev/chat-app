import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
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
import { useFormik, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { LoginPass } from "../../utils/api";
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
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      const { username, password } = values;
      console.log(values);
    },
  });
  return (
    <>
      <Container maxWidth="xs">
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} sx={{ padding: 1, marginTop: "20vh" }}>
            <Typography variant="h4" component="h4" align="center">
              LOG IN
            </Typography>
            <TextField
              error={formik.errors.username}
              sx={{ width: "100%" }}
              id="outlined-basic"
              name="username"
              label="Username"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            <FormControl sx={{ width: "100%" }} variant="outlined" error={formik.errors.password}>
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={formik.handleChange}
                value={formik.values.password}
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
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  console.info("I'm a button.");
                }}
                align="right"
              >
                Forgot password?
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  navigate('/signup')
                }}
                align="right"
              >
                Sign Up
              </Link>
            </Stack>
            <Button type="submit" variant="contained" sx={{ width: "100%" }}>
              Log In
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
}
