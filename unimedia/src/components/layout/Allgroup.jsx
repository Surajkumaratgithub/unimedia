import React, { useState, useEffect } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import { useLazySearchGroupQuery } from "../../redux/api/api";
import {
  InputAdornment,
  Stack,
  TextField,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
} from "@mui/material";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import axios from "axios";

const Allgroup = () => {
  const search = useInputValidation("");
  const [groups, setGroups] = useState([]);
  const [groupname, setGroupname] = useState("");
  const [chatid, setChatid] = useState(null);
  const [jgrp, setJgrp] = useState(false);
  const [searchGroup] = useLazySearchGroupQuery();
  const name = useInputValidation("");
  const studentId = useInputValidation("");

  const closehandler = () => {
    setGroupname("");
    setChatid(null);
    setJgrp(false);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchGroup(search.value)
        .then(({ data }) => setGroups(data.group))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value, searchGroup]);

  const joinGroup = (grpid, grpname) => {
    setGroupname(grpname);
    setChatid(grpid);
    setJgrp(true);
  };

  const subreq = async () => {
    const toastId = toast.loading("Sending Request...");
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/request`,
        {
          name: name.value,
          studentId: studentId.value,
          groupname,
          chatid,
        },
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
    <>
      <Stack direction={"row"}>
        <Stack p={"2rem"} direction={"column"} width={"25rem"}>
          <TextField
            label="Search Groups"
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
        </Stack>
        <Stack>
          {groups.map((group) => (
            <Paper
              key={group._id}
              elevation={3}
              style={{ width: "25vw", height: "auto", marginBottom: "1rem" }}
            >
              <Stack direction={"row"} gap={"4rem"}>
                <Typography
                  color={"blue"}
                  sx={{ fontWeight: "bold", padding: "1rem" }}
                >
                  {group.name
                    ? `${group.name.charAt(0).toUpperCase()}${group.name.slice(
                        1
                      )}`
                    : "Loading..."}
                </Typography>
              </Stack>
              <Box style={{ width: "100%", height: "30%", overflow: "hidden" }}>
                {group.Image && group.Image.url && (
                  <img
                    src={group.Image.url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt="Group"
                  />
                )}
              </Box>
              <Button onClick={() => joinGroup(group._id, group.name)}>
                Join Group
              </Button>
            </Paper>
          ))}
        </Stack>
        <Stack>
          {jgrp && (
            <Dialog
              open={jgrp}
              onClose={closehandler}
              style={{ borderRadius: "2rem" }}
            >
              <Stack p={"2rem"} width={"30rem"} spacing={"2rem"}>
                <Typography>Join Group</Typography>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="StudentId"
                  margin="normal"
                  variant="outlined"
                  value={studentId.value}
                  onChange={studentId.changeHandler}
                />
                <Button onClick={subreq}>Submit Request</Button>
              </Stack>
            </Dialog>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default Allgroup;
