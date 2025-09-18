import React from 'react';

const TypingIndicator = () => {
    return (
        <div className="message-wrapper sender-ai">
             <div className="message-content">
                <div className="message-bubble typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;