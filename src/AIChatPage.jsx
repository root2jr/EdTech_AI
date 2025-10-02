import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import TopNav from './TopNav';
import { FiSend, FiX } from 'react-icons/fi';
import './AIChatPage.css';
import axios from "axios";
import { FiHome, FiBarChart2, FiCpu, FiUser, FiCompass } from 'react-icons/fi';

const AIChatPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // This hook cleanly gets the context passed from the LessonPage
    const lessonContext = location.state?.lessonContext;
    const [promptneed, setPromptneed] = useState(true);
    const [memoryContext, setMemoryContext] = useState([]);
    const [context, setContext] = useState(lessonContext);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatHistoryRef = useRef(null);
    const [active, setActive] = useState('home');
    const [ai, setAi] = useState(false);
    const [component, setComponent] = useState('home');
    const [userid, setUserid] = useState(localStorage.getItem("user-id"));

    const navItems = [
        { id: 'home', icon: <FiHome />, label: 'Home' },
        { id: 'analytics', icon: <FiBarChart2 />, label: 'Analytics' },
        { id: 'explore', icon: <FiCompass />, label: 'Explore' }, // New item added here
        { id: 'ai', icon: <FiCpu />, label: 'AI' },
        { id: 'profile', icon: <FiUser />, label: 'Profile' },
    ];

    const suggestedPrompts = [
        "Explain this topic simply",
        "Give me a real-world example",
        "Create a practice question"
    ];

    useEffect(() => {
        const memory = JSON.parse(localStorage.getItem("memory"));
        if (memory) {
            setMessages(memory);
            setMemoryContext(memory);
        }

    }, [])


   

    // This effect handles auto-scrolling to the latest message
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
         if (messages.length > 0) {
            localStorage.setItem("memory", JSON.stringify(messages));
            setMemoryContext(messages.slice(-6));
        }

    }, [messages]);

    const handleSendMessage = async (promptText = inputValue) => {
        if (promptText.trim() === '') return;

        const userMessage = {
            id: crypto.randomUUID(),
            sender: 'user',
            parts: [{ type: 'text', content: promptText }]
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // The prompt is intelligently constructed based on whether context exists
        console.log(memoryContext);
        const promptWithContext = context
            ? `memory:${JSON.stringify(memoryContext, null, 2)} \nBased on the following summary about "${context.title}":\n\n${context.summary}\n\nMy question is: ${promptText} \n Note: Just respond to the message considering the factors no need to mention anything be it memory or anything since it will be directly displayed to the user.`
            : `memory:${JSON.stringify(memoryContext, null, 2)}\n User's Prompt:${promptText} \n Note: Just respond to the message considering the factors no need to mention anything be it memory or anything since it will be directly displayed to the user. `;

        try {
            const aiResponse = await axios.post("https://edtech-ai-mc8u.onrender.com/ai", {
                prompt: promptWithContext,
                username: userid, // This should be dynamic from auth state
                time: new Date().toLocaleTimeString()
            });

            // Directly use the AI response without any mock formatting
            aiResponse.data.message.id = crypto.randomUUID();
            setMessages(prev => [...prev, aiResponse.data.message]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMessage = {
                id: Date.now(),
                sender: 'ai',
                parts: [{ type: 'text', content: "Sorry, I couldn't connect to the AI. Please try again later." }]
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="ai-chat-layout">
            <TopNav />
            <div className="ai-chat-container">
                <div className="chat-history" style={{ paddingBottom: context && promptneed ? 200 : (context || promptneed ? 150 : 100) }} ref={chatHistoryRef}>
                    {messages.map(msg => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isTyping && <TypingIndicator />}
                </div>

                <div className="chat-input-area">
                    {context && (
                        <div className="context-banner">
                            <div className="context-text">
                                <strong>Context:</strong>
                                <span>{context.title}</span>
                            </div>
                            <button onClick={() => setContext(null)} className="dismiss-button"><FiX /></button>
                        </div>
                    )}

                    {promptneed && <div className="suggested-prompts">
                        {suggestedPrompts.map(prompt => (
                            <button key={prompt} onClick={() => handleSendMessage(prompt)} className="prompt-chip">
                                {prompt}
                            </button>
                        ))}
                        <FiX className="x-mark" onClick={() => setPromptneed(false)} />
                    </div>}

                    <form className="chat-input-form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={context ? 'Ask a follow-up question...' : 'Ask EdTech AI anything...'}
                            className="chat-input"
                        />
                        <button type="submit" className="send-button" disabled={!inputValue.trim()}>
                            <FiSend />
                        </button>
                    </form>
                </div>
            </div>
            <footer className="bottom-nav">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${active === item.id ? 'active' : ''}`}
                        onClick={() => {
                            navigate('/mainpage', {
                                state: `${item.id}`
                            });
                        }}
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

