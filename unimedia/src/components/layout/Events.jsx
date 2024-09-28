import React, { useState, useEffect } from "react";
import { Paper, Stack, Typography, Box, Link, Button } from "@mui/material";
import axios from "axios";
import { server } from "../../constants/config";
import moment from "moment";
const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const { data } = await axios.get(`${server}/api/v1/user/event`, config);
        setEvents(data.events);
      } catch (error) {
        setError("Error fetching events");
        console.error("Error fetching events", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : Array.isArray(events) && events.length > 0 ? (
        events.map((event) => (
          <Stack
            sx={{
              padding: "2rem",
              overflowY: "auto",
              maxHeight: "100vh",
              "::-webkit-scrollbar": {
                width: "8px",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
              },
              "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
              "::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
            }}
          >
            <EventMapping
              key={event._id}
              name={event.name}
              description={event.description}
              date={event.date}
              time={event.time}
              fee={event.fee}
              organizer={event.organizer}
              onlinedetails={event.onlineDetails}
              offlinedetails={event.offlineDetails}
              image={event.Image.url}
            />
          </Stack>
        ))
      ) : (
        <Typography>No events available</Typography>
      )}
    </>
  );
};

const EventMapping = ({
  name,
  description,
  date,
  time,
  fee,
  organizer,
  onlinedetails,
  offlinedetails,
  image,
}) => (
  <Stack style={{ alignItems: "center", justifyContent: "center" }}>
    <Paper
      elevation={3}
      style={{
        width: "22rem",
        height: "auto",
        alignItems: "center",
        borderRadius: "1.5rem",
        marginBottom: "1rem",
      }}
    >
      <Stack spacing={2} style={{ height: "100%" }}>
        <Typography style={{ fontWeight: "bold" }}>
          {name.toUpperCase()}
        </Typography>
        <Box
          style={{
            width: "100%",
            height: "30%",
            overflow: "hidden",
          }}
        >
          <img
            src={image}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="Event"
          />
        </Box>
        <Box>
          <Typography>{description}</Typography>
          <Typography variant="body1">
            {`Date: ${moment(date).format("DD/MM/YYYY")} Time: ${time}`}
          </Typography>
          <Typography variant="body1">{`Fee:${fee}`}</Typography>
          <Typography variant="body1">{`Organizer: ${organizer}`}</Typography>
          {onlinedetails && (
            <a href={onlinedetails} style={{ textDecoration: "none" }}>
              <Stack style={{ alignItems: "center" }}>
                <Button>Register Now</Button>
              </Stack>
            </a>
          )}
          {offlinedetails && (
            <Typography variant="body1">{`Venue: ${offlinedetails}`}</Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  </Stack>
);

export default Events;
