import React, { useState, useEffect } from "react";
import { useAsyncEffect } from "use-async-effect";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Messages } from "../utils/api";
import axios from "axios";
export function Events({ events }) {
  const [messages, setMessages] = useState();
  useEffect(() => {
    Messages().then(data =>{
      setMessages(data.data);
    })
  }, []);
  console.log(messages);
  const user = JSON.parse(localStorage.getItem("user"));
  if (!messages) return <h1>Loading</h1>;
  else
    return (
      <>
        <List sx={{ width: "100%", height: "85vh", overflow: "auto" }}>
          {messages.map(message => (
            <ListItem
              alignItems={
                message.author.username === user.username ? "flex-end" : "flex-start"
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: message.author.avatarColor }}>
                  {message.author.avatar.toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={message.author.username}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    ></Typography>
                    {message.message}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
          {events.map(event => (
            <ListItem
              alignItems={
                event.sender.id === user.id ? "flex-end" : "flex-start"
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: event.sender.avatarColor }}>
                  {event.sender.avatar.toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={event.sender.username}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    ></Typography>
                    {event.value}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </>
    );
}
