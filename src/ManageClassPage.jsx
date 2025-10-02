import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUsers, FiBarChart2, FiSearch, FiPlus, FiArrowLeft, FiCheckCircle, FiCopy } from 'react-icons/fi';
import './ManageClassPage.css';
import axios from 'axios';

const ManageClassPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();

    // State to hold data from the API
    const [classData, setClassData] = useState(null);
    const [showclassid, setShowclassid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [userid, setUserid] = useState(localStorage.getItem("user-id"));

    const copyToClipboard = () => {
        navigator.clipboard.writeText(classId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    };

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.post("https://edtech-ai-mc8u.onrender.com/class-details-analytics", {
                    class_id: classId
                });

                const apiData = response.data;

                // --- DATA TRANSFORMATION LOGIC ---
                // Transform the API data into the structure the component needs.
                const transformedData = {
                    classId: classId,
                    // API doesn't provide these, so we'll use placeholders or the classId.
                    className: `Class Overview: ${classId}`,
                    subject: 'Student Performance Analytics',
                    avgPerformance: apiData.average_completion_rate,
                    // Map the 'performance' array from the API to the 'students' array format.
                    students: apiData.performance.map(perf => {
                        // The API response has separate 'id' and 'name' arrays.
                        // We find the index of the current student's ID to get their name.
                        const studentIndex = apiData.id.indexOf(perf.user_id);
                        const studentName = studentIndex !== -1 ? apiData.name[studentIndex] : 'Unknown Student';

                        // The API doesn't provide an 'attentionScore'. We can derive it from progress.
                        // This is an example rule: low progress means high attention is needed.
                        let attentionScore = 'low';
                        if (perf.progress_percent < 50) {
                            attentionScore = 'high';
                        } else if (perf.progress_percent < 80) {
                            attentionScore = 'medium';
                        }

                        return {
                            id: perf.user_id,
                            name: studentName,
                            // Generate a consistent avatar using the student's ID
                            avatar: `https://i.pravatar.cc/40?u=${perf.user_id}`,
                            progress: perf.progress_percent,
                            attentionScore: attentionScore,
                        };
                    })
                };

                setClassData(transformedData);
                setError(null);

            } catch (err) {
                console.error("Error fetching class details:", err);
                setError("Failed to load class details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchClassDetails();
    }, [classId]); // Re-run effect if classId changes

    // Helper function to set CSS class based on attention score
    const getAttentionScoreClass = (score) => {
        if (score === 'high') return 'attention-high';
        if (score === 'medium') return 'attention-medium';
        return 'attention-low';
    };

    // --- RENDER LOGIC ---

    if (loading) {
        return <div className="loading-state">Loading Class Details...</div>;
    }

    if (error) {
        return <div className="error-state">{error}</div>;
    }

    // Ensure classData is not null before proceeding
    if (!classData) {
        return <div className="loading-state">No data available for this class.</div>;
    }

    // Filter students based on search term (now uses data from state)
    const filteredStudents = classData.students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-class-page">
            {showclassid && <div className="success-modal-overlay">
                <div className="success-modal-card">
                    <FiCheckCircle className="success-modal-icon" />
                    <h2>Class ID!</h2>
                    <p>Share this class id with your students.</p>
                    <div className="class-id-display">
                        <span>Your unique Class ID is:</span>
                        <strong>{classId}</strong>
                        <button onClick={copyToClipboard} className="copy-id-button">
                            {isCopied ? <><FiCheckCircle /> Copied!</> : <><FiCopy /> Copy ID</>}
                        </button>
                    </div>
                    <button onClick={() => setShowclassid(false)} className="create-another-button">
                        Done
                    </button>
                </div>
            </div>}
            <header className="page-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                    <span>Back</span>
                </button>
                <div className="header-actions">
                    <button onClick={() => setShowclassid(true)} className="add-student-button">
                        <FiPlus />
                        <span>Add Student</span>
                    </button>
                </div>
            </header>

            <div className="class-title-header">
                <h1>{classData.className}</h1>
                <p>{classData.subject}</p>
            </div>

            <div className="class-stats-grid">
                <div className="stat-card-mini">
                    <div className="stat-icon-mini"><FiUsers /></div>
                    <div className="stat-info-mini">
                        <span className="stat-value-mini">{classData.students.length}</span>
                        <span className="stat-label-mini">Enrolled Students</span>
                    </div>
                </div>
                <div className="stat-card-mini">
                    <div className="stat-icon-mini"><FiBarChart2 /></div>
                    <div className="stat-info-mini">
                        <span className="stat-value-mini">{classData.avgPerformance}%</span>
                        <span className="stat-label-mini">Avg. Completion</span>
                    </div>
                </div>
            </div>

            <div className="student-roster-card">
                <div className="roster-controls">
                    <h2>Student Roster</h2>
                    <div className="search-bar">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="student-list">
                    <div className="student-list-item header">
                        <span className="student-name">Student Name</span>
                        <span className="student-progress">Progress</span>
                        <span className="student-attention">Attention Required</span>
                    </div>

                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <div key={student.id} className="student-list-item">
                                <div className="student-name">
                                    <img src={`https://placehold.co/128x128/1d1d1f/f5f5f7?text=${student.name}&font=inter'`} alt={student.name} className="student-avatar" />
                                    <span>{student.name}</span>
                                </div>
                                <div className="student-progress">
                                    <div className="bar-container">
                                        <div className="bar-fill" style={{ width: `${student.progress}%` }}></div>
                                    </div>
                                    <span>{student.progress}%</span>
                                </div>
                                <div className="student-attention">
                                    <span className={`attention-tag ${getAttentionScoreClass(student.attentionScore)}`}>
                                        {student.attentionScore}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="student-list-item empty">
                            No students found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageClassPage;