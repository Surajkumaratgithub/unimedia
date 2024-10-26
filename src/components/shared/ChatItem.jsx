import React, { memo,useEffect, useState } from "react";
import { Link } from "../styles/StyledComponents";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useLocation } from 'react-router-dom';
import { transformImage } from "../../lib/features";
const ChatItem = ({
  avatar,
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const location = useLocation();
  const [green,setIsgreen]=useState(false);
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/chat/')) {
       setIsgreen(true);
    } else {
       setIsgreen(false);
    }
}, [location]);
  return (
    <Stack md={3} lg={3}>
      <Link
        sx={{
          padding: "0",
        }}
        to={`/chat/${_id}`}
        onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      >
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            backgroundColor: sameSender ? "black" : "unset",
            color: sameSender ? "white" : "unset",
            position: "relative",
            padding: "1rem",
          }}
        >
          <Avatar src={transformImage(avatar)}/>
          <Stack>
            <Typography>{name}</Typography>
            {newMessageAlert && (
              <Typography>{newMessageAlert.count} New Message</Typography>
            )}
          </Stack>

          {isOnline && green &&(
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
                position: "absolute",
                top: "50%",
                right: "1rem",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </motion.div>
      </Link>
    </Stack>
  );
};

export default memo(ChatItem);
