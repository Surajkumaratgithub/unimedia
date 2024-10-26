import { Paper, Stack, Pagination, Typography, Box ,Button} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../constants/config";
import { fileFormat } from "../lib/features";
import RenderPost from "../components/shared/RenderPost";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const Courses = () => {
  const navigate=useNavigate();
  const [course, setCourse] = useState([]);
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
          `${server}/api/v1/user/getcourse`,
          config
        );
        setCourse(data.courses);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
    fetchData();
  }, []);
  const enroll=(name)=>{navigate("/course/name")}
  return (
    <>
      <Stack direction={"row"} display={"flex"}>
        {course.length > 0 ? (
          course.map((i) => (
            <>
              <Stack direction={"row"} marginTop={"2rem"} >
                <Paper
                  elevation={4}
                  key={i._id}
                  style={{
                    width: "25rem",
                    height: "auto",
                    borderRadius: "2rem",
                    marginTop: "3rem",
                    margin: "1rem",
                  }}
                >
                  <Typography
                    color={"blue"}
                    sx={{ fontWeight: "bold", padding: "1rem" }}
                  >{`${i.name.charAt(0).toUpperCase()}${i.name.slice(
                    1
                  )}`}</Typography>
                  <Stack style={{ alignItems: "center" }}>
                    <Box width={"23rem"} height={"10rem"}>
                      <a
                        href={i.Image[0].url}
                        target="_blank"
                        download
                        style={{
                          color: "black",
                        }}
                      >
                        {RenderPost(fileFormat(i.Image[0].url), i.Image[0].url)}
                      </a>
                    </Box>
                  </Stack>
                  <Stack padding={"1rem"} gap={"0.2rem"}>
                    <Typography>Course Type: {i.type}</Typography>
                    <Typography>{i.description}</Typography>
                    <Typography>Fee: {i.fee}</Typography>
                    <Typography variant="body1">
                      Start Date: {moment(i.startDate).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body1">
                      End Date: {moment(i.endDate).format("DD/MM/YYYY")}
                    </Typography>
                    {i.instructor && (
                      <Typography>Instructor: {i.instructor}</Typography>
                    )}
                    <Button onClick={()=>enroll(i.name)}>Enroll Now</Button>
                  </Stack>
                </Paper>
              </Stack>
            </>
          ))
        ) : (
          <>
            <Typography>No Courses Available</Typography>
          </>
        )}
      </Stack>
    </>
  );
};

export default Courses;