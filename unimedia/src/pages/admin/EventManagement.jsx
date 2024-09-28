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
const EventManagement = () => {
  const [loading, setIsLoading] = useState(false);
  const name = useInputValidation("");
  const description = useInputValidation("");
  const date = useInputValidation("");
  const onlineDetails = useInputValidation("");
  const offlineDetails = useInputValidation("");
  const fee = useInputValidation("");
  const organizer = useInputValidation("");
  const time = useInputValidation("");
  const img = useFileHandler("single");
  const [type, setType] = useState("Online");

  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleevent = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating Event...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("img", img.file);
    formData.append("name", name.value);
    formData.append("date", date.value);
    formData.append("type", type);
    formData.append("description", description.value);
    formData.append("onlineDetails", onlineDetails.value);
    formData.append("offlineDetails", offlineDetails.value);
    formData.append("fee", fee.value);
    formData.append("time", time.value);
    formData.append("organizer", organizer.value);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/admin/event`,
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
          style={{ width: "25rem", height: "50rem", textAlign: "center" }}
        >
          <form onSubmit={handleevent}>
            <TextField
              required
              fullWidth
              label="Event Name"
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
              margin="normal"
              variant="outlined"
              value={date.value}
              onChange={date.changeHandler}
            />
            <FormControl fullWidth>
              <Select
                value={type}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Select Type" }}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Link for online event"
              margin="normal"
              variant="outlined"
              value={onlineDetails.value}
              onChange={onlineDetails.changeHandler}
            />
            <TextField
              fullWidth
              label="venue for offline event"
              margin="normal"
              variant="outlined"
              value={offlineDetails.value}
              onChange={offlineDetails.changeHandler}
            />
            <TextField
              required
              fullWidth
              label="organizer"
              margin="normal"
              variant="outlined"
              value={organizer.value}
              onChange={organizer.changeHandler}
            />
            <TextField
              required
              fullWidth
              type="time"
              margin="normal"
              variant="outlined"
              value={time.value}
              onChange={time.changeHandler}
            />
            <input
              type="file"
              accept="image/*"
              onChange={img.changeHandler}
              aria-label="event image"
            ></input>
            <Button type="submit" disabled={loading}>
              Create Event
            </Button>
          </form>
        </Paper>
      </Stack>
    </AdminLayout>
  );
};

export default EventManagement;
