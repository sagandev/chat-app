import React, { useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { socket } from "../socket";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { UserContext } from "../utils/context/user";
export function MyForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    console.log(user);
    const v = {
      value: value,
      sender: user,
    };
    socket.timeout(100).emit("chat message", v, () => {
      setIsLoading(false);
    });
  }
  const [ShowEmojiBar, setShowEmojiBar] = useState(false);

  return (
    <>
      {ShowEmojiBar ? <EmojiPicker theme="dark" /> : null}
      <form onSubmit={onSubmit}>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={0}>
            <Tooltip
              title="AttachFile"
              sx={{
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
              }}
              onClick={() => setShowEmojiBar(!ShowEmojiBar)}
            >
              <IconButton>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
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
          <Grid item xs={4.5} sm={9} md={10}>
            <TextField
              hiddenLabel
              id="filled-hidden-label-small"
              variant="outlined"
              placeholder="message..."
              size="small"
              sx={{ width: "100%" }}
              onChange={(e) => setValue(e.target.value)}
            />
          </Grid>
          <Grid item xs={0} sm={1} md={1}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={isLoading}
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
