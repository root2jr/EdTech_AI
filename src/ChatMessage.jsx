import React from 'react';
import { FiUser, FiCpu } from 'react-icons/fi';

// A utility function to parse simple markdown-like syntax
const formatAIResponse = (content) => {
    // Split by newlines to process line by line
    const lines = content.split('\n');
    const elements = [];
    let listType = null; // can be 'ul' or 'ol'
    let listItems = [];

    const flushList = () => {
        if (listItems.length > 0) {
            if (listType === 'ul') {
                elements.push(<ul key={`list-${elements.length}`}>{listItems}</ul>);
            } else if (listType === 'ol') {
                elements.push(<ol key={`list-${elements.length}`}>{listItems}</ol>);
            }
            listItems = [];
            listType = null;
        }
    };

    lines.forEach((line, index) => {
        // Handle unordered lists
        if (line.startsWith('* ') || line.startsWith('- ')) {
            if (listType !== 'ul') flushList();
            listType = 'ul';
            listItems.push(<li key={index}>{line.substring(2)}</li>);
            return;
        }
        
        // Handle ordered lists
        if (line.match(/^\d+\.\s/)) {
            if (listType !== 'ol') flushList();
            listType = 'ol';
            listItems.push(<li key={index}>{line.substring(line.indexOf(' ') + 1)}</li>);
            return;
        }

        // If we encounter a non-list line, flush any existing list
        flushList();

        // Handle bold and italics with a simple regex replace
        let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');

        elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />);
    });

    flushList(); // Flush any remaining list at the end
    return elements;
};

const ChatMessage = ({ message }) => {
    const { sender, parts } = message;

    return (
        <div className={`message-wrapper ${sender === 'user' ? 'sender-user' : 'sender-ai'}`}>
            <div className="message-avatar">
                {sender === 'user' ? <FiUser /> : <FiCpu />}
            </div>
            <div className="message-content-container">
                {parts.map((part, index) => {
                    if (part.type === 'text') {
                        return (
                            <div key={index} className="message-bubble">
                                {sender === 'ai' ? formatAIResponse(part.content) : part.content}
                            </div>
                        );
                    }
                    // Your existing code block logic can remain here
                    return null;
                })}
            </div>
        </div>
    );
};

export default ChatMessage;
