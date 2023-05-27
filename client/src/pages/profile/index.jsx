import { useEffect, useState, forwardRef } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import TextField from "@mui/material/TextField";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MuiAlert from "@mui/material/Alert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { App } from "../../components/appBar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Snackbar from "@mui/material/Snackbar";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { MuiColorInput } from 'mui-color-input'
import { Main } from "../../components/main";
import Stack from "@mui/material/Stack";
import { DrawerHeader } from "../../components/DrawerHeader";
import {Logs, accountDelete} from '../../utils/api';
import Cookies from "universal-cookie";
const cookies = new Cookies();
const drawerWidth = 240;
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function createData(action, browser, ipAddress, location, date) {
  return { action, browser, ipAddress, location, date };
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "#121212" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export default function ProfilePage() {
  const [open, setOpen] = useState(true);
  const [logs, setLogs] = useState(null);
  const [pass, setPass] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlertData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const theme = useTheme();
  const handleClose = () => {setOpenDelete(false)};
  const handleCloseAlert = () => {setOpenAlert(false)};
  const handleDelete = (e) => {
    e.preventDefault()
    if (pass.length < 1) return;
    accountDelete(user, pass)
      .then((data) => {
        setAlertData({
          type: "success",
          message:data.data.message,
        });
        setOpenAlert(true);
        handleClose();
      })
      .catch((e) => {
        setAlertData({
          type: "error",
          message: e.response.data.message,
        });
        setOpenAlert(true);
        handleClose();
      });
  }
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    navigate("/login");
  };
  const [value, setValue] = useState(user.avatarColor)

  const handleChange = (newValue) => {
    setValue(newValue)
  }
  useEffect(() => {
    console.log(user)
    Logs(user.id).then(({data}) => {
      console.log(data)
      setLogs(data)
    })
  }, [])
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <App open={open} handleDrawerOpen={handleDrawerOpen} user={user} />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key={"Home"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key={"Profile"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={"Profile"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Logout"} disablePadding>
            <ListItemButton onClick={() => logout()}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ flexGrow: 1 }} >
          <Grid container spacing={{ xs: 2, md: 3}} justifyContent={{md: 'center', sm: 'start', xs: 'start'}}>
            <Grid xs={8} sm={10} md={4}>
              <Item>
                <Stack spacing={1}>
                  <Stack alignItems={"center"}>
                    <Avatar
                      alt="Remy Sharp"
                      sx={{
                        width: 150,
                        height: 150,
                        bgcolor: user.avatarColor,
                        fontSize: "5vh",
                      }}
                    >
                      {user.username.toUpperCase().slice(0, 2)}
                    </Avatar>
                    <Typography sx={{ p: 1 }}>@{user.username}</Typography>
                  </Stack>
                  <Divider></Divider>
                  <TextField
                    id="standard-basic"
                    label={user.email}
                    variant="standard"
                  />
                  <TextField
                    id="standard-basic"
                    label={user.username}
                    variant="standard"
                  />
                  <Button variant="contained">Save</Button>
                </Stack>
              </Item>
            </Grid>
            <Grid xs={8} sm={10} md={4}>
              <Item>
                <Stack spacing={1}>
                <Stack
                    direction={"row"}
                    spacing={27}
                  >
                    <Typography>Gender</Typography>
                    <Typography>{user.sex}</Typography>
                  </Stack>
                  <Stack
                    direction={"row"}
                    spacing={22}
                  >
                    <Typography>Date of birth</Typography>
                    <Typography>{user.dateOfBirth}</Typography>
                  </Stack>
                <Stack
                    direction={"row"}
                    spacing={24}
                  >
                    <Typography>Created at</Typography>
                    <Typography>{user.createdAt}</Typography>
                  </Stack>
          
                  <Divider></Divider>
                  <Stack
                    direction={"row"}
                    spacing={10}
                    alignItems={'center'}
                  >
                    <Typography>Delete my account</Typography>
                    <Button variant="outlined" color="error" onClick={() => setOpenDelete(true)}>
                      Delete my account
                    </Button>
                  </Stack>
                  <Stack
                    direction={"row"}
                    spacing={7.5}
                    alignItems={'center'}
                  >
                    <Typography>Change my password</Typography>
                    <Button variant="outlined" color="warning">
                      Change my password
                    </Button>
                  </Stack>
                  <Stack
                    direction={"row"}
                    spacing={9}
                    alignItems={'center'}
                  >
                    <Typography>Change avatar color</Typography>
                    <MuiColorInput value={value} onChange={handleChange} />
                  </Stack>
                  <Button variant="outlined">Save (color)</Button>
                </Stack>
              </Item>
            </Grid>
            <Grid xs={8} sm={10} md={8}>
              <Item>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="logs">
                    <TableHead>
                      <TableRow>
                        <TableCell>Action</TableCell>
                        <TableCell align="right">Browser</TableCell>
                        <TableCell align="right">IP Address</TableCell>
                        <TableCell align="right">Location</TableCell>
                        <TableCell align="right">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logs ? logs.map((log) => (
                        <TableRow
                          key={log.action}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {log.action}
                          </TableCell>
                          <TableCell align="right">{log.browser}</TableCell>
                          <TableCell align="right">{log.ipAddr}</TableCell>
                          <TableCell align="right">{log.localization}</TableCell>
                          <TableCell align="right">{log.date}</TableCell>
                        </TableRow>
                      )):null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Main>
      <div>
        <Dialog open={openDelete} onClose={handleClose}>
          <DialogTitle>ACCOUNT DELETION</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To continue account deletion please enter your password.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              placeholder="Password"
              fullWidth
              type="password"
              variant="standard"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDelete} color='error'>Delete</Button>
          </DialogActions>
        </Dialog>
        </div>
        <Snackbar
          open={openAlert}
          autoHideDuration={4000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleClose}
            severity={alert.type}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
    </Box>
  );
}
