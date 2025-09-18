import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { FiSend } from 'react-icons/fi';
import './AIChatPage.css';
import axios from "axios"
import TopNav from './TopNav';
import { FiHome, FiBarChart2, FiCpu, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const AIChatPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            parts: [{ type: 'text', content: "Hello! I'm EdTech AI. How can I help you with your studies today?" }]
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [active, setActive] = useState('home');
    const [component, setComponent] = useState('home');
    const [isTyping, setIsTyping] = useState(false);
    const chatHistoryRef = useRef(null);
    const navItems = [
        { id: 'home', icon: <FiHome />, label: 'Home' },
        { id: 'analytics', icon: <FiBarChart2 />, label: 'Analytics' },
        { id: 'ai', icon: <FiCpu />, label: 'AI' },
        { id: 'profile', icon: <FiUser />, label: 'Profile' },
    ];

    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            sender: 'user',
            parts: [{ type: 'text', content: inputValue }]
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(async () => {
            const airesponse = await axios.post(" https://edtech-ai-mc8u.onrender.com/ai", {
                prompt: inputValue,
                username: "jram6269@gmail.com",
                time: "12:00am"
            })
            setIsTyping(false);
            setMessages(prev => [...prev, airesponse.data.message]);
        }, 2500); // Simulate network delay
    };

    return (
        <div className="ai-chat-page">
            <TopNav />
            <div className="chat-history" ref={chatHistoryRef}>
                {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
            </div>

            <div className="chat-input-area">
                <div className="suggested-prompts">
                </div>
                <form
                    className="chat-input-form"
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask EdTech AI anything..."
                        className="chat-input"
                    />
                    <button type="submit" className="send-button">
                        <FiSend />
                    </button>
                </form>
            </div>
            <footer className="bottom-nav">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${active === item.id ? 'active' : ''}`}
                        onClick={() => { navigate("/mainpage") }}
                    >
                        <div className="nav-icon">{item.icon}</div>
                        <div className="nav-label">{item.label}</div>
                    </div>
                ))}
            </footer>
        </div>
    );
};

export default AIChatPage;