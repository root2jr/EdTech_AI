import React, { useEffect, useState } from 'react';
import { FiUsers, FiClipboard, FiTrendingUp, FiLoader } from 'react-icons/fi';
import './TeacherAnalyticsPage.css';
import axios from 'axios';

const TeacherAnalyticsPage = () => {
    // State to hold the fetched analytics data and loading status
    const [teacherData, setTeacherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userid, setUserid] = useState(localStorage.getItem("user-id"));


    useEffect(() => {
        const fetchTeacherAnalytics = async () => {
            setIsLoading(true);
            try {
                const response = await axios.post("http://127.0.0.1:8000/fetch-teacher-analytics", {
                    user_id: userid
                })
                console.log(response.data);
                setTeacherData(response.data.message);


                setTimeout(() => {
                    setIsLoading(false);
                }, 1500);

            } catch (error) {
                console.error("Error fetching teacher analytics:", error);
                setTeacherData(null);
                setIsLoading(false);
            }
        };

        fetchTeacherAnalytics();
    }, []); // Empty dependency array to run only once on mount

    // Helper to create the progress circle style
    const progressCircleStyle = (percent) => ({
        background: `conic-gradient(var(--accent-color) ${percent * 3.6}deg, var(--border-color) 0deg)`
    });

    if (isLoading) {
        return (
            <div className="analytics-page">
                <div className="loading-state">
                    <FiLoader className="loading-spinner" />
                    <p>Loading Teacher Analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h2>Teacher Dashboard</h2>
            </div>

            <div className="analytics-grid">
                {/* --- Stat Cards for Key Metrics --- */}
                <div className="analytics-card stat-card">
                    <div className="stat-icon"><FiClipboard /></div>
                    <div className="stat-value">{teacherData?.active_classes ?? 0}</div>
                    <div className="stat-label">Active Classes</div>
                </div>

                <div className="analytics-card stat-card">
                    <div className="stat-icon"><FiUsers /></div>
                    <div className="stat-value">{teacherData?.total_students ?? 0}</div>
                    <div className="stat-label">Total Students</div>
                </div>

                {/* --- Progress Circle for Overall Completion Rate --- */}
                <div className="analytics-card progress-card">
                    <div className="progress-circle" style={progressCircleStyle(teacherData?.completion_rate ?? 0)}>
                        <div className="progress-value">{teacherData?.completion_rate ?? 0}%</div>
                    </div>
                    <div className="progress-label">Overall Completion Rate</div>
                </div>

                {/* --- Class-wise Performance Bar Chart Card --- */}
                <div className="analytics-card proficiency-card full-width-card">
                    <h3>Class-wise Completion Rate</h3>
                    {teacherData?.class_wise_analytics && teacherData.class_wise_analytics.length > 0 ? (
                        <ul className="proficiency-list">
                            {teacherData.class_wise_analytics.map(item => (
                                <li key={item.classid}>
                                    <div className="proficiency-label">
                                        {/* Display class name or ID as a fallback */}
                                        <span>{item.className || item.classid}</span>
                                        <span>{item.completion_rate}%</span>
                                    </div>
                                    <div className="bar-container">
                                        <div className="bar-fill" style={{ width: `${item.completion_rate}%` }}></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data-message">No class performance data available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherAnalyticsPage;