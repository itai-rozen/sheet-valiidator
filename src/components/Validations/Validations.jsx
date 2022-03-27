import React from 'react'

const Validations = ({ validations }) => {

  return <div className="validations-container">
    <ul className="validation-list">
      <li className='validation-item'><p>Field</p><p>Validation</p></li>
      {Object.keys(validations).map(valid => {
        return <li key={valid}><p>{valid}</p><p>{validations[valid]}</p></li>
      })}
    </ul>
  </div>
}

export default Validations