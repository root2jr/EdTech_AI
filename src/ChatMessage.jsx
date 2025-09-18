import React from 'react';

const ChatMessage = ({ message }) => {
    const { sender, parts } = message;

    return (
        <div className={`message-wrapper ${sender === 'user' ? 'sender-user' : 'sender-ai'}`}>
            <div className="message-content">
                {parts.map((part, index) => {
                    if (part.type === 'text') {
                        return (
                            <div key={index} className="message-bubble">
                                {part.content}
                            </div>
                        );
                    }
                    if (part.type === 'code') {
                        return (
                            <div key={index} className="message-bubble code-bubble">
                                <div className="code-header">{part.language}</div>
                                <pre><code>{part.content}</code></pre>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default ChatMessage;