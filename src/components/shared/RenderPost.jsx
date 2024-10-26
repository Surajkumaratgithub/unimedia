import React from "react";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

const RenderPost = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} width="100%" height="100%" controls objectFit= "cover" />;
    case "image":
      return <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
    case "audio":
      return <audio src={url} width="100%" height="100%" controls />;
    default:
      return <FileOpenIcon />;
  }
};

export default RenderPost;