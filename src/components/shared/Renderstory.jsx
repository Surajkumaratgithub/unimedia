import React from "react";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

const Renderstory = (file, url) => {
  switch (file) {
    case "video":
      return (
        <video
          src={url}
          controls
          style={{ width: "100%", height: "100%",  objectFit: "cover"  }}
        />
      );

    case "image":
      return (
        <img
          src={url}
          alt="story content"
          style={{ width: "100%", height: "100%",  objectFit: "cover"  }}
        />
      );

    case "audio":
      return <audio src={url} controls style={{ width: "100%" }} />;

    default:
      return <FileOpenIcon />;
  }
};

export default Renderstory;
