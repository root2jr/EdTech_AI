import React, { useEffect, useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const navigate = useNavigate();

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if(jwt){
            navigate("/mainpage");
        }
    },[])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.post("https://edtech-ai-mc8u.onrender.com/login",{
                email: username,
                password: password,
                role: role
            });
            console.log(response.data);
            alert(response.data.message);
            if(response.data.message == "Login Successful"){
                localStorage.setItem("role",role);
                localStorage.setItem("user-id",response.data.user_id)
                localStorage.setItem("jwt",response.data.jwt);
                navigate("/mainpage")
            }
        }
        catch(error){
            console.error("Error:",e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label htmlFor="login-username">Email</label>
                <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            <button type="submit" className="submit-btn">Login</button>
        </form>
    );
};

export default LoginForm;