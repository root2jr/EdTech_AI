import React, { useEffect, useState } from 'react';
import LessonSkeleton from './LessonSkeleton';
import "./StudentDashboard.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = ({ isLoading }) => {
    // State to manage the active view: 'lessons' or 'classes'
    const [activeView, setActiveView] = useState('lessons');
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([
        { id: 1, title: 'Introduction to Algebra', subject: 'Mathematics', thumbnail: 'https://placehold.co/600x400/e2e8f0/4a5568?text=Algebra' },
        { id: 2, title: 'The Laws of Motion', subject: 'Physics', thumbnail: 'https://placehold.co/600x400/e2e8f0/4a5568?text=Physics' },
        { id: 3, title: 'Cellular Biology Basics', subject: 'Biology', thumbnail: 'https://placehold.co/600x400/e2e8f0/4a5568?text=Biology' },
        { id: 4, title: 'Shakespearean Sonnets', subject: 'Literature', thumbnail: 'https://placehold.co/600x400/e2e8f0/4a5568?text=Literature' },
    ]);

    useEffect(() => {
        const fetch_lessons = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/fetchlesson");
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
                        <button className="card-button" onClick={() => { navigate("/lesson"); localStorage.setItem("lesson",lesson.title) }}>Start Lesson</button>
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
            </div>
        </div>
    );
};

export default StudentDashboard;