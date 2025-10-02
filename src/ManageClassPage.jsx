import React, { useState } from 'react';
import { FiUsers, FiBarChart2, FiSearch, FiPlus, FiArrowLeft } from 'react-icons/fi';
import './ManageClassPage.css';
import { useNavigate } from 'react-router-dom';

// Mock Data for a single class and its students
const classData = {
    id: 'C101',
    name: 'Grade 10 - Physics',
    subject: 'Science',
    avgPerformance: 82,
    students: [
        { id: 1, name: 'Aarav Sharma', progress: 95, attentionScore: 'low' },
        { id: 2, name: 'Saanvi Patel', progress: 88, attentionScore: 'low' },
        { id: 3, name: 'Vivaan Gupta', progress: 72, attentionScore: 'medium' },
        { id: 4, name: 'Diya Singh', progress: 98, attentionScore: 'low' },
        { id: 5, name: 'Arjun Kumar', progress: 55, attentionScore: 'high' },
        { id: 6, name: 'Ananya Desai', progress: 85, attentionScore: 'low' },
        { id: 7, name: 'Rohan Mehta', progress: 65, attentionScore: 'medium' },
        { id: 8, name: 'Isha Reddy', progress: 40, attentionScore: 'high' },
    ]
};

const ManageClassPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = classData.students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAttentionScoreClass = (score) => {
        if (score === 'high') return 'attention-high';
        if (score === 'medium') return 'attention-medium';
        return 'attention-low';
    };

    return (
        <div className="manage-class-page">
            <div className="class-header-card">
                <div className="class-header-top">
                    <button className="back-button" onClick={() => navigate("/mainpage")}><FiArrowLeft /> Back to Dashboard</button>
                </div>
                <div className="class-header-main">
                    <div className="class-header-icon">{classData.subject.charAt(0)}</div>
                    <div className="class-header-details">
                        <h1>{classData.name}</h1>
                        <p>{classData.subject}</p>
                    </div>
                </div>
                <div className="class-header-stats">
                    <div className="header-stat-item">
                        <FiUsers />
                        <span><strong>{classData.students.length}</strong> Students</span>
                    </div>
                    <div className="header-stat-item">
                        <FiBarChart2 />
                        <span><strong>{classData.avgPerformance}%</strong> Avg. Performance</span>
                    </div>
                </div>
            </div>

            <div className="student-roster-card">
                <div className="roster-controls">
                    <h2>Student Roster</h2>
                    <div className="roster-actions">
                        <div className="search-bar">
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="add-student-button">
                            <FiPlus />
                            <span>Add Student</span>
                        </button>
                    </div>
                </div>

                <div className="student-list">
                    {/* List Header */}
                    <div className="student-list-item header">
                        <span className="student-name">Name</span>
                        <span className="student-progress">Progress</span>
                        <span className="student-attention">Attention Score</span>
                        <span className="student-actions">Actions</span>
                    </div>

                    {/* Student Rows */}
                    {filteredStudents.map(student => (
                        <div key={student.id} className="student-list-item">
                            <span className="student-name">{student.name}</span>
                            <div className="student-progress">
                                <div className="bar-container">
                                    <div className="bar-fill" style={{ width: `${student.progress}%` }}></div>
                                </div>
                                <span>{student.progress}%</span>
                            </div>
                            <span className="student-attention">
                                <span className={`attention-dot ${getAttentionScoreClass(student.attentionScore)}`}></span>
                                {student.attentionScore.charAt(0).toUpperCase() + student.attentionScore.slice(1)}
                            </span>
                            <div className="student-actions">
                                <button className="action-button">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageClassPage;