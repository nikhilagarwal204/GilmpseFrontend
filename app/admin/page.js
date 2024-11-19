"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Admin() {
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");

    useEffect(() => {
        localStorage.getItem("username") !== "Admin" && router.push("/")
    }, [router]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setUploadStatus("");
    };

    const handleFileUpload = async () => {
        if (!file) {
            setUploadStatus("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        setUploadStatus("");

        try {

            await axios.post("https://glimpsebackend.onrender.com/ingest_leads", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setUploadStatus("File uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadStatus("Error uploading file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Admin Dashboard</h1>
            <p className={styles.subheading}>Upload Leads CSV file</p>

            <div className={styles.uploadSection}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
                <button
                    onClick={handleFileUpload}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload File"}
                </button>
            </div>

            {uploadStatus && <p className={styles.statusMessage}>{uploadStatus}</p>}
            <p onClick={() => { router.push("/dashboard") }} className={styles.link}><u>Go to Leads Dashboard</u></p>
        </div>
    );
}
