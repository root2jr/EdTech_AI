import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiSave, FiLoader } from 'react-icons/fi';
import './SecurityPage.css';
import axios from 'axios';

const SecurityPage = () => {
    const navigate = useNavigate();

    // State for form inputs
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const changePass = async () =>{
         try {
            const userid = localStorage.getItem("user-id");
            const response = await axios.post("https://edtech-ai-mc8u.onrender.com/change-password",{
                user_id: userid,
                current_pass: currentPassword,
                new_pass: newPassword
            })
            console.log(response.data);
         } catch (error) {
            console.error("Error:",error)
         }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Basic validation
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }

        setIsSaving(true);

        // --- API call would go here ---
        console.log({
            currentPassword,
            newPassword
        });
        await changePass();
        // Simulate network delay
        setTimeout(() => {
            setIsSaving(false);
            alert("Password updated successfully!");
            navigate(-1); // Navigate back to the profile page
        }, 2000);
    };

    return (
        <div className="security-page">
            <div className="security-card">
                <button className="back-button-security" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                    <span>Back to Profile</span>
                </button>

                <div className="security-header">
                    <h1>Security & Password</h1>
                    <p>Update your password to keep your account secure.</p>
                </div>

                <form onSubmit={handlePasswordChange} className="security-form">
                    {/* Current Password */}
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <div className="input-wrapper">
                            <FiLock className="input-icon" />
                            <input
                                type="password"
                                id="currentPassword"
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="input-wrapper">
                            <FiLock className="input-icon" />
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="Enter a new password (min. 8 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="input-wrapper">
                            <FiLock className="input-icon" />
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="save-button" disabled={isSaving}>
                        {isSaving ? (
                            <FiLoader className="loading-spinner" />
                        ) : (
                            <>
                                <FiSave />
                                <span>Update Password</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SecurityPage;
