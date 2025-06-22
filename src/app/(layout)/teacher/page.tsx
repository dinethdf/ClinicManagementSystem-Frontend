"use client";
import { useState } from "react";

const Teacher = () => {
  const [name, setName] = useState("teachera");
  console.log("first render");
  return name;
};

export default Teacher;
