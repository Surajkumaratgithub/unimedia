import React,{useState,useEffect} from "react";
import { Paper, Stack, Typography, IconButton, TextField } from "@mui/material";
import { CurveButton, InputBox } from "../styles/StyledComponents";
import { useFileHandler, useInputValidation } from "6pp";
import { Attachment } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../../components/styles/StyledComponents";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { server } from "../../constants/config";
import axios from "axios";

const PostCreate = () => {
  const content = useInputValidation("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const attachments = useFileHandler("single", { accept: "*/*" });
  const { user } = useSelector((state) => state.auth);
  const name = user.name;
  const creatorid = user._id;
  const avatar = user.avatar.url;
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
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
  const post = async () => {
    if (!attachments.file) {
      toast.error("Attachment is required to create a post");
      return;
    }
    const toastId = toast.loading("Creating Post...");
    const formData = new FormData();
    formData.append("content", content.value);
    formData.append("name", name);
    formData.append("creatorid", creatorid);
    formData.append("attachments", attachments.file);
    formData.append("avatar", avatar);
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/createpost`,
        formData,
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
    <Paper
      elevation={4}
      sx={{
        width: "50rem",
        height: "10rem",
        marginLeft: "2.5rem",
        overflow:"hidden",
        borderRadius: "1rem",
        ...(isMobile && {
          width: "24rem",
          height: "8rem",
          position:"relative",
          left:"5rem"
        }),
        ...(isMac && {
          width:"46rem",
          marginLeft: "0.5rem",
        }),
      }}
    >
      <Stack direction={"column"}>
        <Typography color={"blue"} fontSize={"1.2rem"} padding={"1rem"}>
          Create Post
        </Typography>
        <Stack direction={"row"}>
          <TextField
            placeholder="Create new Post"
            sx={{
              width: "70%",
              height: "3rem",
              marginLeft: "2.5rem",
              ...(isMobile && {
                marginLeft:"-1rem"
              }),
              borderRadius: "1.5rem",
              border: "none",
              outline: "none",
              padding: "0 3rem",
              backgroundColor: "rgba(247,247,247,1)",
            }}
            value={content.value}
            onChange={content.changeHandler}
            multiline
            rows={1}
            InputProps={{
              sx: {
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            }}
          />
          <IconButton
            sx={{
              marginLeft: "1rem",
              marginRight: "0.5rem",
              padding: "0.5rem",
              width: "3rem",
              color: "white",
              bgcolor: "rgba(0,0,0,0.7)",
              ":hover": {
                bgcolor: "rgba(0,0,0,0.5)",
              },
            }}
            component="label"
          >
            <Attachment />
            <VisuallyHiddenInput
              type="file"
              onChange={attachments.changeHandler}
              accept="*/*"
            />
          </IconButton>
          <CurveButton
            sx={{
              height: "3rem",
              borderRadius: "1rem",
            }}
            onClick={post}
          >
            Post
          </CurveButton>
        </Stack>
        {attachments.file && (
          <Typography
            variant="body2"
            sx={{ marginTop: 1, marginLeft: "3rem", color: "blue" }}
          >
            Selected file: {attachments.file.name}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default PostCreate;
