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
import Snackbar from "@mui/material/Snackbar";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from '@mui/icons-material/Logout';
import InboxIcon from "@mui/icons-material/MoveToInbox";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MuiAlert from "@mui/material/Alert";
import CreateIcon from '@mui/icons-material/Create';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { ConnectionManager } from "../../components/ConnectionManager";
import { MyForm } from "../../components/MyForm";
import { Events } from "../../components/Events";
import { App } from "../../components/appBar";
import { Main } from "../../components/main";
import { DrawerHeader } from "../../components/DrawerHeader";
import { CreateRoom } from "../../utils/api";
import {Chats} from "../../utils/api"
import {JoinRoom} from '../../utils/api'
import {useParams} from 'react-router-dom';
import Cookies from "universal-cookie";
const cookies = new Cookies();
const drawerWidth = 240;
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function MainPage() {
  const {roomId} = useParams();
  const [messages, setMessages] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlertData] = useState([]);
  const [room, setRoom] = useState("");
  const [code, setCode] = useState("");
  const [openCode, setOpenCode] = useState(false);
  const [chats, setChats] = useState();
  const [openCreate, setOpenCreate] = useState(false);
  const [open, setOpen] = useState(true);
  const [openJoin, setOpenJoin] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  useEffect(() => {
    socket.emit('join', {user:user, room:roomId})
    Chats(user).then((data) => {
      setChats(data.data)
    }).catch(e => {
      console.log(e)
    })
    function onNewMessage(value) {setMessages((previous) => [...previous, value])}

    socket.on("message", onNewMessage);
    return () => {
      socket.off("message", onNewMessage);
    };
  }, []);
  const theme = useTheme();
  const handleDrawerOpen = () => {setOpen(true)};
  const handleDrawerClose = () => {setOpen(false)};
  const handleClickOpen = () => {setOpenCreate(true)};
  const handleClose = () => {setOpenCreate(false)};
  const handleCloseAlert = () => {setOpenAlert(false)};
  const handleCloseCode = () => {setOpenCode(false)};
  const handleToggleJoin = () => {setOpenJoin(!openJoin)};
  const handleCreate = (e) => {
    e.preventDefault();
    if (room.length < 1) return;
    CreateRoom(user, room)
      .then((data) => {
        setCode(data.data);
        setAlertData({
          type: "success",
          message: `Room "${room}" has been created. Save the access code.`,
        });
        setOpenAlert(true);
        handleClose();
        setOpenCode(true)
      })
      .catch((e) => {
        setAlertData({
          type: "error",
          message: e.response.data.message,
        });
        setOpenAlert(true);
        handleClose();
      });
  };
  const handleJoin = (e) => {
    e.preventDefault();
    if (code.length < 1) return;
    JoinRoom(user, code)
      .then((data) => {
        setAlertData({
          type: "success",
          message: data.message,
        });
        setOpenAlert(true);
        handleToggleJoin()
        setOpenCode(true)
      })
      .catch((e) => {
        setAlertData({
          type: "error",
          message: e.response.data.message,
        });
        setOpenAlert(true);
        handleToggleJoin();
      });
  };
  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    navigate("/login");
  };
  if(!chats) return     <>
  <Box sx={{ display: 'flex' }}>
    <CircularProgress />
  </Box>
  </>;
  else
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <App open={open} handleDrawerOpen={handleDrawerOpen} user={user}/>
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
          <ListItem
            key={"Create room"}
            disablePadding
            onClick={handleClickOpen}
          >
            <ListItemButton>
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary={"Create room"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Join room"} disablePadding onClick={handleToggleJoin}>
            <ListItemButton>
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary={"Join room"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {chats.length > 0 ? chats.map((chat, index) => (
            <ListItem key={chat._id} disablePadding>
              <ListItemButton onClick={() => {
                navigate(`/room/${chat._id}`);
                window.location.reload(false)
              }}>
                <ListItemIcon>
                <Avatar>
                    {chat.name.substring(0,2).toUpperCase()}
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary={chat.name} />
              </ListItemButton>
            </ListItem>
          )):<><Typography sx={{pl: 2}}>No joined chats yet</Typography></>}
        </List>
        <Divider />
        <List>
          <ListItem key={"Profile"} disablePadding>
            <ListItemButton onClick={() => navigate("/profile")}>
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
      <Main open={open} sx={{ paddingLeft: 1, paddingRight: 0, pb: 0 }}>
        <DrawerHeader />
        <Events events={messages} roomId={roomId} user={user}/>
        <ConnectionManager />
        <MyForm roomId={roomId}/>
      </Main>
      <div>
        <Dialog open={openCreate} onClose={handleClose}>
          <DialogTitle>Create room</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To create a new room, please enter it's name here. And optionally
              logo
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              placeholder="Room name"
              fullWidth
              type="text"
              variant="standard"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogActions>
        </Dialog>
        </div>
        <div>
        <Dialog open={openJoin} onClose={handleToggleJoin}>
          <DialogTitle>Join to room</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To join to room, please enter it's access code here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              placeholder="Access code"
              fullWidth
              type="text"
              variant="standard"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleToggleJoin}>Cancel</Button>
            <Button onClick={handleJoin}>Join</Button>
          </DialogActions>
        </Dialog>
        </div>
        <div>
          <Dialog
            open={openCode}
            TransitionComponent={"test"}
            keepMounted
            onClose={handleCloseCode}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Access code to room: "+room}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {code}
              </DialogContentText>
              <Divider />
              <DialogContentText id="alert-dialog-slide-description">
                https://chat.saganowski.ovh/room/{code}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCode}>Close</Button>
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
