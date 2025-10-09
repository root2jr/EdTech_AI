import React from 'react';
import './ExploreCardSkeleton.css';

const ExploreCardSkeleton = () => {
    // Render 6 skeleton cards for the loading state
    return (
        <div className="skeleton-grid">
            {[...Array(6)].map((_, index) => (
                <div className="skeleton-card" key={index}>
                    <div className="skeleton-category skeleton-shimmer"></div>
                    <div className="skeleton-title skeleton-shimmer"></div>
                    <div className="skeleton-description skeleton-shimmer"></div>
                    <div className="skeleton-button skeleton-shimmer"></div>
                </div>
            ))}
        </div>
    );
};

export default ExploreCardSkeleton;
