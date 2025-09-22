import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [school, setSchool] = useState('');
    const [role, setRole] = useState('Student');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        try {
            const response = await axios.post("http://127.0.0.1:8000/sign-in", {
                username: username,
                password: password,
                role: role, 
                school: school

            });
            if(response.data.message == "User Registered Sucessfully"){
                navigate("/mainpage")
            }
            console.log(response.data);
        }
        catch (error) {
            console.error("Error:", error);
        }

    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label htmlFor="signup-username">Username</label>
                <input
                    id="signup-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="confirm-password">School Name</label>
                <input
                    id="confirm-password"
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                </select>
            </div>
            <button type="submit" className="submit-btn">Sign Up</button>
        </form>
    );
};

export default SignUpForm;