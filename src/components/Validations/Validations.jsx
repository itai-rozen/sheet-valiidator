import React from 'react'

const Validations = ({ validations }) => {
  const renderValidations = () => {
    for (let valid in validations) {
      return <li><p>{valid}</p><p>{validations[valid]}</p></li>
    }
  }
  return <div className="validations-container">
    <ul className="validation-list">
      <li className='validation-item'><p>Field</p><p>Validation</p></li>
      {renderValidations()}
    </ul>
  </div>
}

export default Validations