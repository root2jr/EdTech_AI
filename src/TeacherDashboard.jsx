import React from 'react';
import LessonSkeleton from './LessonSkeleton'; // We can reuse the same skeleton!
import { FiUsers, FiPlus } from 'react-icons/fi'; // Import necessary icons
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = ({ isLoading }) => {
    const navigate = useNavigate();
    // Mock data for classes with more details
    const classes = [
        { 
            id: 'C101', 
            name: 'Grade 10 - Physics', 
            subject: 'Science',
            students: 28, 
            avgPerformance: 82,
            thumbnail: 'https://placehold.co/600x400/1d1d1f/f5f5f7?text=Physics&font=inter'
        },
        { 
            id: 'C102', 
            name: 'Grade 12 - Advanced Calculus', 
            subject: 'Mathematics',
            students: 22, 
            avgPerformance: 71,
            thumbnail: 'https://placehold.co/600x400/1d1d1f/f5f5f7?text=Calculus&font=inter'
        },
        { 
            id: 'C103', 
            name: 'Grade 9 - Chemistry', 
            subject: 'Science',
            students: 31, 
            avgPerformance: 89,
            thumbnail: 'https://placehold.co/600x400/1d1d1f/f5f5f7?text=Chemistry&font=inter'
        },
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Your Classes</h2>
                <button onClick={() => navigate("/createlesson")} className="create-class-button">
                    <FiPlus />
                    <span>Create New Class</span>
                </button>
            </div>
            
            <div className="teacher-content-grid">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => <LessonSkeleton key={index} />)
                ) : (
                    classes.map(cls => (
                        <div key={cls.id} className="teacher-class-card">
                            <div className="card-thumbnail">
                                <img src={cls.thumbnail} alt={cls.name} />
                                <span className="class-subject-tag">{cls.subject}</span>
                            </div>
                            <div className="card-content">
                                <h3>{cls.name}</h3>
                                <div className="class-stats">
                                    <div className="stat-item">
                                        <FiUsers />
                                        <span>{cls.students} Students</span>
                                    </div>
                                </div>
                                <div className="class-progress">
                                    <div className="progress-label">
                                        <span>Avg. Performance</span>
                                        <span>{cls.avgPerformance}%</span>
                                    </div>
                                    <div className="bar-container">
                                        <div 
                                            className="bar-fill" 
                                            style={{ width: `${cls.avgPerformance}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <button className="card-button" onClick={() => {navigate("/manageclass")}}>Manage Class</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
