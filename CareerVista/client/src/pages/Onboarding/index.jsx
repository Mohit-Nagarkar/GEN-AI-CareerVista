import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import BasicInfo from './BasicInfo';
import AcademicInput from './AcademicInput';
import Interests from './Interests';

export default function Onboarding(){
  return (
    <div style={{maxWidth:900, margin:'40px auto'}}>
      <h2>Onboarding</h2>
      <nav>
        <Link to="basic">Basic</Link> | <Link to="academic">Academic</Link> | <Link to="interests">Interests</Link>
      </nav>
      <Routes>
        <Route path="basic" element={<BasicInfo/>} />
        <Route path="academic" element={<AcademicInput/>} />
        <Route path="interests" element={<Interests/>} />
      </Routes>
    </div>
  );
}
