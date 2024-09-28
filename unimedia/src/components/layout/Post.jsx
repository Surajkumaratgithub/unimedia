import { Paper, Stack, Pagination, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../constants/config";
import { fileFormat } from "../../lib/features";
import RenderPost from "../shared/RenderPost";

const Post = () => {
  const [post, setPost] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);

  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const { data } = await axios.get(
          `${server}/api/v1/user/getpost?page=${page}`,
          config
        );
        setPost(data.paginatedPosts);
        setCount(Math.ceil(data.totalPosts / 2));
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
    fetchData();
  }, [page]);

  return (
    <>
      <Stack direction={"row"} padding={"1.5rem"}>
        {post.length > 0 ? (
          post.map((i) => (
            <Paper
              key={i._id}
              elevation={5}
              style={{
                width: "12rem",
                height: "20rem",
                margin: "1rem",
                borderRadius: "1rem",
              }}
            >
              <Stack>
                <Typography
                  color={"blue"}
                  sx={{ fontWeight: "bold", padding: "1rem" }}
                >{`${i.name.charAt(0).toUpperCase()}${i.name.slice(1)}`}</Typography>
                <Stack style={{ alignItems: "center" }}>
                  <Box width={"10rem"} height={"10rem"}>
                    <a
                      href={i.attachments[1]}
                      target="_blank"
                      download
                      style={{
                        color: "black",
                      }}
                    >
                      {RenderPost(fileFormat(i.attachments[1]), i.attachments[1])}
                    </a>
                  </Box>
                </Stack>
                <Typography>{i.content}</Typography>
              </Stack>
            </Paper>
          ))
        ) : (
          <Typography>No Posts Available</Typography>
        )}
      </Stack>
      <Stack alignItems={"center"}>
        <Pagination count={count} page={page} onChange={handleChange} />
      </Stack>
    </>
  );
};

export default Post;
