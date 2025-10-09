import React, { useState, useEffect } from 'react';
import TopNav from './TopNav';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import './MainPage.css';
// 1. Import the new icon for the Explore page
import { FiHome, FiBarChart2, FiCpu, FiUser, FiCompass } from 'react-icons/fi';
import AIChatPage from './AIChatPage';
import AnalyticsPage from './AnalyticsPage';
import ProfilePage from './ProfilePage';
import { useLocation, useNavigate } from 'react-router-dom';
// 2. Import the new ExplorePage component
import ExplorePage from './ExplorePage';


const MainPage = () => {
    const [userRole, setUserRole] = useState('Student');
    const [userid, setUserid] = useState(localStorage.getItem("user-id"));
    const [isLoading, setIsLoading] = useState(true);
    const [active, setActive] = useState('home');
    const [ai, setAi] = useState(false);
    const [component, setComponent] = useState('home');
    const location = useLocation();
    const activecomp = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        console.log(activecomp);
        setComponent(activecomp ? activecomp : "home");
    }, [activecomp])

    // 3. Add the 'Explore' item to your navigation array
    const navItems = [
        { id: 'home', icon: <FiHome />, label: 'Home' },
        { id: 'analytics', icon: <FiBarChart2 />, label: 'Analytics' },
        { id: 'explore', icon: <FiCompass />, label: 'Explore' }, // New item added here
        { id: 'ai', icon: <FiCpu />, label: 'AI' },
        { id: 'profile', icon: <FiUser />, label: 'Profile' },
    ];

    // Simulate data fetching
    useEffect(() => {
        setUserRole(localStorage.getItem("role") ? localStorage.getItem("role") : "student");
        setUserid(localStorage.getItem("user-id"));

    }, [userRole]);

    useEffect(() => {
        const role = localStorage.getItem("role");
        const userid = localStorage.getItem("user-id");
        const jwt = localStorage.getItem("jwt");
        if (!role || !userid || !jwt) {
            navigate("/");
        }
    }, [])



    return (
        <div className="main-page-layout">
            <TopNav />



            <main className="main-content">
                {component === "home" ? userRole === 'Student' ? (
                    <StudentDashboard />
                ) : (
                    <TeacherDashboard />
                ) : null}
                {component === "analytics" ? <AnalyticsPage /> : null}
                {/* 4. Add the rendering logic for the ExplorePage */}
                {component === "explore" ? <ExplorePage /> : null}
                {component === "ai" ? <AIChatPage /> : null}
                {component === "profile" ? <ProfilePage /> : null}
            </main>

            <footer className="bottom-nav">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${active === item.id ? 'active' : ''}`}
                        onClick={() => { setActive(item.id); setComponent(item.id); }}
                    >
                        <div className="nav-icon">{item.icon}</div>
                        <div className="nav-label">{item.label}</div>
                    </div>
                ))}
            </footer>
        </div>
    );
};

export default MainPage;
