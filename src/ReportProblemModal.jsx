import React, { useState } from 'react';
import { FiX, FiSend, FiLoader } from 'react-icons/fi';
import './ReportProblemModal.css';
import axios from 'axios';

// Emoji feedback options
const feedbackEmojis = [
    { emoji: '😞', label: 'Very Bad' },
    { emoji: '😟', label: 'Bad' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😄', label: 'Great' },
];

const ReportProblemModal = ({ isOpen, onClose, classInfo }) => {
    const [description, setDescription] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim() || !selectedFeedback) {
            alert('Please provide a description and select a feedback rating.');
            return;
        }

        try {
            const userid = localStorage.getItem("user-id");
            const response = await axios.post("https://edtech-ai-mc8u.onrender.com/report",{
                class_id: classInfo?.classId,
                user_id: userid,
                report: description,
                experience: selectedFeedback
            })
        } catch (error) {
            console.error("Error:",error);
        }

        setIsSubmitting(true);
        console.log({
            classId: classInfo?.classId,
            className: classInfo?.className,
            feedback: selectedFeedback,
            description,
        });

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Your report has been submitted. Thank you!');
            onClose(); // Close the modal on success
        }, 2000);
    };

    // If the modal isn't open, render nothing
    if (!isOpen) {
        return null;
    }

    return (
        <div className="report-problem-overlay" onClick={onClose}>
            <div className="report-problem-card" onClick={e => e.stopPropagation()}>
                <div className="report-problem-header">
                    <h2>Report a Problem</h2>
                    <p>Tell us what went wrong with the class: <strong>{classInfo?.className || 'this class'}</strong></p>
                    <button className="close-modal-button" onClick={onClose}><FiX /></button>
                </div>

                <form onSubmit={handleSubmit} className="report-problem-form">
                    <div className="form-group">
                        <label>How was your experience?</label>
                        <div className="emoji-feedback-container">
                            {feedbackEmojis.map(({ emoji, label }) => (
                                <div 
                                    key={label}
                                    className={`emoji-option ${selectedFeedback === label ? 'selected' : ''}`}
                                    onClick={() => setSelectedFeedback(label)}
                                >
                                    <span className="emoji">{emoji}</span>
                                    <span className="emoji-label">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="problemDescription">Describe the problem</label>
                        <textarea
                            id="problemDescription"
                            placeholder="Please provide as much detail as possible..."
                            rows="5"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="report-problem-footer">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? <FiLoader className="loading-spinner" /> : <><FiSend /><span>Submit Report</span></>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportProblemModal;
