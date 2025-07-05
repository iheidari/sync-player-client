"use client";

import React, { useEffect, useState } from "react";

type Props = {};

const debug = (props: Props) => {
  const [fullscreenEnabled, setFullscreenEnabled] = useState("no set");

  useEffect(() => {
    console.log("document.fullscreenEnabled", document.fullscreenEnabled);
    setFullscreenEnabled(document.fullscreenEnabled ? "true" : "false");
  }, []);

  return <div>document.fullscreenEnabled: {fullscreenEnabled}</div>;
};

export default debug;
