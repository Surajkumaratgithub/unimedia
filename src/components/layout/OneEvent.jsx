import React, { useState, useEffect } from "react";
import { server } from "../../constants/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Paper, Typography, Stack, Box, Button } from "@mui/material";
import moment from "moment";

const OneEvent = () => {
  const [event, setEvent] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const seeall = () => {
    navigate("/event");
  };
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
      try {
        const { data } = await axios.get(`${server}/api/v1/user/getevent`);
        setEvent(data.event[0]);
      } catch (error) {
        console.error("Error fetching event", error);
      }
    };
    fetchData();
  }, []);
  return (
    <Stack style={{ alignItems: "center", justifyContent: "center" }}>
      {event && (
        <Paper
          elevation={3} 
          sx={{
            width: "21.5rem",
            height: "auto",
            alignItems: "center",
            borderRadius: "1rem",
            marginBottom: "1rem",
            ...(isMobile && {
              width: "18rem",
            }),
          }}
        >
          <Stack style={{ height: "100%" }}>
            {event.name && (
              <Stack
                direction={"row"}
                style={{ justifyContent: "space-between", padding: "1rem" }}
              >
                <Typography style={{ fontWeight: "bold",color:"blue" }}>
                  {event.name.toUpperCase()}
                </Typography>
                <Button onClick={seeall}>See All</Button>
              </Stack>
            )}
            {event.Image && (
              <Box
                style={{
                  width: "100%",
                  height: "30%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={event.Image.url}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt="Event"
                />
              </Box>
            )}
            <Box padding={"1rem"}>
              {event.description && (
                <Typography>{event.description}</Typography>
              )}
              {event.date && (
                <Typography variant="body1" style={{ fontWeight: "bold" }}>
                  {`Date: ${moment(event.date).format("DD/MM/YYYY")} Time: ${
                    event.time
                  }`}
                </Typography>
              )}

              <Typography
                variant="body1"
                style={{ fontWeight: "bold" }}
              >{`Fee: ${event.fee}`}</Typography>

              {event.organizer && (
                <Typography
                  variant="body1"
                  style={{ fontWeight: "bold" }}
                >{`Organizer: ${event.organizer}`}</Typography>
              )}
              {event.onlineDetails && (
                <a
                  href={event.onlineDetails}
                  style={{ textDecoration: "none" }}
                >
                  <Stack style={{ alignItems: "center" }}>
                    <Button>Register Now</Button>
                  </Stack>
                </a>
              )}
              {event.offlineDetails && (
                <Typography variant="body1">{`Venue: ${event.offlineDetails}`}</Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default OneEvent;
