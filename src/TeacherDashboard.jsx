import React from 'react';
import LessonSkeleton from './LessonSkeleton'; // We can reuse the same skeleton!

const TeacherDashboard = ({ isLoading }) => {
    // Mock data for classes
    const classes = [
        { id: 'C101', name: 'Grade 10 - Physics', students: 28 },
        { id: 'C102', name: 'Grade 12 - Advanced Calculus', students: 22 },
        { id: 'C103', name: 'Grade 9 - Chemistry', students: 31 },
    ];

    return (
        <div className="dashboard-container">
            <h2>Your Classes</h2>
            <div className="content-list">
                {isLoading ? (
                     Array.from({ length: 3 }).map((_, index) => <LessonSkeleton key={index} />)
                ) : (
                    classes.map(cls => (
                         <div key={cls.id} className="content-card list-item">
                            <div className="class-info">
                               <h3>{cls.name}</h3>
                               <p>{cls.students} Students</p>
                            </div>
                            <button className="card-button">View Class</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;