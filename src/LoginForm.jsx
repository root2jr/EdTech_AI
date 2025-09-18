import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.post("http://127.0.0.1:8000/login",{
                username: username,
                password: password
            });
            console.log(response.data);
            if(response.data.message == "Login Successful"){
                navigate("/mainpage")
            }
        }
        catch(error){
            console.error("Error:",e);
        }
        console.log('Logging in with:', { username, password });
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label htmlFor="login-username">Username</label>
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
            <button type="submit" className="submit-btn">Login</button>
        </form>
    );
};

export default LoginForm;