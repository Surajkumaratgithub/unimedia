import React, { useState,useEffect } from "react";
import { Paper, Stack, Button } from "@mui/material";
import Popular from "./Popular";
import Recent from "./Recent";
import Mostviewed from "./Mostviewed";
const Updates = () => {
  const [pop, setPop] = useState(true);
  const [rec, setRec] = useState(false);
  const [msv, setMsv] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const checkViewportWidth = () => {
    const viewportWidth = window.innerWidth;
    setIsMobile(viewportWidth <= 500);
    setIsMac(viewportWidth >= 800 && viewportWidth <= 1350);
  };
  useEffect(() => {
    checkViewportWidth();
    window.addEventListener("resize", checkViewportWidth);
    return () => {
      window.removeEventListener("resize", checkViewportWidth);
    };
  }, []);
  const popular = () => {
    setPop(true);
    setRec(false);
    setMsv(false);
  };
  const recent = () => {
    setPop(false);
    setRec(true);
    setMsv(false);
  };
  const mostviewed = () => {
    setPop(false);
    setRec(false);
    setMsv(true);
  };
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: "52.5vw",
          height: "70vh",
          margin: "2rem",
          padding:"1rem",
          borderRadius: "2rem",
          ...(isMobile && {
            width: "25rem",
            height: "58rem",
            position:"relative",
            left:"5rem"
          }),
          ...(isMac && {
            height:"75vh",
            width:"56vw",
            margin:"1rem",
          }),
        }}
      >
        <Stack direction={"row"} style={{ gap: "1rem", color: "black",paddingInlineStart:"2rem" }}>
          <Button
            onClick={popular}
            style={{
              fontWeight: "bold",
              borderBottom: pop ? "3.5px solid blue" : "none",
            }}
          >
            POPULAR
          </Button>
          <Button
            onClick={recent}
            style={{
              fontWeight: "bold",
              borderBottom: rec ? "3.5px solid blue" : "none",
            }}
          >
            RECENT
          </Button>
          <Button
            onClick={mostviewed}
            style={{
              fontWeight: "bold",
              borderBottom: msv ? "3.5px solid blue" : "none",
            }}
          >
            MOST VIEWED
          </Button>
        </Stack>
        <hr />
        <Stack>
          {pop && <Popular />}
          {rec && <Recent />}
          {msv && <Mostviewed />}
        </Stack>
      </Paper>
    </>
  );
};

export default Updates;
