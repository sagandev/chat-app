import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { socket } from "../socket";
import {Room} from '../utils/api';
import Grid from "@mui/material/Grid";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AttachFileIcon from "@mui/icons-material/AttachFile";
export function MyForm({roomId}) {
  const [value, setValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [valid, setValid] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (roomId === undefined) return;
    else {
      Room(roomId).then((data) => {
        console.log(data.data.valid)
        setValid(data.data.valid)
      })
    }
  }, [])
  function onSubmit(event) {
    event.preventDefault();
    if(value.length < 1) return;
    setIsLoading(true);
    const v = {
      message: value,
      user: user,
      room: roomId
    };
    socket.timeout(500).emit("new-message", v, () => {
      setIsLoading(false);
    });
    setValue("")
  }
  const [ShowEmojiBar, setShowEmojiBar] = useState(false);
  if(valid === false || !roomId) return null;
  else
  return (
    <>
      {ShowEmojiBar ? <EmojiPicker theme="dark" /> : null}
      <form onSubmit={onSubmit}>
        <Grid container spacing={1} justifyContent="center" sx={{pb:1,pt:1, bgcolor: "rgba(255, 255, 255, 0.09)"}}>
          <Grid item xs={0}>
            <Tooltip
              title="Delete"
              sx={{
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
                ml: 1,
              }}
              onClick={() => setShowEmojiBar(!ShowEmojiBar)}
            >
              <IconButton>
                <EmojiEmotionsIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={7} sm={8} md={10}>
            <TextField
              hiddenLabel
              id="outlined-multiline-flexible"
              label="Message"
              multiline
              maxRows={1}
              size="small"
              sx={{ width: "100%" }}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Grid>
          <Grid item xs={0} sm={2} md={1}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={value ? false:true}
              sx={{ width: "100%", height: "100%" }}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
