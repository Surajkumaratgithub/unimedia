import { Drawer, Grid, Skeleton, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setIsDrawer,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";
import Onegroup from "./Onegroup";
import OneEvent from "./OneEvent";
import Onecourse from "./Onecourse";
const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile,isDrawer } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));
    const handleDrawerClose = () => dispatch(setIsDrawer(false));
    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="auto"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={5}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
              overflowY: "auto",
              maxHeight: "100vh",
              "::-webkit-scrollbar": {
                width: "8px",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
              },
              "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
              "::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <Stack width={"100%"}>
                <ChatList
                  w="auto"
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              </Stack>
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>

          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              //bgcolor: "#788BFF",
              overflowX: "hidden",
              overflowY:"auto",
              justifyContent:"center",
              maxHeight: "100vh",
              "::-webkit-scrollbar": {
                width: "8px",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
              },
              "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
              "::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
            }}
          >
            <Typography
              style={{
                fontSize: "1.3rem",
                marginTop: "-1rem",
                fontWeight: "bold",
                color:"blue",
              }}
            >
              Events
            </Typography>
            <OneEvent />
            <Typography
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color:"blue",
              }}
            >
              Join Pages & Group
            </Typography>
            <Onegroup />
            <Typography
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color:"blue",
                marginTop:"1rem",
              }}
            >
              Courses
            </Typography>
            <Onecourse/>
          </Grid>
        </Grid>
        <Drawer
        anchor="right"
        open={isDrawer}
        onClose={handleDrawerClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <div
          style={{
            width: 300,
            padding: '2rem',
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: '100vh',
            "::-webkit-scrollbar": {
              width: "8px",
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
            },
            "::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
            "::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
          }}
        >
          <Typography
            style={{
              fontSize: "1.3rem",
              marginTop: "-1rem",
              fontWeight: "bold",
              color: "blue",
            }}
          >
            Events
          </Typography>
          <OneEvent />
          <Typography
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "blue",
            }}
          >
            Join Pages & Group
          </Typography>
          <Onegroup />
          <Typography
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "blue",
              marginTop: "1rem",
            }}
          >
            Courses
          </Typography>
          <Onecourse />
        </div>
      </Drawer>
      </>
    );
  };
};

export default AppLayout;
