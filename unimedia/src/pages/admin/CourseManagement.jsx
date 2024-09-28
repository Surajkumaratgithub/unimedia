import React, { useState } from "react";
import { useFileHandler, useInputValidation } from "6pp";
import {
  Paper,
  Stack,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import { server } from "../../constants/config";
import axios from "axios";
const CourseManagement = () => {
  const [loading, setIsLoading] = useState(false);
  const name = useInputValidation("");
  const description = useInputValidation("");
  const fee = useInputValidation("");
  const instructor = useInputValidation("");
  const startDate = useInputValidation("");
  const endDate = useInputValidation("");
  const img = useFileHandler("single");
  const [type, setType] = useState("MCQ");
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleevent = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating Course...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("img", img.file);
    formData.append("name", name.value);
    formData.append("type", type);
    formData.append("description", description.value);
    formData.append("instructor", instructor.value);
    formData.append("startDate", startDate.value);
    formData.append("endDate", endDate.value);
    formData.append("fee", fee.value);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/admin/courses`,
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AdminLayout>
      <Stack alignItems={"center"}>
        <Paper
          elevation={3}
          style={{ width: "27rem", height: "43rem", textAlign: "center",marginTop:"2.5rem",padding:"3rem" }}
        >
          <form onSubmit={handleevent}>
            <TextField
              required
              fullWidth
              label="Course Name"
              margin="normal"
              variant="outlined"
              value={name.value}
              onChange={name.changeHandler}
            />
            <TextField
              required
              fullWidth
              label="Description"
              margin="normal"
              variant="outlined"
              value={description.value}
              onChange={description.changeHandler}
            />
            <TextField
              fullWidth
              label="fee"
              margin="normal"
              variant="outlined"
              value={fee.value}
              onChange={fee.changeHandler}
            />
            <TextField
              required
              fullWidth
              type="date"
              label="startDate"
              margin="normal"
              variant="outlined"
              value={startDate.value}
              onChange={startDate.changeHandler}
            />
            <TextField
              required
              fullWidth
              type="date"
              label="EndDate"
              margin="normal"
              variant="outlined"
              value={endDate.value}
              onChange={endDate.changeHandler}
            />
            <FormControl fullWidth>
              <Select
                value={type}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Select Type" }}
              >
                <MenuItem value="MCQ">MCQ</MenuItem>
                <MenuItem value="video">VideoCourses</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Instructor name"
              margin="normal"
              variant="outlined"
              value={instructor.value}
              onChange={instructor.changeHandler}
            />
            <input
              type="file"
              accept="image/*"
              onChange={img.changeHandler}
              aria-label="event image"
            ></input>
            <Button type="submit" disabled={loading}>
              Create Course
            </Button>
          </form>
        </Paper>
      </Stack>
    </AdminLayout>
  );
};

export default CourseManagement;
