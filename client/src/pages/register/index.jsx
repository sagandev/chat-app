import { useState, forwardRef } from "react";

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
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useFormik, Field } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { Register } from "../../utils/api";
import moment from 'moment'
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
  if (!values.dateofbirth) {
    errors.dateofbirth = "*";
  }
  if (!values.gender) {
    errors.gender = "*";
  }
  return errors;
};
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlertData] = useState([]);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const [value, setValue] = useState();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
      dateofbirth: "",
      gender: "",
    },
    validate,
    onSubmit: (values) => {
      //console.log(values);
      const { username, email, password, gender } = values;
      const dateofbirth = moment(values.dateofbirth).format("DD/MM/YYYY");
      console.log(username, email, password, dateofbirth, gender);
      Register(username, email, password, dateofbirth, gender)
        .then(({ data }) => {
          setAlertData({
            type: "success",
            message: data.message,
          });
          setOpen(true);
          setTimeout(function(){
            navigate("/login")
          }, 3000)
        })
        .catch((e) => {
          console.log(e)
          setAlertData({
            type: "error",
            message: e.response.data.message,
          });
          setOpen(true);
        });
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
              error={Boolean(formik.errors.username)}
              sx={{ width: "100%" }}
              id="outlined-basic"
              name="username"
              label="Username"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            <TextField
              error={Boolean(formik.errors.email)}
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
                error={Boolean(formik.errors.password)}
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
                error={Boolean(formik.errors.confirm)}
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
              name="dateofbirth"
              inputFormat="DD/MM/YYYY"
              value={formik.values.dateofbirth}
              onChange={date => formik.setFieldValue('dateofbirth', date)}
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
