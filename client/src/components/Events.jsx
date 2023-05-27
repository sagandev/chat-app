import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { socket } from "../socket";
import { styled } from "@mui/material/styles";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export function Events({ events, roomId }) {
  const [messages, setMessages] = useState();
  const listRef = useRef(null);
  useEffect(() => {
    if (roomId === undefined) return;
    else {
      socket.emit("chat-history", roomId);
      socket.on("chat-empty", (msg) => {});
      socket.on("chat-history-res", (messages) => {
        setMessages(messages);
      });
    }
  }, []);
  if (!messages)
    return (
      <>
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            px: 0,
            maxWidth: "100%",
            height: "85vh",
          }}
          className="scrollBar"
        >
        </Box>
      </>
    );
  else
    return (
      <>
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            px: 0,
            maxWidth: "100%",
            height: "85vh",
          }}
          className="scrollBar"
        >
          {messages.map((message) => (
            <>
              <Item
                sx={{
                  my: 1,
                  p: 1,
                  width: "fit-content",
                  maxWidth: "60%",
                  height: "fit-content",
                  borderRadius: 2,
                }}
              >
                <Stack spacing={1} direction="row" alignItems="start">
                  <Avatar
                    sx={{
                      bgcolor: "blue",

                      /*message.author.avatarColor 8*/
                    }}
                  >
                    {message.author.name.toUpperCase().slice(0, 2)}
                  </Avatar>
                  <Stack direction="column">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography align="left" color="rgba(255, 255, 255, 0.5)">
                        {message.author.name}
                      </Typography>
                      <Typography
                        align="left"
                        color="rgba(255, 255, 255, 0.2)"
                        sx={{ fontSize: 12 }}
                      >
                        {message.date}
                      </Typography>
                    </Stack>
                    <Typography align="left" sx={{ wordWrap: "break-word" }}>
                      {message.message}
                    </Typography>
                  </Stack>
                </Stack>
              </Item>
            </>
          ))}
          {events.map((event) => (
            <Item
              sx={{
                my: 1,
                p: 1,
                width: "fit-content",
                maxWidth: "60%",
                height: "fit-content",
                borderRadius: 2,
              }}
            >
              <Stack spacing={1} direction="row" alignItems="center">
                <Avatar sx={{ bgcolor: "blue" /*event.sender.avatarColor*/ }}>
                  {event.author.name.toUpperCase().slice(0, 2)}
                </Avatar>
                <Stack direction="column">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography align="left" color="rgba(255, 255, 255, 0.5)">
                      {event.author.name}
                    </Typography>
                    <Typography
                      align="left"
                      color="rgba(255, 255, 255, 0.2)"
                      sx={{ fontSize: 12 }}
                    >
                      {event.date}
                    </Typography>
                  </Stack>
                  <Typography align="left" sx={{ wordWrap: "break-word" }}>
                    {event.message}
                  </Typography>
                </Stack>
              </Stack>
            </Item>
          ))}
          <div id="l" ref={listRef}></div>
        </Box>
      </>
    );
}
