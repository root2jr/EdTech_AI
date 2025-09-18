import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="auth-container">
            <div className="form-wrapper">
                <div className="form-header">
                    <h1>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
                    <p>{isLogin ? 'Please login to continue.' : 'Join our community of learners and educators.'}</p>
                </div>

                {isLogin ? <LoginForm /> : <SignUpForm />}

                <div className="toggle-form">
                    {isLogin ? (
                        <p>
                            Don't have an account?{' '}
                            <span onClick={toggleForm}>Sign Up</span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <span onClick={toggleForm}>Login</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;