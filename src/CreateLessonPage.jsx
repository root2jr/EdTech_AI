import React, { useState, useEffect } from 'react'; // Import useEffect
import { FiBookOpen, FiTag, FiYoutube, FiFileText, FiPlus, FiServer } from 'react-icons/fi'; // Add FiServer icon
import './CreateLessonPage.css';
import axios from 'axios';
import { MdDescription } from 'react-icons/md';

const CreateLessonPage = () => {
    // Form state
    const [lessonName, setLessonName] = useState('');
    const [subject, setSubject] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [userid, setUserid] = useState(localStorage.getItem("user-id"));
    const [mockClasses, setMockClasses] = useState([
        { _id: 'mock1', classId: 'QUAN-OVLV7D', className: 'Grade 10 - Quantum Physics' },
        { _id: 'mock2', classId: 'MATH-L2K4Z7', className: 'Grade 11 - Calculus' },
        { _id: 'mock3', classId: 'HIST-P9A1B3', className: 'Grade 9 - World History' },
    ]);
    const [oneLiner, setOneLiner] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    const [teacherClasses, setTeacherClasses] = useState([]); // Stores classes teacher handles
    const [selectedClassId, setSelectedClassId] = useState(''); // Stores the currently selected class ID

    useEffect(() => {
        const fetchTeacherClasses = async () => {
            try {
                
                const response = await axios.post("https://edtech-ai-mc8u.onrender.com/fetch-teacher-class", {
                    user_id: userid
                })
                console.log(response.data);
                const classes = response.data.message;
                setTeacherClasses(classes);
                if (classes.length > 0) {
                    setSelectedClassId(classes[0].classId);
                }
            }
            catch (error) {
                console.error("Error:", error);
            }


        };
        fetchTeacherClasses();
    }, []); // Empty dependency array means this runs once on mount

    const generateLessonId = (subj) => { // Renamed from generateClassId for clarity
        const prefix = subj.substring(0, 4).toUpperCase();
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${randomPart}`;
    };

    const handleCreateLesson = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Validate that a class has been selected
        if (!selectedClassId) {
            alert('Please select a class for the lesson.');
            setIsSaving(false);
            return;
        }

        const lessonId = generateLessonId(subject); // Use new lesson ID generator

        try {
            const response = await axios.post("https://edtech-ai-mc8u.onrender.com/newlesson", {
                title: lessonName,
                url: videoUrl,
                subject: subject,
                description: oneLiner,
                user_id: userid,
                classid: selectedClassId,
                lesson_id: lessonId
            });
            console.log(response.data);
            alert('Lesson created successfully!'); // Or show a more elegant success modal
            // Reset form fields after successful creation
            setLessonName('');
            setSubject('');
            setVideoUrl('');
            setOneLiner('');
        } catch (error) {
            console.error("Error saving lesson:", error);
            alert('Failed to create lesson. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="create-lesson-page">
            <div className="create-lesson-card">
                <div className="create-lesson-header">
                    <h1>Create New Lesson</h1>
                    <p>Fill in the details below to add a new lesson to the curriculum.</p>
                </div>

                <form onSubmit={handleCreateLesson} className="create-lesson-form">
                    {/* Class Name */}
                    <div className="form-group">
                        <label htmlFor="lessonName">Lesson Name</label>
                        <div className="input-wrapper">
                            <FiBookOpen className="input-icon" />
                            <input
                                type="text"
                                id="lessonName"
                                placeholder="e.g., Introduction to Photosynthesis"
                                value={lessonName}
                                onChange={(e) => setLessonName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <div className="input-wrapper">
                            <FiTag className="input-icon" />
                            <input
                                type="text"
                                id="subject"
                                placeholder="e.g., Biology"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* YouTube Video URL */}
                    <div className="form-group">
                        <label htmlFor="videoUrl">YouTube Video URL</label>
                        <div className="input-wrapper">
                            <FiYoutube className="input-icon" />
                            <input
                                type="url"
                                id="videoUrl"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* One-Liner Description */}
                    <div className="form-group">
                        <label htmlFor="oneLiner">One-Liner Description</label>
                        <div className="input-wrapper">
                            <FiFileText className="input-icon textarea-icon" />
                            <textarea
                                id="oneLiner"
                                placeholder="A brief summary of what this lesson covers."
                                value={oneLiner}
                                onChange={(e) => setOneLiner(e.target.value)}
                                required
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    {/* --- NEW: Class Selection Dropdown --- */}
                    <div className="form-group">
                        <label htmlFor="classSelect">Assign to Class</label>
                        <div className="input-wrapper select-wrapper"> {/* Added select-wrapper for custom icon */}
                            <FiServer className="input-icon" />
                            <select
                                id="classSelect"
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                required
                                className="styled-select" // Apply custom styling
                            >
                                {teacherClasses.length > 0 ? (
                                    teacherClasses.map(cls => (
                                        <option key={cls._id} value={cls.classId}>
                                            {cls.className} ({cls.classId})
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No classes available</option>
                                )}
                            </select>
                        </div>
                    </div>
                    {/* --- END NEW DROPDOWN --- */}

                    <button type="submit" className="create-lesson-button" disabled={isSaving}>
                        {isSaving ? 'Saving...' : (
                            <>
                                <FiPlus />
                                <span>Create Lesson</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLessonPage;
