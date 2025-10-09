import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiBell, FiArrowLeft } from 'react-icons/fi';
import './NotificationsPage.css';
import axios from 'axios';

const NotificationsPage = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("profiledata"));
    const userEmail = userData.email;
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    useEffect(() => {
        const notification = localStorage.getItem("notifications");
        if (notification) {
            setNotificationsEnabled(notification);
        }
        else {
           setNotificationsEnabled(true);
           localStorage.setItem("notifications", true);
        }

    }, [])
    // State to manage the notification toggle

    const handleToggle = async () => {
        setNotificationsEnabled(prevState => !prevState);
        const userid = localStorage.getItem("user-id");
        try {
            const response = await axios.post("https://edtech-ai-mc8u.onrender.com/togglenotifications",{
                user_id: userid,
                push_notifications: notificationsEnabled
            })
            console.log(response.data);
        } catch (error) {
            console.error("Error:",error);
        }
        console.log(`Notifications ${!notificationsEnabled ? 'Enabled' : 'Disabled'}`);
    };

    return (
        <div className="notifications-page">
            <div className="notifications-card">
                <button className="back-button-notifications" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                    <span>Back to Profile</span>
                </button>

                <div className="notifications-header">
                    <h1>Notifications</h1>
                    <p>Manage how you receive updates from EdTech AI.</p>
                </div>

                <div className="notifications-content">
                    {/* Email Display Section */}
                    <div className="notification-item">
                        <div className="item-icon">
                            <FiMail />
                        </div>
                        <div className="item-details">
                            <h3>Email Address</h3>
                            <p>Notifications will be sent to this address.</p>
                            <span className="email-display">{userEmail}</span>
                        </div>
                    </div>

                    {/* Notification Toggle Section */}
                    <div className="notification-item">
                        <div className="item-icon">
                            <FiBell />
                        </div>
                        <div className="item-details">
                            <h3>Push Notifications</h3>
                            <p>Enable or disable app and browser notifications.</p>
                        </div>
                        <div className="item-action">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={notificationsEnabled}
                                    onChange={handleToggle}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
