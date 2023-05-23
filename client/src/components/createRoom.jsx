import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
export function CreateRoomDialog({ room, setRoom, handleCreate }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openCreate, setOpenCreate] = useState(false);
  const handleClose = () => {
    setOpenCreate(false);
  };

  return (
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
  );
}
