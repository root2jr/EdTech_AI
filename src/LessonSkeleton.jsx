import React from 'react';

const LessonSkeleton = () => {
    return (
        <div className="content-card skeleton-card">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-button"></div>
        </div>
    );
};

export default LessonSkeleton;