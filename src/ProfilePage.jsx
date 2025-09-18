import React from 'react';
import { FiEdit2, FiBell, FiShield, FiHelpCircle, FiLogOut, FiChevronRight } from 'react-icons/fi';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    // In a real application, this data would come from a user context or API
    const userData = {
        name: 'Sahana',
        email: 'sahana@edtechai.com',
        role: 'Student',
        joinDate: 'September 1, 2025',
        school:"Prince Matriculation Higher Secondary School",
        // Using a monochrome placeholder that fits the theme
        avatarUrl: 'https://placehold.co/128x128/1d1d1f/f5f5f7?text=SR&font=inter'
    };

    const menuItems = [
        { icon: <FiEdit2 />, text: 'Edit Profile' },
        { icon: <FiBell />, text: 'Notifications' },
        { icon: <FiShield />, text: 'Security & Password' },
        { icon: <FiHelpCircle />, text: 'Help & Support' },
    ];

    const handle_logout = () => {
          navigate("/");
    }
    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={userData.avatarUrl} alt="User Avatar" className="profile-avatar" />
                <h1 className="profile-name">{userData.name}</h1>
                <p className="profile-email">{userData.email}</p>
            </div>

            <div className="profile-card profile-details-card">
                <div className="detail-item">
                    <span className="detail-label">Role</span>
                    <span className="detail-value">{userData.role}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Joined</span>
                    <span className="detail-value">{userData.joinDate}</span>
                </div>
               
            </div>

            <div className="profile-card profile-menu">
                {menuItems.map((item, index) => (
                    <div className="menu-item" key={index}>
                        <div className="menu-item-content">
                            <span className="menu-icon">{item.icon}</span>
                            <span className="menu-text">{item.text}</span>
                        </div>
                        <FiChevronRight className="menu-chevron" />
                    </div>
                ))}
            </div>

            <button onClick={handle_logout} className="logout-button">
                <FiLogOut />
                <span>Log Out</span>
            </button>
        </div>
    );
};

export default ProfilePage;