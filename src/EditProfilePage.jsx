import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiSave, FiArrowLeft, FiLoader } from 'react-icons/fi';
import './EditProfilePage.css';
import axios from 'axios';

const EditProfilePage = () => {
    const navigate = useNavigate();
    
 
    const [username, setUsername] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const userData = JSON.parse(localStorage.getItem("profiledata"));
    const [currentUser, setCurrentUser] = useState({
        username: userData.name,
        email: userData.email 
    });
    

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username);
        }
    }, [currentUser]);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // --- API call would go here ---
        console.log(`Saving new username: ${username}`);
        try{
           const user_id = localStorage.getItem("user-id"); 
           const response = await axios.post("https://edtech-ai-mc8u.onrender.com/change-username", {
            user_id: user_id,
            NewUserName: username
           })
           console.log(response.data);
           localStorage.setItem("edit",true)
        }
        catch(error){
            console.error("Error:",error);
        }
        
        // Simulate network delay
        setTimeout(() => {
            setIsSaving(false);
            alert("Username updated successfully!");
            navigate(-1); // Navigate back to the profile page
        }, 2000);
    };

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-card">
                <button className="back-button-edit" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                    <span>Back to Profile</span>
                </button>

                <div className="edit-profile-header">
                    <h1>Edit Profile</h1>
                    <p>Update your public username below.</p>
                </div>

                <form onSubmit={handleSaveChanges} className="edit-profile-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper disabled">
                            <input
                                type="email"
                                id="email"
                                value={currentUser.email}
                                disabled // Email is not editable
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <FiUser className="input-icon" />
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your new username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="save-button" disabled={isSaving}>
                        {isSaving ? (
                            <FiLoader className="loading-spinner" />
                        ) : (
                            <>
                                <FiSave />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
