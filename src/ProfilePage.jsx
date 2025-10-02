import React, { useEffect, useState } from 'react';
import { FiEdit2, FiBell, FiShield, FiHelpCircle, FiLogOut, FiChevronRight } from 'react-icons/fi';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user-id");
    
    const [userData, setUserData] = useState({
        name: "",
        email: '',
        role: '',
        joinDate: '',
        school:"",
        avatarUrl: ''
    });

    const menuItems = [
        { icon: <FiEdit2 />, text: 'Edit Profile' },
        { icon: <FiBell />, text: 'Notifications' },
        { icon: <FiShield />, text: 'Security & Password' },
        { icon: <FiHelpCircle />, text: 'Help & Support' },
    ];

    const handle_logout = () => {
          localStorage.clear();
          navigate("/");
    }

    useEffect(() => {
        const fetch_data = async () => {
            try{
                const response = await axios.post("http://127.0.0.1:8000/fetch-user-details",{
                    user_id: user_id
                });
                console.log(response.data);
                setUserData(response.data);
            }
            catch(e){
                console.error("Error:",e);
            }
        }
        fetch_data();
    },[])
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