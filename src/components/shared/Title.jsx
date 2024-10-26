import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({
  title = "unimedia",
  description = "this is the students social media app unimedia",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
