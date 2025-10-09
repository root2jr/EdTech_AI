import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown, FiMail, FiPhone, FiHelpCircle } from 'react-icons/fi';
import './HelpAndSupportPage.css';

// --- FAQ Content ---
const faqData = [
    {
        question: 'How do I change my password?',
        answer: 'You can change your password by navigating to the "Profile" page, selecting the "Security & Password" option, and following the on-screen instructions. You will need to enter your current password to set a new one.'
    },
    {
        question: 'How do I join a new class?',
        answer: 'As a student, you can join a new class by navigating to your dashboard and clicking the floating "Join Class" button. You will need the unique Class ID provided by your teacher.'
    },
    {
        question: 'Where can I see my analytics and progress?',
        answer: 'Your personal performance analytics, including scores, progress, and completed lessons, are available on the "Analytics" tab in the bottom navigation bar.'
    },
    {
        question: 'How does the AI Doubt Solver work?',
        answer: 'The AI Doubt Solver, accessible via the "AI" tab, is a powerful tool to help you with your studies. When you are on a lesson page, you can click the "Ask AI" button to open the chat with the context of that lesson, allowing you to ask specific questions about the topic.'
    }
];

// --- Accordion Item Component ---
const AccordionItem = ({ faq, isOpen, onClick }) => (
    <div className="faq-item">
        <button className="faq-question" onClick={onClick}>
            <span>{faq.question}</span>
            <FiChevronDown className={`faq-chevron ${isOpen ? 'open' : ''}`} />
        </button>
        <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
            <p>{faq.answer}</p>
        </div>
    </div>
);


const HelpAndSupportPage = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    const handleAccordionClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="help-support-page">
            <div className="help-support-container">
                <button className="back-button-help" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                    <span>Back to Profile</span>
                </button>

                <div className="help-support-header">
                    <FiHelpCircle className="header-icon" />
                    <h1>Help & Support</h1>
                    <p>Find answers to common questions or get in touch with our team.</p>
                </div>

                {/* --- FAQ Section --- */}
                <div className="help-card">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        {faqData.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                faq={faq}
                                isOpen={openIndex === index}
                                onClick={() => handleAccordionClick(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* --- Contact Us Section --- */}
                <div className="help-card">
                    <h2>Contact Us</h2>
                    <p className="contact-intro">If you can't find the answer you're looking for, please feel free to reach out to us directly.</p>
                    <div className="contact-methods">
                        <div className="contact-item">
                            <FiMail />
                            <div className="contact-details">
                                <strong>Email Support</strong>
                                <a href="mailto:edtechx.ai@gmail.com">edtechx.ai@gmail.com</a>
                            </div>
                        </div>
                        <div className="contact-item">
                            <FiPhone />
                            <div className="contact-details">
                                <strong>Phone Support</strong>
                                <span>+91 44 1234 5678 (Mon-Fri, 9am-6pm IST)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpAndSupportPage;
