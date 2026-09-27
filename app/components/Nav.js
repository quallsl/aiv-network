"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Nav({ onSearch }) {
  const [query, setQuery] = useState("");

  return (
   <MenuBar />
  );
}
