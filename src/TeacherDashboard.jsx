import React, { useEffect, useState } from 'react';
import LessonSkeleton from './LessonSkeleton'; // We can reuse the same skeleton!
import { FiUsers, FiPlus, FiTag } from 'react-icons/fi'; // Import necessary icons
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DynamicThumbnail from './DynamicThumbnail';

const TeacherDashboard = ({ isLoading }) => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const userid = localStorage.getItem("user-id");
    useEffect(() => {
        const fetchTeacherClasses = async () => {
            try {
                const response = await axios.post("https://edtech-ai-mc8u.onrender.com/fetch-teacher-class", {
                    user_id: userid
                })
                console.log(response.data);
                setClasses(response.data.message);
            }
            catch (error) {
                console.error("Error:", error);
            }


        };

        fetchTeacherClasses();
    }, [])

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Your Classes</h2>
                <button onClick={() => navigate("/createclass")} className="create-class-button">
                    <FiPlus />
                    <span>Create New Class</span>
                </button>
                <button
                    className="floating-add-button"
                    onClick={() => navigate('/createlesson')}
                >
                    <FiPlus />
                </button>
            </div>

            <div className="teacher-content-grid">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => <LessonSkeleton key={index} />)
                ) : (
                    classes.map(cls => (
                        <div
                            key={cls._id}
                            // Use the dynamic classId for navigation
                            onClick={() => navigate(`/class/${cls.classId}`)}
                            className="impressive-content-card"
                        >
                            {/* --- 1. Dynamic Thumbnail Header --- */}
                            <div className="card-impressive-thumbnail" style={{borderRadius:10}}>
                                {/* These props match your data */}
                                <DynamicThumbnail text={cls.className} seed={cls.subject} />

                                <div className="card-subject-tag">
                                    <FiTag />
                                    <span>{cls.subject}</span>
                                </div>
                            </div>

                            {/* --- 2. Detailed Content Body --- */}
                            <div className="card-impressive-content">
                                {/* Use 'className' for the title */}
                                <h3 className="card-impressive-title">{cls.className}</h3>

                                {/* --- IMPRESSIVE UPGRADE --- */}
                                {/* Replaced the broken progress bar with the teacher's name */}

                            </div>

                            {/* --- 3. Clean Stats Footer --- */}
                            <div className="card-impressive-footer">
                                <div className="card-footer-stat">
                                    <FiUsers />
                                    {/* Use students.length to get a dynamic count */}
                                    <span>{cls.students ? cls.students.length : 0} Student{cls.students ? (cls.students.length !== 1 ? 's' : '') : ''}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
