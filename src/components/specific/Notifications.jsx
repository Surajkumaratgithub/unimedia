import {
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../constants/config";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
  useAddGroupMembersMutation,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [addMembers] = useAsyncMutation(useAddGroupMembersMutation);
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);
  const allow = async({ chatid, sender,_id }) => {
    addMembers("Adding Member...", { members: [sender._id], chatId:chatid });
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.get(
        `${server}/api/v1/user/delrequest?deny=${_id}`,
        config
      );
    } catch (error) {
      console.error(error);
    }
  };
  const deny = async ({_id}) => {
    const toastId = toast.loading("Rejecting Request...");
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.get(
        `${server}/api/v1/user/delrequest?deny=${_id}`,
        config
      );
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    }
  };
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map(
                ({ sender, _id, isgroup, studentId, chatid, groupname }) =>
                  isgroup ? (
                    <div key={_id}>
                      <Stack
                        alignItems={"center"}
                        spacing={"1rem"}
                        width={"100%"}
                        height={"auto"}
                      >
                        <Typography variant="body1">
                          {`${sender.name} wants to join ${groupname} group.`}
                        </Typography>
                        <Typography>Student ID :{studentId}</Typography>
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                        >
                          <Button onClick={() => allow({ chatid, sender,_id })}>
                            Allow
                          </Button>
                          <Button onClick={() => deny({ _id })} color="error">
                            Deny
                          </Button>
                        </Stack>
                      </Stack>
                    </div>
                  ) : (
                    <div key={_id}>
                      <ListItem>
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          spacing={"1rem"}
                          width={"100%"}
                          height={"auto"}
                        >
                          <Typography variant="body1">
                            {`${sender.name} sent you a friend request.`}
                          </Typography>

                          <Stack
                            direction={{
                              xs: "column",
                              sm: "row",
                            }}
                          >
                            <Button
                              onClick={() =>
                                friendRequestHandler({ _id, accept: true })
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              color="error"
                              onClick={() =>
                                friendRequestHandler({ _id, accept: false })
                              }
                            >
                              Reject
                            </Button>
                          </Stack>
                        </Stack>
                      </ListItem>
                    </div>
                  )
              )
            ) : (
              <Typography textAlign={"center"}>0 notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

export default Notifications;
