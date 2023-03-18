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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "universal-cookie";
const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = "*";
  } else if (values.username.length > 20) {
    errors.username = "Zbyt długie";
  } else if (values.username.length < 2) {
    errors.username = "Zbyt krótkie";
  }
  if (!values.email) {
    errors.email = "*";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Nieprawidłowy adres email";
  }
  if (!values.password) {
    errors.password = "*";
  } else if (values.password.length < 8) {
    errors.password = "Hasło jest zbyt słabe";
  }
  if (!values.confirm) {
    errors.confirm = "*";
  } else if (values.confirm !== values.password) {
    errors.confirm = "Hasła nie są takie same";
  }
  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Podaj datę urodzenia";
  }
  if (!values.gender) {
    errors.gender = "*";
  }
  return errors;
};
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
      dateOfBirth: "",
      gender: "",
    },
    validate,
    onSubmit: (values) => {
      //console.log(values);
      const { username, email, password, dateOfBirth, gender } = values;
      console.log(values);
    },
  });
  return (
    <>
      <Container maxWidth="xs">
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} sx={{ padding: 1, marginTop: "20vh" }}>
            <Typography variant="h4" component="h4" align="center">
              SIGN UP
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
            <TextField
              error={formik.errors.email}
              sx={{ width: "100%" }}
              id="outlined-basic"
              name="email"
              label="E-mail"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <Stack spacing={1} direction="row">
              <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
                error={formik.errors.password}
              >
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

              <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
                error={formik.errors.confirm}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="confirm"
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  value={formik.values.confirm}
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
                  label="Confirm"
                />
              </FormControl>
            </Stack>
            <DatePicker
              label="Date of birth"
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                name="gender"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.gender}
                label="Gender"
                onChange={formik.handleChange}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"N/A"}>Rather not say</MenuItem>
              </Select>
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
                Log In
              </Link>
            </Stack>
            <Button type="submit" variant="contained" sx={{ width: "100%" }}>
              Sign Up
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
}
