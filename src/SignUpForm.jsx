import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [school, setSchool] = useState('');
    const [student, setStudent] = useState('');
    const [role, setRole] = useState('Student');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        const date = new Date(); // example date

        const formatted = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        try {
            const response = await axios.post("https://edtech-ai-mc8u.onrender.com/sign-in", {
                username: username,
                email: email,
                password: password,
                schoolid: school,
                studentid: student,
                role: role,
                joined: formatted
            });
            console.log(response.data);
            if (response.data.message == "User Registered Sucessfully") {
                alert("User Registered Successfully. You may now login with the credentials.")
                navigate("/");
            } else {
                alert(response.data.message);
            }
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
                <label htmlFor="signup-username">Email</label>
                <input
                    id="signup-username"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <label htmlFor="confirm-password">School Id</label>
                <input
                    id="school-id"
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="confirm-password">{role} ID</label>
                <input
                    id="student-id"
                    type="text"
                    value={student}
                    onChange={(e) => setStudent(e.target.value)}
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