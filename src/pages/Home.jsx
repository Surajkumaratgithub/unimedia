import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box } from "@mui/material";
import { grayColor } from "../constants/color";
import Story from "../components/layout/Story";
import Postcreate from "../components/layout/Postcreate";
import Updates from "../components/layout/Updates";
const Home = () => {
  return (
    <Box
      bgcolor={grayColor}
      height={"100%"}
      width={"55rem"}
      marginLeft={"-7rem"}
      sx={{
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
      <Story />
      <Postcreate />
      <Updates />
    </Box>
  );
};

export default AppLayout()(Home);
