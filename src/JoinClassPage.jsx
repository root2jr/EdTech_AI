import React, { useState, useEffect } from 'react';
import { FiSearch, FiArrowRight, FiCheck } from 'react-icons/fi';
import './JoinClassPage.css';
import axios from 'axios';

// This data now represents what a server might hold.


// This function simulates an API call.



const JoinClassPage = () => {
    const [classes, setClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requestedClasses, setRequestedClasses] = useState(new Set());
    const [userid, setUserid] = useState(localStorage.getItem("user-id"));


    const searchClassesAPI = async (query) => {
        console.log(`Searching API for query: "${query}"`);
        try {
            const response = await axios.post("http://127.0.0.1:8000/searchclass", {
                query: query
            })
            if ((response.data.message).length > 0) {
                setClasses(response.data.message);
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
        return classes

    };

    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Debounce: Wait 500ms after user stops typing before making the API call.
        const debounceTimer = setTimeout(() => {
            searchClassesAPI(searchTerm).then(data => {
                setResults(data);
                setIsLoading(false);
            });
        }, 500);

        // Cleanup: Clear the timer if the user types again before 500ms has passed.
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]); // This effect re-runs whenever 'searchTerm' changes.

    const handleJoinRequest = async (classId) => {
        setRequestedClasses(prev => new Set(prev).add(classId));
        try {
            const response = await axios.post("http://127.0.0.1:8000/joinclass", {
                user_id: userid,
                class_id: classId
            });
            console.log(response.data);
        }
        catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="join-class-page">
            <div className="join-class-container">
                <div className="join-class-header">
                    <h1>Join a New Class</h1>
                    <p>Search for available classes by name, subject, or teacher's name.</p>
                </div>

                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Start typing to find a class..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="class-list-container">
                    {isLoading && (
                        <div className="loading-indicator">
                            <div className="spinner"></div>
                            <span>Searching for classes...</span>
                        </div>
                    )}

                    {!isLoading && searchTerm && results.length > 0 && (
                        results.map(cls => (
                            <div key={cls.classId} className="class-list-item">
                                <div className="class-item-details">
                                    <h3>{cls.className}</h3>
                                    <p>{cls.subject} • Taught by {cls.teacher} • {cls.students} students</p>
                                </div>
                                <button
                                    className={`join-button ${requestedClasses.has(cls.classId) ? 'requested' : ''}`}
                                    onClick={() => handleJoinRequest(cls.classId)}
                                    disabled={requestedClasses.has(cls.classId)}
                                >
                                    {requestedClasses.has(cls.classId) ? (
                                        <><FiCheck /><span>Requested</span></>
                                    ) : (
                                        <><span>Request to Join</span><FiArrowRight /></>
                                    )}
                                </button>
                            </div>
                        ))
                    )}

                    {!isLoading && searchTerm && results.length === 0 && (
                        <div className="no-results">
                            <p>No classes found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JoinClassPage;