"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.css";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();


  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      localStorage.setItem("username", formData.username);
      localStorage.setItem("password", formData.password);

      if (formData.username === "Admin" && formData.password === "admin123") {
        localStorage.setItem("isLoggedIn", true);
        router.push("/admin");
        return;
      }

      else {
        const response = await axios.post("https://glimpsebackend.onrender.com/login", formData);
        if (response.status === 200) {
          localStorage.setItem("isLoggedIn", true);
          router.push("/dashboard");
        }
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {["username", "password"].map((field) => (
          <div key={field} className={styles.inputGroup}>
            <label htmlFor={field} className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field}
              id={field}
              value={formData[field]}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
        ))}
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Log In
        </button>
      </form>
    </div>
  );
}
