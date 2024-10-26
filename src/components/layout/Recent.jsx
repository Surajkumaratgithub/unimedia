import { Paper, Stack, Pagination, Typography, Box,Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../constants/config";
import { fileFormat } from "../../lib/features";
import RenderPost from "../shared/RenderPost";
import moment from "moment";
const Recent = () => {
  const [post, setPost] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);
  const [isMobile, setIsMobile] = useState(false);
  const [dir,setDir]=useState("row");
  const handleChange = (event, value) => {
    setPage(value);
  };
  const checkViewportWidth = () => {
    const viewportWidth = window.innerWidth;
    setIsMobile(viewportWidth <= 500);
    if(viewportWidth<=500){setDir("column")};
  };
  useEffect(() => {
    checkViewportWidth();
    window.addEventListener('resize', checkViewportWidth);
    return () => {
      window.removeEventListener('resize', checkViewportWidth);
    };
  }, []);
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
      <Stack direction={dir} padding={"1.5rem"}>
        {post.length > 0 ? (
          post.map((i) => (
            <Paper
              key={i._id}
              elevation={5}
              style={{
                width: "70%",
                height: "22rem",
                margin: "1rem",
                borderRadius: "1rem",
                ...(isMobile && {
                  width: "100%",
                  height: "20rem",
                  marginBottom:"1.5rem",
                  margin:"0rem",
                }),
              }}
            >
              <Stack style={{gap:"1rem"}}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-around"}
                  textAlign={"center"}
                >
                  <Stack
                    direction={"row"}
                    sx={{ gap: "1rem" }}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Avatar src={i.avatar} sx={{ width: "30%" }} />
                    <Typography
                      color={"blue"}
                      sx={{
                        fontWeight: "bold",
                        width: "100%",
                        whiteSpace: "nowrap",
                      }}
                    >{`${i.name.charAt(0).toUpperCase()}${i.name.slice(
                      1
                    )}`}</Typography>
                  </Stack>
                  <Typography
                    style={{ fontSize: "0.7rem",marginTop:"1rem" }}
                  >
                    {moment(i.createdAt).fromNow()}
                  </Typography>
                </Stack>
                <Stack style={{ alignItems: "center" }}>
                  <Box width={"100%"} height={"10rem"}>
                    <a
                      href={i.attachments.url}
                      target="_blank"
                      download
                      style={{
                        color: "black",
                      }}
                    >
                      {RenderPost(
                        fileFormat(i.attachments.url),
                        i.attachments.url
                      )}
                    </a>
                  </Box>
                </Stack>
                <Typography sx={{ padding: "1rem" }}>{i.content}</Typography>
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

export default Recent;