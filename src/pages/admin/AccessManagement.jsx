import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  DialogTitle,
  InputAdornment,
  List,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { transformImage } from "../../lib/features";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {useLazyGetUsersQuery} from "../../redux/api/api";
import toast from "react-hot-toast";
import { server } from "../../constants/config";
import axios from "axios";
const AccessManagement = () => {
  const [searchUser] = useLazyGetUsersQuery();

  const search = useInputValidation("");

  const [users, setUsers] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [checkedUsers, setCheckedUsers] = useState({});
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  useEffect(() => {
    const checkUsers = async () => {
      const results = {};
      for (const user of users) {
        const existsInDifferentDB = await checkUserInDifferentDatabase(
          user._id
        );
        results[user._id] = existsInDifferentDB;
      }
      setCheckedUsers(results);
    };

    checkUsers();
  }, [users]);
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const checkUserInDifferentDatabase = async (userid) => {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/admin/find`,
        {userid},
      );
      if(data.a){return true;}
      else{return false;}
    } catch (error) {
      console.error("Error checking user in different database:", error);
      return false;
    }
  };
const denyaccess=async(i)=>{
  const toastId = toast.loading("Denying Access...");
    setIsLoading(true);
    const userid = i._id;
    try {
      const { data } = await axios.post(
        `${server}/api/v1/admin/removeaccess`,
        { userid },
        config
      );
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
};
  const grantaccess = async (i) => {
    const name = i.name;
    const userid = i._id;
    const toastId = toast.loading("Granting Access...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/v1/admin/access`,
        { name, userid },
        config
      );
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AdminLayout>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
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
        <List>
            <Stack>
              {users.map((i) => (
                <Paper elevation={3} style={{marginTop:"1rem"}}key={i._id}>
                <Stack direction={"row"} gap={"2rem"} style={{width:"2rem",alignItems:"center",marginInlineStart:"1.5rem"}}>
                  <Avatar src={transformImage(i.avatar)} />
                  <Typography>{i.name}</Typography>
                  <Typography>{i.studentId}</Typography>
                  {checkedUsers[i._id] !== undefined ? (
                    checkedUsers[i._id] ? (
                      <Button color="error" onClick={() => denyaccess(i)} disabled={loading}>
                      Deny Access
                      </Button>
                    ) : (
                      <Button  onClick={() => grantaccess(i)} disabled={loading}>
                        Grant Access
                      </Button>
                    )
                  ) : (
                    <Typography>Loading...</Typography>
                  )}
                </Stack>
                </Paper>
              ))}
            </Stack>
        </List>
      </Stack>
    </AdminLayout>
  );
};
export default AccessManagement;
