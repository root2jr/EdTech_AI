import React, { useEffect, useState } from 'react';
import LessonSkeleton from './LessonSkeleton';
import "./StudentDashboard.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus } from 'react-icons/fi';

const StudentDashboard = ({ isLoading }) => {
    // State to manage the active view: 'lessons' or 'classes'
    const [activeView, setActiveView] = useState('lessons');
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const fetch_lessons = async () => {
            try {
                setLessons([])
                const response = await axios.post("https://edtech-ai-mc8u.onrender.com/fetchlesson", {
                    class_id: "322J"
                });
                console.log(response.data);
                setLessons(prev => [...prev, ...response.data.message])

            }
            catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        fetch_lessons();
    }, [])

    // --- MOCK DATA ---

    const classes = [
        { id: 'C101', name: 'Grade 10 - Physics', teacher: 'Dr. Evelyn Reed', progress: 75 },
        { id: 'C102', name: 'Grade 10 - Algebra II', teacher: 'Mr. David Chen', progress: 50 },
        { id: 'C103', name: 'Grade 10 - World History', teacher: 'Ms. Anya Sharma', progress: 90 },
    ];

    const renderContent = () => {
        if (isLoading) {
            // Show skeleton loaders for either view
            const skeletonCount = activeView === 'lessons' ? 4 : 3;
            return Array.from({ length: skeletonCount }).map((_, index) => <LessonSkeleton key={index} />);
        }

        if (activeView === 'lessons') {
            return lessons.map(lesson => (
                <div key={lesson.id} className="content-card">
                    <div className="card-thumbnail">
                        <img src={lesson.thumbnail} alt={lesson.title} />
                    </div>
                    <div className="card-content">
                        <h3>{lesson.title}</h3>
                        <p>{lesson.subject}</p>
                        <button className="card-button" onClick={() => { navigate("/lesson"); localStorage.setItem("lesson", JSON.stringify(lesson)) }}>Start Lesson</button>
                    </div>
                </div>
            ));
        }

        if (activeView === 'classes') {
            return classes.map(cls => (
                <div key={cls.id} className="content-card">
                    <div className="card-content">
                        <h3>{cls.name}</h3>
                        <p>Taught by {cls.teacher}</p>
                        <div className="class-progress">
                            <div className="progress-label">
                                <span>Progress</span>
                                <span>{cls.progress}%</span>
                            </div>
                            <div className="bar-container">
                                <div className="bar-fill" style={{ width: `${cls.progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ));
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Your Dashboard</h2>
                <div className="view-toggle-container">
                    <button
                        className={`view-toggle-btn ${activeView === 'lessons' ? 'active' : ''}`}
                        onClick={() => setActiveView('lessons')}
                    >
                        Assigned Lessons
                    </button>
                    <button
                        className={`view-toggle-btn ${activeView === 'classes' ? 'active' : ''}`}
                        onClick={() => setActiveView('classes')}
                    >
                        My Classes
                    </button>
                </div>
            </div>

            <div className="content-grid">
                {renderContent()}
                <button
                    className="floating-add-button"
                    onClick={() => navigate('/add')}
                >
                    <FiPlus />
                </button>            </div>
        </div>
    );
};

export default StudentDashboard;