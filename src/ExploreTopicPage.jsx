import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import './ExploreTopicPage.css';
import axios from 'axios';

const allTopicsData = {
    'gen01': {
        title: 'The History of Space Exploration',
        category: 'Science & Tech',
        content: `The human desire to reach for the stars is as old as civilization itself. This journey transformed from myth to reality in the 20th century, marking one of humanity's greatest scientific achievements.\n\nThe Space Race between the United States and the Soviet Union during the Cold War was the primary catalyst. It began with the Soviet launch of Sputnik 1, the first artificial satellite, in 1957. This event spurred the creation of NASA and led to a series of historic firsts:\n\n* **First Human in Space:** Yuri Gagarin (1961)\n* **First Moon Landing:** Apollo 11 (1969)\n\nThe post-Apollo era saw the development of reusable spacecraft like the Space Shuttle, the construction of the International Space Station (ISS), and the launch of incredible robotic explorers. Probes like Voyager, and telescopes like Hubble and the James Webb Space Telescope, have fundamentally changed our understanding of the cosmos. Today, a new era of commercial spaceflight, led by companies like SpaceX and Blue Origin, promises to make space more accessible than ever before.`
    },

};

// Mock data for related topics section
const relatedTopics = [
    { id: 'gen02', title: 'Introduction to Stoicism', category: 'Philosophy' },
    { id: 'gen05', title: 'The Renaissance Art Movement', category: 'Art & History' },
];

const ExploreTopicPage = () => {
    const { topicId } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const [allTopicsData, setAllTopicData] = useState();

    const [topic, setTopic] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (allTopicsData) {
            const data = allTopicsData[topicId];
            if (data) {
                setTopic(data);
            }
        }
    }, [allTopicsData])


    useEffect(() => {
        setIsLoading(true);
        const fetch_topic_data = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/fetchtopicdetails")
                setAllTopicData(response.data.message);
                console.log(response.data.message);
                setIsLoading(false);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fetch_topic_data();
    }, [topicId]);

    if (isLoading) {
        return <div className="loading-container">Loading Topic...</div>;
    }

    if (!topic) {
        return <div className="loading-container">Topic not found.</div>;
    }

    return (
        <div className="explore-topic-page">
            <div className="explore-topic-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                    <span>Back to Explore</span>
                </button>

                {/* --- Topic Header --- */}
                <div className="topic-header-card">
                    <span className="topic-header-category">{topic.category}</span>
                    <h1>{topic.title}</h1>
                </div>

                {/* --- Topic Content --- */}
                <div className="topic-content-card">
                    {topic.content.split('\n').map((paragraph, index) => {
                        if (paragraph.startsWith('* ')) {
                            return <ul key={index}><li>{paragraph.substring(2)}</li></ul>;
                        }
                        return <p key={index}>{paragraph}</p>;
                    })}
                </div>

                {/* --- Related Topics Section --- */}
                <div className="related-topics-section">
                    <h2>Continue Exploring</h2>
                    <div className="related-topics-grid">
                        {relatedTopics.map(item => (
                            <div key={item.id} className="related-topic-card" onClick={() => navigate(`/explore/${item.id}`)}>
                                <div>
                                    <span className="related-topic-category">{item.category}</span>
                                    <h3>{item.title}</h3>
                                </div>
                                <FiArrowRight className="related-topic-arrow" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreTopicPage;
