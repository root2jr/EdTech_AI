import React from 'react';
import './DynamicThumbnail.css';

// A predefined, classy color palette.
const COLOR_PALETTE = [
    '#5D6D7E', '#85929E', '#AAB7B8', '#AEB6BF',
    '#ABB2B9', '#808B96', '#707B7C', '#566573'
];

// Simple hashing function to turn a string into a consistent number.
const generateHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const DynamicThumbnail = ({ text, seed }) => {
    // Use the hash of the 'seed' string to pick a consistent color from our palette.
    // All "Science" classes will now have the same color, for example.
    const colorIndex = generateHash(seed) % COLOR_PALETTE.length;
    const backgroundColor = COLOR_PALETTE[colorIndex];

    return (
        <div 
            className="dynamic-thumbnail-container"
            style={{ backgroundColor: backgroundColor }}
        >
            <span className="dynamic-thumbnail-text">{text}</span>
        </div>
    );
};

export default DynamicThumbnail;