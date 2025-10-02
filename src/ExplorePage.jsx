import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import './ExplorePage.css';
import axios from 'axios';

// Rich mock data for general learning content


const ExplorePage = () => {
    const [exploreTopics,setExploreTopics] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
          const fetch_data = async () => {
            const response = await axios.get("https://edtech-ai-mc8u.onrender.com/fetchtopics");
            setExploreTopics(response.data.message);
            console.log(response.data.message);
          }
          fetch_data();
    },[])

    const handleExplore = (topicId) => {
        // This now navigates to your new dynamic page
        navigate(`/explore/${topicId}`);
    };

    return (
        <div className="explore-page">
            <div className="explore-container">
                <div className="explore-header">
                    <h1>Explore New Topics</h1>
                    <p>Expand your knowledge beyond the syllabus with these curated learning modules.</p>
                </div>

                <div className="explore-grid">
                    {exploreTopics.map(topic => (
                        <div key={topic.id} className="explore-card">
                            <div className="explore-card-content">
                                <span className="explore-card-category">{topic.category}</span>
                                <h3 className="explore-card-title">{topic.title}</h3>
                                <p className="explore-card-description">{topic.description}</p>
                            </div>
                            <button onClick={() => handleExplore(topic.id)} className="explore-card-button">
                                <span>Start Exploring</span>
                                <FiArrowRight />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
