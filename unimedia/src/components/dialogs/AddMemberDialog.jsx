import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import UserItem from "../shared/UserItem";
import {
  useAddGroupMembersMutation,
  useLazyFindUsersQuery,
} from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";
const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();
  const search = useInputValidation("");
  const { isAddMember } = useSelector((state) => state.misc);
  const [searchUser] =  useLazyFindUsersQuery();
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );
  const [searchmembers, setsearchMembers] = useState([]);
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      let name=search.value;
      let chatid=chatId;
      searchUser({name,chatid})
        .then(({ data }) => setsearchMembers(data.users))
        .catch((e) => console.log(e));
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };
  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };
  return (
    <Dialog open={isAddMember} onClose={closeHandler} style={{borderRadius:"2rem"}}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Stack spacing={"1rem"}>
          {searchmembers?.map((i) => (
            <UserItem
              key={i._id}
              user={i}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}
            />
          ))}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMembers}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
