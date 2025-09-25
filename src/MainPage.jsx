import React, { useState, useEffect } from 'react';
import TopNav from './TopNav';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import './MainPage.css';
import { FiHome, FiBarChart2, FiCpu, FiUser } from 'react-icons/fi';
import AIChatPage from './AIChatPage';
import AnalyticsPage from './AnalyticsPage';
import ProfilePage from './ProfilePage';


const MainPage = () => {
    const [userRole, setUserRole] = useState('student');
    const [isLoading, setIsLoading] = useState(true);
    const [active, setActive] = useState('home');
    const [ai, setAi] = useState(false);
    const [component, setComponent] = useState('home');

    const navItems = [
        { id: 'home', icon: <FiHome />, label: 'Home' },
        { id: 'analytics', icon: <FiBarChart2 />, label: 'Analytics' },
        { id: 'ai', icon: <FiCpu />, label: 'AI' },
        { id: 'profile', icon: <FiUser />, label: 'Profile' },
    ];

    // Simulate data fetching
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500); // Simulate a 2.5-second load time

        return () => clearTimeout(timer);
    }, [userRole]); 

    const toggleRole = () => {
        setUserRole(prevRole => (prevRole === 'student' ? 'teacher' : 'student'));
    };

    return (
        <div className="main-page-layout">
            <TopNav />

            <button onClick={toggleRole} className="role-toggle-btn">
                Switch to {userRole === 'student' ? 'Teacher' : 'Student'} View
            </button>

            <main className="main-content">
               { component == "home" ?userRole === 'student' ? (
                    <StudentDashboard isLoading={isLoading} />
                ) : (
                    <TeacherDashboard isLoading={isLoading} />
                ):null}
                {component == "ai"? <AIChatPage />: null}
                {component == "analytics"? <AnalyticsPage />: null}
                {component == "profile"? <ProfilePage />: null}
            </main>

            <footer className="bottom-nav">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${active === item.id ? 'active' : ''}`}
                        onClick={() => {setActive(item.id); setComponent(item.id);}}
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