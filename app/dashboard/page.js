"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [filters, setFilters] = useState({
        source: "",
        interest_level: "",
        status: "",
        page: 1,
        per_page: 9,
    });

    const [data, setData] = useState({ leads: [], total_pages: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        !localStorage.getItem("isLoggedIn") && router.push("/");
        localStorage.username = "Bob";
        localStorage.password = "pass123";
    }, [router]);

    const fetchData = async (updatedFilters) => {
        setLoading(true);
        try {
            const username = localStorage.getItem("username");
            const password = localStorage.getItem("password");
            const base64 = Buffer.from(`${username}:${password}`).toString("base64");

            const new_source = updatedFilters.source !== '' ? [updatedFilters.source] : [];
            const new_interest_level = updatedFilters.interest_level !== '' ? [updatedFilters.interest_level] : [];
            const new_status = updatedFilters.status !== '' ? [updatedFilters.status] : [];

            updatedFilters = { source: new_source, interest_level: new_interest_level, status: new_status, page: updatedFilters.page, per_page: updatedFilters.per_page };

            const response = await axios.post(
                "https://glimpsebackend.onrender.com/leads",
                updatedFilters,
                { headers: { 'Authorization': `Basic ${base64}` } }
            );

            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const updatedFilters = { ...filters, [key]: value, page: 1 };
        setFilters(updatedFilters);
    };

    const applyFilters = () => {
        fetchData(filters);
    };

    const handlePageChange = (page) => {
        const updatedFilters = { ...filters, page };
        setFilters(updatedFilters);
        fetchData(updatedFilters);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Leads Dashboard</h1>

            <div className={styles.filters}>
                <FilterDropdown
                    options={["Cold Call", "Event", "Referral", "Website"]}
                    selected={filters.source}
                    onChange={(value) => handleFilterChange("source", value)}
                    display="Select Source"
                />
                <FilterDropdown
                    options={["High", "Medium", "Low"]}
                    selected={filters.interest_level}
                    onChange={(value) => handleFilterChange("interest_level", value)}
                    display="Select Interest Level"
                />
                <FilterDropdown
                    options={["Closed", "Contacted", "New", "Qualified"]}
                    selected={filters.status}
                    onChange={(value) => handleFilterChange("status", value)}
                    display="Select Status"
                />

                <button onClick={applyFilters} className={styles.applyButton}>
                    Apply Filter
                </button>
            </div>

            {loading ? (
                <p className={styles.loadingContainer}>Loading...</p>
            ) : data.total_leads === 0 ? <p>No Leads found with the applied filter.</p> : (
                <div className={styles.grid}>
                    {data.leads.map((lead) => (
                        <div key={lead.lead_id} className={styles.card}>
                            <h3>{lead.lead_name}</h3>
                            <p><b>Email:</b> {lead.contact_info}</p>
                            <p><b>Source:</b> {lead.source}</p>
                            <p><b>Interest Level:</b> {lead.interest_level}</p>
                            <p><b>Status:</b> {lead.status}</p>
                            <p><b>Assigned Salesperson:</b> {lead.assigned_salesperson}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.pagination}>
                {!loading && [...Array(data.total_pages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={filters.page === index + 1 ? styles.activePage : ""}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

function FilterDropdown({ label, options, selected, onChange, display }) {
    return (
        <div className={styles.filter}>
            <label className={styles.label}>{label}</label>
            <select
                value={selected || ""}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{display}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}
