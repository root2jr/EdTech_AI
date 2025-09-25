import React, { useState } from 'react';
import { FiBookOpen, FiTag, FiYoutube, FiFileText, FiPlus } from 'react-icons/fi';
import './CreateLessonPage.css';
import axios from 'axios';
import { MdDescription } from 'react-icons/md';

const CreateLessonPage = () => {
    const [lessonName, setLessonName] = useState('');
    const [subject, setSubject] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [oneLiner, setOneLiner] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleCreateLesson = async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        setIsSaving(true);

        const lessonData = { lessonName, subject, videoUrl, oneLiner };
        try{
          const response = await axios.post("https://edtech-ai-mc8u.onrender.com/newlesson",{
            title: lessonName,
            url: videoUrl,
            subject: subject,
            description: oneLiner,
            username:"jram6269@gmail.com",
            classid: "322J"
          });
          console.log(response.data);
        } 
        catch(e){
            console.error("Error saving lesson:",e);
        }

        // Simulate an API call
        setTimeout(() => {
            setIsSaving(false);
          
        }, 2000);
    };

    return (
        <div className="create-lesson-page">
            <div className="create-lesson-card">
                <div className="create-lesson-header">
                    <h1>Create New Lesson</h1>
                    <p>Fill in the details below to add a new lesson to the curriculum.</p>
                </div>

                <form onSubmit={handleCreateLesson} className="create-lesson-form">
                    {/* Lesson Name */}
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