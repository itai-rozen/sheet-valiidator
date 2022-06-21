import React from 'react'
import './validations.css'

const Validations = ({ validations }) => {
  return <div className="validations-modal-container">
    <ul className="validation-list">
      <li className='validation-headers item'><p>בדיקה</p><p>עמודה</p></li>
      {Object.keys(validations).map(valid => {
        return <li className='validation-item item' key={valid+validations[valid]}><p>{validations[valid]}</p><p>{valid}</p></li>
      })}
    </ul>
  </div>
}

export default Validations