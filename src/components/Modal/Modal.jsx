import React, { useState, useEffect } from 'react'
import './modal.css'

const Modal = ({ setShowModal, validations, setValidations,tableKeys }) => {
  const [validation, setValidation] = useState('')
  const [field, setField] = useState('')

  const addValidation = () => {
    setValidations({...validations, [field] : validation})
  }


  useEffect(() => {
    console.log(validations)
  },[validations])
  return <div className="add-validation modal-container close">
    <div className="modal">
      <button onClick={() => setShowModal(false)}>X</button>
      <div className="field-input">

        <select defaultValue={'Choose field'} className="table-keys-select" id="valids" onChange={e => setField(e.target.value)}>
          <option disabled  value="Choose field">Choose field</option>
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
          <option value="full">no empty cells</option>
          <option value="duplicate">duplicate</option>
        </select>
        <button onClick={addValidation}>add</button>

      </div>
    </div>
  </div>
}

export default Modal