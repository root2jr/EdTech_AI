import React, { useState } from 'react';
import { FiBookOpen, FiTag, FiFileText, FiUsers, FiPlus, FiX, FiCheckCircle, FiCopy } from 'react-icons/fi';
import './CreateClassPage.css';
import axios from 'axios';

const CreateClassPage = () => {
    // Form state
    const [className, setClassName] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    
    // State for the interactive student input
    const [studentInput, setStudentInput] = useState('');
    const [students, setStudents] = useState(['s.patel@example.com', 'a.sharma@example.com']);
    
    // State for submission and success modal
    const [isSaving, setIsSaving] = useState(false);
    const [generatedClassId, setGeneratedClassId] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const generateClassId = (subj) => {
        const prefix = subj.substring(0, 4).toUpperCase();
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${randomPart}`;
    };


    const handleCreateClass = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        const newClassId = generateClassId(subject);
        const classData = { classId: newClassId,className: className, subject: subject, description: description, schoolid: "S002", teacher: "Jayaram"};
        try{
          const response = await axios.post("http://127.0.0.1:8000/createclass",
              classData
          );
          console.log(response.data);
        }
        catch(error){
            console.error("Error:", error);
        }

        console.log("Creating class with data:", classData);

        setTimeout(() => {
            setIsSaving(false);
            setGeneratedClassId(newClassId); // Show success modal with the new ID
        }, 2000);
    };

    const resetForm = () => {
        setClassName('');
        setSubject('');
        setDescription('');
        setStudents([]);
        setGeneratedClassId(null);
        setIsCopied(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedClassId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    };

    return (
        <div className="create-class-page">
            <div className="create-class-card">
                <div className="create-class-header">
                    <h1>Create New Class</h1>
                    <p>Enter the details below to set up a new class for your students.</p>
                </div>

                <form onSubmit={handleCreateClass} className="create-class-form">
                    {/* ... (Your existing form-groups for Class Name, Subject, Description) ... */}
                    
                    {/* --- This is the original form content --- */}
                    <div className="form-group">
                         <label htmlFor="className">Class Name</label>
                         <div className="input-wrapper">
                             <FiBookOpen className="input-icon" />
                             <input type="text" id="className" placeholder="e.g., Grade 10 - Physics" value={className} onChange={(e) => setClassName(e.target.value)} required />
                         </div>
                     </div>
                     <div className="form-group">
                         <label htmlFor="subject">Subject</label>
                         <div className="input-wrapper">
                             <FiTag className="input-icon" />
                             <input type="text" id="subject" placeholder="e.g., Science" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                         </div>
                     </div>
                     <div className="form-group">
                         <label htmlFor="description">Class Description</label>
                         <div className="input-wrapper">
                             <FiFileText className="input-icon textarea-icon" />
                             <textarea id="description" placeholder="A brief summary of the class curriculum." value={description} onChange={(e) => setDescription(e.target.value)} required rows="3"></textarea>
                         </div>
                     </div>
                    {/* --- End of original form content --- */}

                    {/* Add Students Input */}
                   

                    <button type="submit" className="create-class-button" disabled={isSaving}>
                        {isSaving ? 'Saving...' : <><FiPlus /><span>Create Class</span></>}
                    </button>
                </form>
            </div>

            {/* --- NEW: Success Modal --- */}
            {generatedClassId && (
                <div className="success-modal-overlay">
                    <div className="success-modal-card">
                        <FiCheckCircle className="success-modal-icon" />
                        <h2>Class Created Successfully!</h2>
                        <p>Your new class, "{className}", is ready.</p>
                        <div className="class-id-display">
                            <span>Your unique Class ID is:</span>
                            <strong>{generatedClassId}</strong>
                            <button onClick={copyToClipboard} className="copy-id-button">
                                {isCopied ? <><FiCheckCircle/> Copied!</> : <><FiCopy/> Copy ID</>}
                            </button>
                        </div>
                        <button onClick={resetForm} className="create-another-button">
                            Create Another Class
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateClassPage;