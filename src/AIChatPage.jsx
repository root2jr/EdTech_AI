import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { FiSend } from 'react-icons/fi';
import './AIChatPage.css';
import axios from "axios"
import TopNav from './TopNav';
import { FiHome,  FiX ,FiBarChart2, FiCpu, FiUser } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';


const AIChatPage = ({state}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const lessonContext = location.state?.lessonContext;
    const [context, setContext] = useState(lessonContext);
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

        setTimeout(async () => {
            const airesponse = await axios.post("http://127.0.0.1:8000/ai", {
                prompt: "Lesson Summary(If this field is undefined or empty dont consider it):"+ context.summary + inputValue,
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
                 {context && (
                    <div className="context-banner">
                        <div className="context-text">
                            <strong>Context:</strong>
                            <span>{context.title}</span>
                        </div>
                        <button onClick={() => setContext(null)} className="dismiss-button">
                            <FiX />
                        </button>
                    </div>
                )}
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