import React from "react";
import { hydrateRoot } from "react-dom/client";
import { Contact } from "../ContactPages.jsx";
hydrateRoot(document.querySelector("main"), <Contact />);
