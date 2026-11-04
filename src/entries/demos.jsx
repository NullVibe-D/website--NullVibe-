import React from "react";
import { hydrateRoot } from "react-dom/client";
import { Demos, DemoDetail } from "../Demos.jsx";
const slug = location.pathname.split("/")[2];
hydrateRoot(
  document.querySelector("main"),
  slug ? <DemoDetail slug={slug} /> : <Demos />,
);
