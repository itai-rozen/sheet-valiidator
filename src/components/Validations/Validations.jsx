import React from 'react'
import './validations.css'

const Validations = ({ validations }) => {
  console.log('validations: ',validations)
  return <div className="validations-modal-container">
    <ul className="validation-list">
      <li className='validation-headers item'><p>Field</p><p>Validation</p></li>
      {Object.keys(validations).map(valid => {
        return <li className='validation-item item' key={valid+validations[valid]}><p>{valid}</p><p>{validations[valid]}</p></li>
      })}
    </ul>
  </div>
}

export default Validations