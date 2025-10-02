import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiPlayCircle, FiCheckCircle, FiUsers } from 'react-icons/fi';
import './ClassDetailsPage.css';
import axios from 'axios';
import { FiTag } from 'react-icons/fi';
import DynamicThumbnail from './DynamicThumbnail';

const ClassDetailsPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [userid, setUserid] = useState(localStorage.getItem("user-id"));

    // Separate states for class-specific info and the list of lessons
    const [classDetails, setClassDetails] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // This single useEffect handles all data fetching for the page
    useEffect(() => {
        // Don't fetch if there's no classId in the URL
        if (!classId) return;


        const fetchData = async () => {
            setIsLoading(true);
            try {
                // --- STEP 1: Fetch the specific class details ---
                // In a real-world app, you would have a dedicated endpoint like `/class-details/${classId}`.
                // For now, we'll fetch all classes and find the one we need.
                const classListResponse = await axios.post("http://127.0.0.1:8000/fetch-classes", {
                    user_id: userid // This should be dynamic in a real app
                });

                const allUserClasses = classListResponse.data.message || [];
                const currentClass = allUserClasses.find(cls => cls.classId === classId);

                if (currentClass) {
                    setClassDetails(currentClass);
                } else {
                    // If the class isn't found in the user's list, we can't proceed.
                    throw new Error("Class not found in user's enrolled list.");
                }

                // --- STEP 2: Fetch the lessons for that specific class ---
                const lessonsResponse = await axios.post("http://127.0.0.1:8000/fetchlesson", {
                    class_id: classId
                });

                // Assuming the server returns { message: [lesson1, lesson2, ...] }
                setLessons(lessonsResponse.data.message || []);

            } catch (error) {
                console.error("Failed to fetch class data:", error);
                setClassDetails(null); // Clear data on error to show "not found" message
                setLessons([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [classId]); // Dependency array ensures this runs again if the classId in the URL changes

    // This function now uses a placeholder since your lesson data doesn't have a 'status'
    const getLessonIcon = (lesson) => {
        // In a real app, you'd get this status from a 'UserProgress' collection
        // For now, we'll default to 'not-started' for all lessons.
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
                    {/* Use optional chaining (?.) for safety during initial render */}
                    <div className="card-impressive-thumbnail">
                        <DynamicThumbnail text={classDetails.className} seed={classDetails.subject} />
                        <div className="card-subject-tag">
                            <FiTag />
                            <span>{classDetails.subject}</span>
                        </div>
                    </div>
                    <h1>{classDetails?.className}</h1>
                    <p>{classDetails?.subject} • Taught by {classDetails?.teacher}</p>
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
