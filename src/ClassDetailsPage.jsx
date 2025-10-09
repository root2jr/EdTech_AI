import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiPlayCircle, FiCheckCircle, FiUsers, FiSettings } from 'react-icons/fi';
import './ClassDetailsPage.css';
import axios from 'axios';
import { FiTag } from 'react-icons/fi';
import DynamicThumbnail from './DynamicThumbnail';

const ClassDetailsPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    
    // Get user info from localStorage
    const [userId, setUserId] = useState(localStorage.getItem("user-id"));
    const [userRole, setUserRole] = useState(localStorage.getItem("role")); // Get user role

    const [classDetails, setClassDetails] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!classId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const classListResponse = await axios.post("https://edtech-ai-mc8u.onrender.com/fetch-classes", {
                    user_id: userId
                });

                const allUserClasses = classListResponse.data.message || [];
                const currentClass = allUserClasses.find(cls => cls.classId === classId);

                if (currentClass) {
                    setClassDetails(currentClass);
                } else {
                    throw new Error("Class not found in user's enrolled list.");
                }

                const lessonsResponse = await axios.post("https://edtech-ai-mc8u.onrender.com/fetchlesson", {
                    class_id: classId
                });
                setLessons(lessonsResponse.data.message || []);

            } catch (error) {
                console.error("Failed to fetch class data:", error);
                setClassDetails(null);
                setLessons([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [classId, userId]);

    const getLessonIcon = (lesson) => {
        const status = lesson.status || 'not-started';
        switch (status) {
            case 'completed':
                return <FiCheckCircle className="status-completed" />;
            case 'in-progress':
                return <FiPlayCircle className="status-inprogress" />;
            default:
                return <FiBookOpen className="status-notstarted" />;
        }
    };

    if (isLoading) {
        return <div className="loading-container">Loading class details...</div>;
    }

    if (!classDetails) {
        return <div className="loading-container">Could not find class details. Please go back.</div>;
    }

    return (
        <div className="class-details-page">
            <div className="class-details-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                    <span>Back to Dashboard</span>
                </button>

                <div className="class-header-card">
                    <div className="card-impressive-thumbnail" style={{borderRadius:10}}>
                        <DynamicThumbnail text={classDetails.className} seed={classDetails.subject} />
                        <div className="card-subject-tag">
                            <FiTag />
                            <span>{classDetails.subject}</span>
                        </div>
                    </div>
                    <div className="class-header-content">
                        <div className="class-header-main-info">
                             <h1>{classDetails?.className}</h1>
                             <p>Taught by {classDetails?.teacher}</p>
                        </div>
                        {/* --- NEW: Conditional Manage Class Button --- */}
                        {userRole === 'Teacher' && (
                            <button 
                                className="manage-class-button" 
                                onClick={() => navigate(`/manageclass/${classDetails.classId}`)}
                            >
                                <FiSettings />
                                <span>Manage Class</span>
                            </button>
                        )}
                    </div>
                    <div className="class-header-stats">
                        <div className="header-stat-item">
                            <FiUsers />
                            <span>
                                <strong>{classDetails?.students?.length ?? 0}</strong> Student{classDetails?.students?.length !== 1 ? 's' : ''} Enrolled
                            </span>
                        </div>
                    </div>
                </div>

                <div className="lessons-list-container">
                    <h2>Lessons</h2>
                    {lessons.length > 0 ? (
                        lessons.map(lesson => (
                            <div key={lesson._id} className="lesson-list-item" onClick={() => { localStorage.setItem("lesson", JSON.stringify(lesson)); navigate(`/lesson`) }}>
                                <div className="lesson-status-icon">
                                    {getLessonIcon(lesson)}
                                </div>
                                <div className="lesson-details">
                                    <h3>{lesson.title}</h3>
                                </div>
                                <button className="lesson-action-button">
                                    Start Lesson
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-lessons-message">No lessons have been added to this class yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassDetailsPage;

