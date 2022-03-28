import React, { useState, useEffect } from 'react'
import Validations from '../Validations/Validations'
import './modal.css'

const Modal = ({ setShowModal, validations, setValidations,tableKeys }) => {
  const [validation, setValidation] = useState('')
  const [field, setField] = useState('')

  const addValidation = () => {
    if (validations[field] !== validation) setValidations( {...validations, [field] : validation})
  }


  useEffect(() => {
    console.log(validations)
  },[validations])
  return <div className="add-validation modal-container close">
    <div className="modal">
      <button onClick={() => setShowModal(false)}>X</button>
      <div className="field-input">

        <select defaultValue={'Choose column'} className="table-keys-select" id="valids" onChange={e => setField(e.target.value)}>
          <option disabled  value="Choose column">Choose column</option>
          {
            tableKeys.map(tableKey => {
              return <option key={tableKey} value={tableKey}>{tableKey}</option>
            })
          }
        </select>
        <select name="validations" defaultValue={'Choose validation'} id="validations" onChange={e => setValidation(e.target.value)}>
          <option  disabled >Choose validation</option>
          <option value="email">email</option>
          <option value="phone">phone</option>
          <option value="empty cells">no empty cells</option>
          <option value="duplicates">duplicates</option>
        </select>
        <button onClick={addValidation}>add</button>
        <Validations validations={validations} />
      </div>
    </div>
  </div>
}

export default Modal