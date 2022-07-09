import { useState } from "react";
import styles from "./input.module.css";

export const InputModal = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  return <div>Input</div>;
};
