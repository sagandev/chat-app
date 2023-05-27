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
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useFormik, Field } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import {GenerateKey, RecoveryPass} from '../../utils/api';
import axios from "axios";
const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "*";
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
  const [ip, setIP] = useState("");
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
  const [email, setEmail] = useState([])
  const [keySent, setKeySent] = useState(false);
  const getip = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data);
    setIP(res.data.ip);
  };
  useEffect(() => {
    getip();
  }, []);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: (values) => {
      const { email } = values;
      setEmail({email});
      GenerateKey(email, ip, window.navigator.userAgent)
        .then(({ data }) => {
          setKeySent(true);
          setAlertData({
            type: "success",
            message: data.message,
          });
          setOpen(true);
        })
        .catch((e) => {
          console.log(e)
          if(e?.response.data.success === true){
            setKeySent(true);
          }
          setAlertData({
            type: "warning",
            message: e.response.data.message,
          });
          setOpen(true);
        });
    },
  });
  const formikPass = useFormik({
    initialValues: {
      recoveryKey: "",
      newPassword: "",
      newPasswordConf: ""
    },
    vaidate: (values) => {
      const errors = {};
      if (!values.recoveryKey) {
        errors.recoveryKey = "*";
      }
      if (values.newPassword.length < 1) {
        errors.newPassword = "*";
      } else if (values.newPassword.length < 8) {
        errors.newPassword = "Password must ";
      }
      if(values.newPassword !== values.newPasswordConf){
        errors.newPassword = "Passwords are not identical";
        errors.newPasswordConf = "Passwords are not identical";
      }
      if(!values.newPasswordConf){
        errors.newPasswordConf = "*";
      }
      return errors;
    },
    onSubmit: (values) => {
      const {recoveryKey, newPassword, newPasswordConf } = values;
      RecoveryPass(email.email, recoveryKey, newPassword, newPasswordConf, ip, window.navigator.userAgent)
        .then(({ data }) => {
          setAlertData({
            type: "success",
            message: data.message,
          });
          setOpen(true);
        })
        .catch((e) => {
          console.log(e);
          setAlertData({
            type: "error",
            message: `${e?.response.data.message}`,
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
              PASSWORD RECOVERY
            </Typography>
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
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Link
                variant="body2"
                onClick={() => {
                  navigate('/login')
                }}
                align="right"
              >
                Log In
              </Link>
            </Stack>
            <Button type="submit" variant="outlined" sx={{ width: "100%" }}>
              Generate key
            </Button>
          </Stack>
          </form>
            {keySent ? (<>
              <form onSubmit={formikPass.handleSubmit}>
                <Stack spacing={2} sx={{ padding: 1}}>
                <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
                error={Boolean(formikPass.errors.recoveryKey)}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Recovery code
                </InputLabel>
                <OutlinedInput
                  id="recoveryKey"
                  name="recoveryKey"
                  type={"text"}
                  onChange={formikPass.handleChange}
                  value={formikPass.values.recoveryKey}
                  label="RecoveryCode"
                />
                </FormControl>
              <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
                error={Boolean(formikPass.errors.newPassword)}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  onChange={formikPass.handleChange}
                  value={formikPass.values.newPassword}
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
                error={Boolean(formikPass.errors.newPasswordConf)}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="newPasswordConf"
                  type={showPassword ? "text" : "password"}
                  onChange={formikPass.handleChange}
                  value={formikPass.values.newPasswordConf}
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
                  label="Confirm Password"
                />
              </FormControl>
              <Button type="submit" variant="contained" sx={{ width: "100%" }}>
              Change password
            </Button>
            </Stack>
            </form>
            </>): null }
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
