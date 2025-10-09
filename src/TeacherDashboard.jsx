import React, { useEffect, useState } from 'react';
import LessonSkeleton from './LessonSkeleton';
import { FiUsers, FiPlus, FiTag, FiMoreVertical } from 'react-icons/fi'; // Import the new icon
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DynamicThumbnail from './DynamicThumbnail';
import ReportProblemModal from './ReportProblemModal'; // 1. Import the modal

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const userid = localStorage.getItem("user-id");
    const [isLoading, setIsLoading] = useState(true);

    // --- NEW STATE FOR MENUS AND MODAL ---
    const [openMenuId, setOpenMenuId] = useState(null); // Tracks which options menu is open
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportingClass, setReportingClass] = useState(null); // Holds data for the class being reported

    useEffect(() => {
        const fetchTeacherClasses = async () => {
            try {
                const response = await axios.post("https://edtech-ai-mc8u.onrender.com/fetch-teacher-class", {
                    user_id: userid
                })
                setClasses(response.data.message);
                setIsLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setIsLoading(false); // Stop loading on error too
            }
        };
        fetchTeacherClasses();
    }, [userid]); // Dependency on userid

    // --- NEW HANDLER FUNCTIONS ---
    const handleReportProblem = (cls) => {
        setReportingClass(cls);      // Set the context for the modal
        setIsReportModalOpen(true);  // Open the modal
        setOpenMenuId(null);         // Close the options menu
    };

    const handleDeleteClass = (classId, className) => {
        if (window.confirm(`Are you sure you want to delete the class "${className}"? This action cannot be undone.`)) {
            console.log(`Deleting class: ${classId}`);
            // API call to delete the class would go here
            // On success, filter the class from the UI state:
            setClasses(prev => prev.filter(c => c.classId !== classId));
        }
        setOpenMenuId(null);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Your Classes</h2>
                <div className="header-buttons-group">
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
            </div>

            <div className="teacher-content-grid">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => <LessonSkeleton key={index} />)
                ) : (
                    classes.map(cls => (
                        <div key={cls._id} className="impressive-content-card">
                            {/* This area remains clickable for navigation */}
                            <div className="card-clickable-area" onClick={() => navigate(`/class/${cls.classId}`)}>
                                <div className="card-impressive-thumbnail" style={{ borderRadius: 10 }}>
                                    <DynamicThumbnail text={cls.className} seed={cls.subject} />
                                    <div className="card-subject-tag">
                                        <FiTag />
                                        <span>{cls.subject}</span>
                                    </div>
                                </div>
                                <div className="card-impressive-content">
                                    <h3 className="card-impressive-title">{cls.className}</h3>
                                </div>
                                <div className="card-impressive-footer">
                                    <div className="card-footer-stat">
                                        <FiUsers />
                                        <span>{cls.students ? cls.students.length : 0} Student{cls.students ? (cls.students.length !== 1 ? 's' : '') : ''}</span>
                                    </div>
                                </div>
                            </div>

                            {/* --- NEW: Options Menu --- */}
                            <div className="card-options-container">
                                <button
                                    className="card-options-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === cls._id ? null : cls._id);
                                    }}
                                >
                                    <FiMoreVertical />
                                </button>

                                {openMenuId === cls._id && (
                                    <div className="card-options-menu">
                                        <div className="menu-option" onClick={() => navigate(`/class/${cls.classId}`)}>Manage Students</div>
                                        <div className="menu-option" onClick={() => handleReportProblem(cls)}>Report a Problem</div>
                                        <div className="menu-option destructive" onClick={() => handleDeleteClass(cls.classId, cls.className)}>Delete Class</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 3. Render the modal (it will be invisible until isOpen is true) */}
            <ReportProblemModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                classInfo={reportingClass}
            />
        </div>
    );
};

export default TeacherDashboard;

