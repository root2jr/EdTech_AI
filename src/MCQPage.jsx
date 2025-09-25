import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './MCQPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';




const MCQPage = () => {
    const [quizQuestions, setQuizQuestions] = useState([
    {
        id: 1,
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
        answer: "Mitochondrion"
    },
    {
        id: 2,
        question: "In the equation F = ma, what does 'a' stand for?",
        options: ["Area", "Acceleration", "Amplitude", "Atomic Mass"],
        answer: "Acceleration"
    },
    {
        id: 3,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        id: 4,
        question: "Who wrote the play 'Hamlet'?",
        options: ["Charles Dickens", "William Shakespeare", "George Orwell", "Jane Austen"],
        answer: "William Shakespeare"
    },
    {
        id: 5,
        question: "What is the chemical symbol for Gold?",
        options: ["Ag", "Au", "Pb", "Fe"],
        answer: "Au"
    }
]);


    useEffect(() => {
    const generate_mcqs = () => {
       const response = JSON.parse(localStorage.getItem("lesson"))
       const newobj = (response.mcqs).replace("Here are the MCQ questions for the given transcription:","");
       const obj = JSON.parse(newobj)
       setQuizQuestions(obj);
    }
    generate_mcqs();
}, [])
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleOptionSelect = (option) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIndex]: option
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmit = async () => {
        let finalScore = 0;
        quizQuestions.forEach((question, index) => {
            if (selectedAnswers[index] === question.answer) {
                finalScore++;
            }
        });
        setScore(finalScore);
        setIsSubmitted(true);
        try{
            const response = await axios.post("https://edtech-ai-mc8u.onrender.com/lessoncompleted",{
                user_id: "EDTECH-H5XRKR",
                lesson_id: "EDTECH-H53VVF",
                quiz_marks: finalScore
            })
            console.log(response.data);
        }
        catch(error){
            console.error("Error:",error);
        }

    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setScore(0);
    }

    if (isSubmitted) {
        return (
            <div className="mcq-page results-page">
                <div className="mcq-card results-card">
                    <h1 className="results-title">Quiz Completed!</h1>
                    <p className="results-score">You scored {score} out of {quizQuestions.length}</p>
                    <div className="results-summary">
                        {quizQuestions.map((q, index) => (
                            <div key={q.id} className="summary-item">
                                {selectedAnswers[index] === q.answer ?
                                    <FiCheckCircle className="summary-icon correct" /> :
                                    <FiXCircle className="summary-icon incorrect" />}
                                <p>Q{index + 1}: {q.question}</p>
                            </div>
                        ))}
                    </div>
                    <button className="mcq-nav-button" onClick={() => { navigate("/mainpage") }}>Return to Home Page</button>
                </div>
            </div>
        );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

    return (
        <div className="mcq-page">
            <div className="mcq-card">
                <div className="mcq-progress-bar">
                    <div
                        className="mcq-progress-fill"
                        style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                </div>

                <div className="mcq-header">
                    <h2 className="mcq-question-number">Question {currentQuestionIndex + 1}<span>/{quizQuestions.length}</span></h2>
                    <p className="mcq-question-text">{currentQuestion.question}</p>
                </div>

                <div className="mcq-options-grid">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`mcq-option-button ${selectedAnswers[currentQuestionIndex] === option ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mcq-footer">
                    {isLastQuestion ? (
                        <button
                            className="mcq-nav-button"
                            onClick={handleSubmit}
                            disabled={!selectedAnswers[currentQuestionIndex]}
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            className="mcq-nav-button"
                            onClick={handleNext}
                            disabled={!selectedAnswers[currentQuestionIndex]}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MCQPage;