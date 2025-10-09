import React, { useEffect, useState } from 'react';
import LessonSkeleton from './LessonSkeleton';
import "./StudentDashboard.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Import the new icon for the options menu
import { FiPlus, FiTag, FiUsers, FiMoreVertical } from 'react-icons/fi';
import DynamicThumbnail from './DynamicThumbnail';
// 1. Import the new ReportProblemModal component
import ReportProblemModal from './ReportProblemModal';

const StudentDashboard = () => {
    // State to manage the active view: 'lessons' or 'classes'
    const [activeView, setActiveView] = useState('classes');
    const [isLoading, setisLoading] = useState(true);
    const [userid, setUserid] = useState(localStorage.getItem("user-id"));
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);

    // --- State to track which card's menu is open ---
    const [openMenuId, setOpenMenuId] = useState(null);

    // --- 2. Add State for the report modal ---
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportingClass, setReportingClass] = useState(null); // To store info of the class being reported

    useEffect(() => {
        const fetch_classes = async () => {
            try {
                const response = await axios.post("https://edtech-ai-mc8u.onrender.com/fetch-classes", {
                    user_id: userid
                });
                console.log(response.data);
                setClasses(response.data.message);
                setisLoading(false);
            }
            catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }
        fetch_classes();
    }, [userid]); // Added userid as a dependency

    const handleLeaveClass = async (classId) => {
        // A simple confirmation for now. A custom modal would be better for UX.
        if (window.confirm("Are you sure you want to leave this class? This action cannot be undone.")) {
            console.log(`Requesting to leave class ID: ${classId}`);
            try {
                await axios.post("https://edtech-ai-mc8u.onrender.com/leave-class", { // Assuming this is your leave class endpoint
                    user_id: userid,
                    class_id: classId
                });
                // On success, filter the class out from the UI
                setClasses(prevClasses => prevClasses.filter(cls => cls.classId !== classId));
            }
            catch (error) {
                console.error("Error leaving class:", error);
                alert("Failed to leave the class. Please try again.");
            }
        }
        setOpenMenuId(null); // Always close the menu after action
    };

    // --- 3. Create a handler function to open the modal ---
    const handleReportProblem = (cls) => {
        setReportingClass(cls);      // Set the class data for the modal
        setIsReportModalOpen(true);  // Open the modal
        setOpenMenuId(null);         // Close the three-dot menu
    };

    const renderContent = () => {
        if (isLoading) {
            const skeletonCount = activeView === 'lessons' ? 4 : 3;
            return Array.from({ length: skeletonCount }).map((_, index) => <LessonSkeleton key={index} />);
        }

        if (activeView === 'classes') {
            return classes.map(cls => (
                <div key={cls._id} className="impressive-content-card">
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
                            <div className="card-teacher-info">
                                <span>Taught by</span>
                                <strong>{cls.teacher}</strong>
                            </div>
                        </div>
                        <div className="card-impressive-footer">
                            <div className="card-footer-stat">
                                <FiUsers />
                                <span>{cls.students.length} Student{cls.students.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

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
                                <div className="menu-option" onClick={() => navigate(`/class/${cls.classId}`)}>View Details</div>
                                {/* --- 4. Update the onClick handler for "Report a Problem" --- */}
                                <div className="menu-option" onClick={() => handleReportProblem(cls)}>
                                    Report a Problem
                                </div>
                                <div
                                    className="menu-option destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLeaveClass(cls.classId);
                                    }}
                                >
                                    Leave Class
                                </div>
                            </div>
                        )}
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
            </div>

            <button
                className="floating-add-button"
                onClick={() => navigate('/add')} // Changed to a more logical navigation
            >
                <FiPlus />
            </button>

            {/* --- 5. Render the modal at the end of the component --- */}
            <ReportProblemModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                classInfo={reportingClass}
            />
        </div>
    );
};

export default StudentDashboard;

