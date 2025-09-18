import React, { useState } from 'react';
import { FiBookOpen, FiTarget, FiAward, FiUsers, FiClipboard } from 'react-icons/fi';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
    // In a real app, you'd have one view based on the logged-in user's role
    const [viewMode, setViewMode] = useState('student'); 

    // Mock Data for demonstration
    const studentData = {
        lessonsCompleted: 18,
        averageScore: 88,
        weeklyGoal: 75,
        proficiency: [
            { subject: 'Algebra', score: 92 },
            { subject: 'Physics', score: 85 },
            { subject: 'Biology', score: 78 },
            { subject: 'Literature', score: 95 },
        ],
        recentActivity: [
            "Completed quiz: 'Newton's Laws'",
            "Started lesson: 'Cell Mitosis'",
            "Achieved a new high score in 'Calculus Basics'",
        ]
    };

    const teacherData = {
        activeClasses: 4,
        averageCompletionRate: 76,
        studentsNeedingHelp: 5,
        classPerformance: [
            { name: 'Grade 10 - Physics', score: 82 },
            { name: 'Grade 12 - Calculus', score: 71 },
            { name: 'Grade 9 - Chemistry', score: 89 },
        ],
        recentGraded: [
            "Assignment: 'Lab Safety Report' for 28 students",
            "Quiz: 'Periodic Table' for 31 students",
        ]
    };

    const data = viewMode === 'student' ? studentData : teacherData;

    const toggleView = () => {
        setViewMode(prev => (prev === 'student' ? 'teacher' : 'student'));
    };

    // Helper to create the progress circle style
    const progressCircleStyle = (percent) => ({
        background: `conic-gradient(var(--accent-color) ${percent * 3.6}deg, var(--border-color) 0deg)`
    });

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h2>Analytics Dashboard</h2>
                <button onClick={toggleView} className="view-toggle-btn">
                    Switch to {viewMode === 'student' ? 'Teacher' : 'Student'} View
                </button>
            </div>

            <div className="analytics-grid">
                {/* --- Stat Cards --- */}
                <div className="analytics-card stat-card">
                    <div className="stat-icon">{viewMode === 'student' ? <FiBookOpen /> : <FiUsers />}</div>
                    <div className="stat-value">{viewMode === 'student' ? data.lessonsCompleted : data.activeClasses}</div>
                    <div className="stat-label">{viewMode === 'student' ? 'Lessons Completed' : 'Active Classes'}</div>
                </div>

                <div className="analytics-card stat-card">
                    <div className="stat-icon">{viewMode === 'student' ? <FiAward /> : <FiClipboard />}</div>
                    <div className="stat-value">{viewMode === 'student' ? `${data.averageScore}%` : `${data.averageCompletionRate}%`}</div>
                    <div className="stat-label">{viewMode === 'student' ? 'Average Score' : 'Completion Rate'}</div>
                </div>

                {/* --- Progress Circle Card --- */}
                <div className="analytics-card progress-card">
                    <div className="progress-circle" style={progressCircleStyle(viewMode === 'student' ? data.weeklyGoal : data.averageCompletionRate)}>
                        <div className="progress-value">{viewMode === 'student' ? `${data.weeklyGoal}%` : `${data.averageCompletionRate}%`}</div>
                    </div>
                    <div className="progress-label">{viewMode === 'student' ? 'Weekly Goal Progress' : 'Overall Completion Rate'}</div>
                </div>

                {/* --- Proficiency / Performance Bar Chart Card --- */}
                <div className="analytics-card proficiency-card">
                    <h3>{viewMode === 'student' ? 'Subject Proficiency' : 'Class Performance'}</h3>
                    <ul className="proficiency-list">
                        {(viewMode === 'student' ? data.proficiency : data.classPerformance).map(item => (
                            <li key={item.subject || item.name}>
                                <div className="proficiency-label">
                                    <span>{item.subject || item.name}</span>
                                    <span>{item.score}%</span>
                                </div>
                                <div className="bar-container">
                                    <div className="bar-fill" style={{ width: `${item.score}%` }}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- Recent Activity Card --- */}
                <div className="analytics-card activity-card">
                     <h3>Recent Activity</h3>
                     <ul className="activity-list">
                        {(viewMode === 'student' ? data.recentActivity : data.recentGraded).map((activity, index) => (
                            <li key={index}>{activity}</li>
                        ))}
                     </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;