import React from 'react'
import Ongoing from './ongoing.jsx';
import Completed from './completed.jsx';
import Add from './add.jsx';
import Answer from './Answer.jsx';
import Question from './Question.jsx';
import "./Feedback.css";
import { Routes, Route } from 'react-router-dom';

const Feedback = () => {
  return (
    <div className='Feedback'>
      <Routes>
        <Route path="/" element={<Ongoing />} />
        <Route path="*" element={<Ongoing />} /> 
        <Route path="/ongoing" element={<Ongoing />} /> 
        <Route path="/completed" element={<Completed />} />
        <Route path="/add" element={<Add />} />
        <Route path="/question" element={<Question />} />
        <Route path="/answer" element={<Answer />} />

        <Route path="/add/:feedbackID" element={<Add />} />
      </Routes>
    </div>
  )
}

export default Feedback
