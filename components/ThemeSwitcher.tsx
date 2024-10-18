"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const [isdark, setIsDark] = useState(true);
  useEffect(function () {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleTheme() {
    const newTheme = isdark ? "light" : "dark";
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  }
  return <Button onClick={toggleTheme}>{isdark ? <Sun /> : <Moon />}</Button>;
}
