import React, { useState } from "react";
import { Paper, Stack, TextField, FormControl, Select, MenuItem, Button } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import AdminLayout from "../../components/layout/AdminLayout";
import { server } from "../../constants/config";

const StoryManagement = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("updates");

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating Story...");
    setLoading(true);

    const formData = new FormData();
    formData.append("attach", file);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("link", link);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(`${server}/api/v1/admin/story`, formData, config);
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Stack alignItems={"center"} marginBlockStart={"20vh"}>
        <Paper elevation={3} style={{ width: "25rem", height: "auto", textAlign: "center" }}>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              label="Description"
              margin="normal"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={1}
              maxRows={10}
            />
            <FormControl fullWidth>
              <Select
                value={type}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Select Type" }}
              >
                <MenuItem value="updates">unimedia Updates</MenuItem>
                <MenuItem value="others">Others</MenuItem>
                <MenuItem value="ad">Ad</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              fullWidth
              label="Link"
              margin="normal"
              variant="outlined"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <input type="file" onChange={handleFileChange} aria-label="story file" accept="*/*" />
            <Button type="submit" disabled={loading}>
              Create Story
            </Button>
          </form>
        </Paper>
      </Stack>
    </AdminLayout>
  );
};

export default StoryManagement;
