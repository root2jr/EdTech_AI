import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { FiMessageCircle } from 'react-icons/fi'; // For the floating AI button
import './LessonPage.css';

const LessonPage = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate

    // Mock lesson data (in a real app, this would come from props or a state management system)
    const lesson = {
        id: 'L001',
        title: 'Introduction to Classical Mechanics',
        videoUrl: "https://www.youtube.com/embed/H5FAxTBuNM8?si=1xWZPf5CAc_8iwUl", // Example YouTube embed
        summary: `
            This lesson provides a foundational understanding of classical mechanics, a branch of physics that describes the motion of macroscopic objects, from projectiles to parts of machinery, and astronomical objects, such as spacecraft, planets, stars, and galaxies.

            We cover the fundamental principles introduced by Isaac Newton, including:
            \n- **Newton's First Law:** Inertia and constant velocity.
            \n- **Newton's Second Law:** Force, mass, and acceleration (F=ma).
            \n- **Newton's Third Law:** Action and reaction pairs.

            Key concepts such as displacement, velocity, acceleration, mass, and force are defined. The lecture also touches upon the concept of a reference frame and how it impacts the observation of motion. We explore examples like falling objects, simple pendulums, and objects sliding on inclined planes to illustrate these concepts in a practical context.

            Understanding classical mechanics is crucial for advanced studies in physics and engineering, forming the bedrock upon which more complex theories (like quantum mechanics and relativity) are built. This module aims to equip students with the analytical tools to solve basic problems involving forces and motion.
        `,
        // You could also add topics, questions, etc.
    };

    const handleAskAI = () => {
        // Navigate to the AI chat page, potentially with some context/prompt pre-filled
        navigate('/ai', { state: { initialPrompt: `Can you explain more about ${lesson.title}?` } });
    };

    return (
        <div className="lesson-page-container">
            <div className="lesson-video-player">
                {/* Responsive embed for YouTube, Vimeo, etc. */}
                <iframe
                    src={lesson.videoUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="lesson-content">
                <h1 className="lesson-title">{lesson.title}</h1>
                <div className="lesson-summary">
                    <h3>Lesson Summary</h3>
                    {/* Render summary content, preserving newlines for readability */}
                    {lesson.summary.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                    <button onClick={() => {navigate("/mcq")}}>Read</button>
                </div>
            </div>

            {/* Floating Action Button for AI chat */}
            <button className="ask-ai-fab" onClick={handleAskAI}>
                <FiMessageCircle />
                <span>Ask AI</span>
            </button>
        </div>
    );
};

export default LessonPage;