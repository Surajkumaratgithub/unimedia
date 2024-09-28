import {
  Paper,
  Stack,
  Typography,
  Box,
  Button,
  Dialog,
  Pagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../constants/config";
import { fileFormat } from "../../lib/features";
import Renderstory from "../shared/Renderstory";

const Story = () => { 
  const [story, setStory] = useState([]);
  const [update, setUpdate] = useState(null);
  const [other, setOther] = useState(null);
  const [ad, setAd] = useState(null);
  const [type, setType] = useState("updates");
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(null);
  const [page, setPage] = useState(1);
  const [noMoreUpdates, setNoMoreUpdates] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [dir,setDir]=useState("row");
  const handleChange = (event, value) => {
    setPage(value);
  };
  const checkViewportWidth = () => {
    const viewportWidth = window.innerWidth;
    setIsMobile(viewportWidth <= 500);
    setIsMac(viewportWidth >= 800 && viewportWidth <= 1350);
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
          `${server}/api/v1/user/getstory`,
          config
        );
        setStory(data.newestDocuments);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (story.length > 0) {
      const updatesItem = story.find((item) => item.type === "updates");
      const othersItem = story.find((item) => item.type === "others");
      const adItem = story.find((item) => item.type === "ad");

      setUpdate(updatesItem);
      setOther(othersItem);
      setAd(adItem);
    }
  }, [story]);

  const updatess = () => {
    setType("updates");
    setShow(true);
  };

  const otherss = () => {
    setType("others");
    setShow(true);
  };

  const adsss = () => {
    setType("ad");
    setShow(true);
  };

  const closehandler = () => {
    setShow(false);
  };

  useEffect(() => {
    const fetchValue = async () => {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const { data } = await axios.get(
          `${server}/api/v1/user/getstories?type=${type}&page=${page}`,
          config
        );
        if (!data.story) {
          setNoMoreUpdates(true);
          setValue(null);
        } else {
          setValue(data.story);
          setNoMoreUpdates(false);
        }
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
    fetchValue();
  }, [type, page]);

  return (
    <>
      <Stack direction={dir} padding={"1.5rem"} sx={{
        ...(isMobile && {
          position:"relative",
          left:"9rem"
        }),
        ...(isMac && {
          position:"relative",
          left:"-1.5rem"
        }),
      }}>
        <Paper
          elevation={5}
          style={{
            width: "15rem",
            height: "20rem",
            margin: "1rem",
            borderRadius: "1rem",
            ...(isMac && {
             margin:"0.3rem",
            }),
          }}
        >
          <Button
            onClick={updatess}
            style={{ fontWeight: "bold", color: "blue", padding: "1rem" }}
          >
            unimedia-Updates
          </Button>
          <Stack style={{ alignItems: "center" }}>
            {update && update.attachments && (
              <Box
                sx={{
                  width: "13rem",
                  height: "15rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "1rem",
                }}
              >
                <div style={{ width: "100%", height: "100%", display: "flex" }}>
                  {Renderstory(
                    fileFormat(update.attachments.url),
                    update.attachments.url
                  )}
                </div>
              </Box>
            )}
          </Stack>
        </Paper>
        <Paper
          elevation={5}
          style={{
            width: "15rem",
            height: "20rem",
            margin: "1rem",
            borderRadius: "1rem",
            ...(isMac && {
              margin:"0.3rem",
             }),
          }}
        >
          <Button
            onClick={otherss}
            style={{ fontWeight: "bold", color: "blue", padding: "1rem" }}
          >
            Others
          </Button>
          <Stack style={{ alignItems: "center" }}>
            {other && other.attachments && (
              <Box
                sx={{
                  width: "13rem",
                  height: "15rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "1rem",
                }}
              >
                <div style={{ width: "100%", height: "100%", display: "flex" }}>
                  {Renderstory(
                    fileFormat(other.attachments.url),
                    other.attachments.url
                  )}
                </div>
              </Box>
            )}
          </Stack>
        </Paper>
        <Paper
          elevation={5}
          style={{
            width: "15rem",
            height: "20rem",
            margin: "1rem",
            borderRadius: "1rem",
            ...(isMac && {
              margin:"0.3rem",
             }),
          }}
        >
          <Button
            onClick={adsss}
            style={{ fontWeight: "bold", color: "blue", padding: "1rem" }}
          >
            Ad
          </Button>
          <Stack style={{ alignItems: "center" }}>
            {ad && ad.attachments && (
              <Box
                sx={{
                  width: "13rem",
                  height: "15rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "1rem",
                }}
              >
                <div style={{ width: "100%", height: "100%", display: "flex" }}>
                  {Renderstory(
                    fileFormat(ad.attachments.url),
                    ad.attachments.url
                  )}
                </div>
              </Box>
            )}
          </Stack>
        </Paper>
      </Stack>
      {show && (
        <Dialog
          open={show}
          onClose={closehandler}
          style={{ borderRadius: "2rem" }}
        >
          <Stack
            direction={"row"}
            padding={"1.5rem"}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            {value ? (
              <Stack
                style={{
                  width: "25rem",
                  height: "auto",
                  margin: "1rem",
                  borderRadius: "1rem",
                  alignItems:"center",
                  justifyContent:"center",
                }}
              >
                {value.attachments && (
                  <Box
                    sx={{
                      width: "23rem",
                      height: "18rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      borderRadius: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {Renderstory(
                        fileFormat(value.attachments.url),
                        value.attachments.url
                      )}
                    </div>
                  </Box>
                )}
                <Typography style={{padding:"2rem"}}>{value.description}</Typography>
                {value.link && (
                  <a href={value.link} target="_blank">
                    <Button
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      Explore
                    </Button>
                  </a>
                )}
              </Stack>
            ) : (
              <Typography>No more updates available.</Typography>
            )}
          </Stack>
          <Stack alignItems={"center"}>
            <Pagination count={10} page={page} onChange={handleChange} />
          </Stack>
        </Dialog>
      )}
    </>
  );
};

export default Story;
