import React from "react";
import { Redirect } from "react-router-dom";

export default function NotFoundView() {
  return <Redirect to="/" />;
}
