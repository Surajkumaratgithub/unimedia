import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Button,
  DialogTitle,
  InputAdornment,
  List,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useLazySearchPostQuery } from "../../redux/api/api";
import toast from "react-hot-toast";
import { server } from "../../constants/config";
import axios from "axios";
import moment from "moment";
const PinpostManagement = () => {
  const [searchPost] = useLazySearchPostQuery();

  const search = useInputValidation("");

  const [posts, setPosts] = useState([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchPost(search.value)
        .then(({ data }) => {
          if (Array.isArray(data.posts)) {
            setPosts(data.posts);
          } else {
            setPosts([]);
          }
        })
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const unpin = async (i) => {
    const toastId = toast.loading("unpinning Post...");
    setIsLoading(true);
    const postid = i._id;
    try {
      const { data } = await axios.get(
        `${server}/api/v1/admin/unpinpost?postid=${postid}`,
        config
      );
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something Went Wrong",
        {
          id: toastId,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pin = async (i) => {
    const postid = i._id;
    const toastId = toast.loading("Pinning Post...");
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${server}/api/v1/admin/pinpost?postid=${postid}`,
        config
      );
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something Went Wrong",
        {
          id: toastId,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find Post by user name</DialogTitle>
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
            {Array.isArray(posts) && posts.map((i) => (
              <Paper elevation={3} style={{ marginTop: "1rem" }} key={i._id}>
                <Stack
                  direction={"row"}
                  gap={"2rem"}
                  style={{
                    width: "auto",
                    alignItems: "center",
                    marginInlineStart: "1.5rem",
                  }}
                >
                  <Typography>{i.name}</Typography>
                  <Typography>{i.creatorid}</Typography>
                  <Typography>{moment(i.createdAt).format("DD/MM/YYYY")}</Typography>
                  {i.ispinned !== undefined ? (
                    i.ispinned ? (
                      <Button
                        color="error"
                        onClick={() => unpin(i)}
                        disabled={loading}
                      >
                        unpin
                      </Button>
                    ) : (
                      <Button onClick={() => pin(i)} disabled={loading}>
                        pin
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

export default PinpostManagement;
