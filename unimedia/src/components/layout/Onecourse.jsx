import { Paper, Stack, Typography, Box, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../constants/config";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Onecourse = () => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const checkViewportWidth = () => {
    const viewportWidth = window.innerWidth;
    setIsMobile(viewportWidth <= 500);
  };
  useEffect(() => {
    checkViewportWidth();
    window.addEventListener("resize", checkViewportWidth);
    return () => {
      window.removeEventListener("resize", checkViewportWidth);
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
        const { data } = await axios.get(`${server}/api/v1/user/singlecourse`, config);
        setValue(data.course);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const enroll = (name) => {
    navigate(`/course/${name}`);
  };
  const seeall = () => {
    navigate(`/courses`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading course: {error.message}</Typography>;

  return (
    <Stack direction={"row"}>
      {value && value.length > 0 ? (
        <Stack direction={"row"} marginTop={"2rem"} key={value[0]._id}>
          <Paper
            elevation={4}
            style={{
              width: "23rem",
              height: "auto",
              borderRadius: "1rem",
              position:"relative",
              left:"-1rem",
              ...(isMobile && {
                width: "18rem",
              }),
            }}
          ><Stack
          direction={"row"}
          style={{ justifyContent: "space-between", padding: "1rem" }}
        >
            <Typography
              color={"blue"}
              sx={{ fontWeight: "bold", padding: "1rem" }}
            >
              {value[0].name && `${value[0].name.charAt(0).toUpperCase()}${value[0].name.slice(1)}`}
            </Typography>
            <Button onClick={seeall}>See All</Button>
            </Stack>
            <Stack style={{ alignItems: "center" }}>
              {value[0].Image && value[0].Image[0] && (
                <Box width={"80%"} height={"10rem"}>
                  <a
                    href={value[0].Image[0].url}
                    target="_blank"
                    download
                    style={{ color: "black" }}
                  >
                    <img src={value[0].Image[0].url} alt="Course Img" style={{ width: '100%', height: '100%' }} />
                  </a>
                </Box>
              )}
            </Stack>
            <Stack padding={"1rem"} gap={"0.2rem"}>
              <Typography>Course Type: {value[0].type}</Typography>
              <Typography>{value[0].description}</Typography>
              <Typography>Fee: {value[0].fee}</Typography>
              <Typography variant="body1">
                Start Date: {moment(value[0].startDate).format("DD/MM/YYYY")}
              </Typography>
              <Typography variant="body1">
                End Date: {moment(value[0].endDate).format("DD/MM/YYYY")}
              </Typography>
              {value[0].instructor && (
                <Typography>Instructor: {value[0].instructor}</Typography>
              )}
              <Button onClick={() => enroll(value[0].name)}>Enroll Now</Button>
            </Stack>
          </Paper>
        </Stack>
      ) : (
        <Typography>No Courses Available</Typography>
      )}
    </Stack>
  );
};

export default Onecourse;
