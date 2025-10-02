import React, { useEffect, useState } from 'react';
import LessonSkeleton from './LessonSkeleton';
import "./StudentDashboard.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiTag, FiUsers } from 'react-icons/fi';
import DynamicThumbnail from './DynamicThumbnail';

const StudentDashboard = ({ isLoading }) => {
    // State to manage the active view: 'lessons' or 'classes'
    const [activeView, setActiveView] = useState('classes');
    const [userid, setUserid] = useState(localStorage.getItem("user-id"));
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    useEffect(() => {
        const fetch_classes = async () => {
            try {
                const response = await axios.post("https://edtech-ai-mc8u.onrender.com/fetch-classes", {
                    user_id: userid
                });
                console.log(response.data);
                setClasses(response.data.message);
            }
            catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }
        fetch_classes();
    }, [])



    const renderContent = () => {
        if (isLoading) {
            // Show skeleton loaders for either view
            const skeletonCount = activeView === 'lessons' ? 4 : 3;
            return Array.from({ length: skeletonCount }).map((_, index) => <LessonSkeleton key={index} />);
        }


        if (activeView === 'classes') {
            return classes.map(cls => (
                // This code is designed to work inside a .map(cls => ( ... )) loop

                <div
                    key={cls._id}
                    onClick={() => navigate(`/class/${cls.classId}`)}
                    className="impressive-content-card"
                >
                    {/* --- 1. Dynamic Thumbnail Header --- */}
                    <div className="card-impressive-thumbnail" style={{borderRadius:10}}>
                        <DynamicThumbnail text={cls.className} seed={cls.subject} />
                        <div className="card-subject-tag">
                            <FiTag />
                            <span>{cls.subject}</span>
                        </div>
                    </div>

                    <div className="card-impressive-content">
                        <h3 className="card-impressive-title">{cls.className}</h3>
                        <div className="card-teacher-info">
                            <span>Taught by</span>
                            <strong>{cls.teacher}</strong>
                        </div>
                    </div>

                    {/* --- 3. Clean Stats Footer --- */}
                    <div className="card-impressive-footer">
                        <div className="card-footer-stat">
                            <FiUsers />
                            <span>{cls.students.length} Student{cls.students.length !== 1 ? 's' : ''}</span>
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