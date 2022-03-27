import React, {useState, useEffect} from 'react'
import './problems.css'

const Problems = ({ problems }) => {

  return   <div className="problems-container">
  <h2>Problems in table</h2>
  <ul className="problem-headers">
    <li className="problem-header">Row number</li>
    <li className="problem-header">Problem</li>
  </ul>
  <ul className="problem-list">
  {problems.map((problem,i) => {
    return  <li key={i} className="problem-item">
    <div className="problem-container">
      <p className="row-number">{problem.rowNum+1}</p>
      <p className="row-problem">{problem.problem}</p>
    </div>
  </li>
  })}
  </ul>
</div>
}

export default Problems