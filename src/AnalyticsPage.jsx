import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiTarget, FiAward, FiUsers, FiClipboard, FiLoader } from 'react-icons/fi';
import './AnalyticsPage.css';
import axios from 'axios';
// Import the dedicated component for the teacher's view
import TeacherAnalyticsPage from './TeacherAnalyticsPage'; 

const AnalyticsPage = () => {
    // This state now purely controls which component to display
    const viewMode = localStorage.getItem("role"); 
    
    // State for student-specific data
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
        const [userid,setUserid] = useState(localStorage.getItem("user-id"));
    

    useEffect(() => {
        // This effect now ONLY handles fetching student data.
        // Teacher data fetching is handled by the TeacherAnalyticsPage component itself.
        if (viewMode === 'Student') {
            const fetch_analytics = async () => {
                setIsLoading(true);
                try {
                    const response = await axios.post("https://edtech-ai-mc8u.onrender.com/fetchanalytics", {
                        user_id: userid // This should be dynamic from auth state
                    });
                    setStudentData(response.data.message);
                    console.log("Fetched Student Analytics:", response.data.message);
                } catch (error) {
                    console.error("Error fetching student analytics:", error);
                    setStudentData(null);
                } finally {
                    setIsLoading(false);
                }
            };
            fetch_analytics();
        }
    }, [viewMode]); // Re-fetches student data if user toggles back to student view

   

    const progressCircleStyle = (percent) => ({
        background: `conic-gradient(var(--accent-color) ${percent * 3.6}deg, var(--border-color) 0deg)`
    });

    // Render the TeacherAnalyticsPage directly when in teacher mode
    if (viewMode === 'Teacher') {
        // We add the toggle button inside the Teacher page for consistency
        return (
            <>
                
                <TeacherAnalyticsPage />
            </>
        );
    }
    
    // Render loading state for student view
    if (isLoading) {
        return (
            <div className="analytics-page">
                <div className="analytics-header">
                    <h2>Analytics Dashboard</h2>
                </div>
                <div className="loading-state">
                    <FiLoader className="loading-spinner" />
                    <p>Loading Student Analytics...</p>
                </div>
            </div>
        );
    }

    // --- RENDER THE STUDENT ANALYTICS DASHBOARD ---
    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h2>Analytics Dashboard</h2>
              
            </div>

            <div className="analytics-grid">
                {/* Stat Cards using optional chaining (?.) for safety */}
                <div className="analytics-card stat-card">
                    <div className="stat-icon"><FiBookOpen /></div>
                    <div className="stat-value">{studentData?.lessonsCompleted ?? 0}</div>
                    <div className="stat-label">Lessons Completed</div>
                </div>

                <div className="analytics-card stat-card">
                    <div className="stat-icon"><FiAward /></div>
                    <div className="stat-value">{`${studentData?.averageScore ?? 0}%`}</div>
                    <div className="stat-label">Average Score</div>
                </div>

                <div className="analytics-card progress-card">
                    <div className="progress-circle" style={progressCircleStyle(studentData?.weeklyGoal ?? 0)}>
                        <div className="progress-value">{`${studentData?.weeklyGoal ?? 0}%`}</div>
                    </div>
                    <div className="progress-label">Weekly Goal Progress</div>
                </div>

                <div className="analytics-card proficiency-card full-width-card">
                    <h3>Subject Proficiency</h3>
                    <ul className="proficiency-list">
                        {studentData?.proficiency && studentData.proficiency.length > 0 ? (
                            studentData.proficiency.map(item => (
                                <li key={item.subject}>
                                    <div className="proficiency-label">
                                        <span>{item.subject}</span>
                                        <span>{item.score}%</span>
                                    </div>
                                    <div className="bar-container">
                                        <div className="bar-fill" style={{ width: `${item.score}%` }}></div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="no-data-message">No proficiency data available.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;

