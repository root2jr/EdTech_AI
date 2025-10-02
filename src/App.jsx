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
import JoinClassPage from './JoinClassPage'
import CreateClassPage from './CreateClassPage'
import ClassDetailsPage from './ClassDetailsPage'
import TeacherAnalyticsPage from './TeacherAnalyticsPage'
import ExplorePage from './ExplorePage'
import ExploreTopicPage from './ExploreTopicPage'

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
        <Route path="/add" element={<JoinClassPage />} />
        <Route path="/createclass" element={<CreateClassPage />} />
        <Route path="/class/:classId" element={<ClassDetailsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/:topicId" element={<ExploreTopicPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
