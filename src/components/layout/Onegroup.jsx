import React, { useState, useEffect } from "react";
import { server } from "../../constants/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Paper,
  Typography,
  Stack,
  Box,
  Button,
  Dialog,
  TextField,
} from "@mui/material";
import { useInputValidation } from "6pp";
const Onegroup = () => {
  const [deta, setDeta] = useState(null);
  const [jgrp, setJgrp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const navigate = useNavigate();
  const name = useInputValidation("");
  const studentId = useInputValidation("");
  const checkViewportWidth = () => {
    const viewportWidth = window.innerWidth;
    setIsMobile(viewportWidth <= 500);
    setIsMac(viewportWidth >= 800 && viewportWidth <= 1350);
  };
  useEffect(() => {
    checkViewportWidth();
    window.addEventListener("resize", checkViewportWidth);
    return () => {
      window.removeEventListener("resize", checkViewportWidth);
    };
  }, []);
  const closehandler = () => {
    setJgrp(false);
  };
  const seeall = () => {
    navigate("/group");
  };
  const joingrp = () => {
    setJgrp(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/user/getgroup`);
        setDeta(data.a);
      } catch (error) {
        console.error("Error fetching group", error);
      }
    };
    fetchData();
  }, []);
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
          groupname: deta.name,
          chatid: deta._id,
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
      <Paper
        elevation={3}
        sx={{
          width: "21rem",
          height: "20rem",
          borderRadius: "1rem",
          padding: "1rem",
          marginTop:"2rem",
          position:"relative",
          left:"-1rem",
          ...(isMac && {
            position:"relative",
            left:"-2.5rem",
            margin:"0.1rem",
            padding:"0.2rem"
          }),
          ...(isMobile && {
            width: "18rem",
          }),
        }}
      >
        <Stack direction={"row"} style={{ justifyContent: "space-between" }}>
          <Typography
            color={"blue"}
            sx={{ fontWeight: "bold", padding: "1rem" }}
          >
            {deta && deta.name
              ? `${deta.name.charAt(0).toUpperCase()}${deta.name.slice(1)}`
              : "Loading..."}
          </Typography>
          <Button onClick={seeall}>See All</Button>
        </Stack>
        <Box
          style={{
            width: "100%",
            height: "70%",
            overflow: "hidden",
          }}
        >
          {deta && deta.url && (
            <img
              src={deta.url}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              alt="Event"
            />
          )}
        </Box>
        <Stack style={{ alignItems: "center" }}>
          <Button onClick={joingrp}>Join Group</Button>
        </Stack>
      </Paper>
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
    </>
  );
};

export default Onegroup;
