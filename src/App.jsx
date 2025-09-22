import { useState } from 'react'
import './App.css'
import AuthPage from './AuthPage'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from './MainPage'
import AIChatPage from './AIChatPage'
import AnalyticsPage from './AnalyticsPage'
import LessonPage from './LessonPage'
import MCQPage from './MCQPage'
import ManageClassPage from './ManageClassPage'
import CreateLessonPage from './CreateLessonPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign-in" element={<SignUpForm />} />
        <Route path='/mainpage' element={<MainPage />} />
        <Route path='/analytics' element={<AnalyticsPage />} />
        <Route path="/lesson" element={<LessonPage />} />
        <Route path="/ai" element={<AIChatPage />} />
        <Route path="/mcq" element={<MCQPage />} />
        <Route path="/manageclass" element={<ManageClassPage />} />
        <Route path="/createlesson" element={<CreateLessonPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
