import React, { useState, useEffect } from 'react'
import Validations from '../Validations/Validations'
import './modal.css'

const Modal = ({ setShowModal, validations, setValidations,tableKeys, validateSheet }) => {
  const [validation, setValidation] = useState('')
  const [field, setField] = useState('')

  const addValidation = () => {
    if (validations[field] !== validation) setValidations( {...validations, [field] : validation})
    setValidation('')
    setField('')
  }


  return <div className="add-validation modal-container close">
    <div className="modal">
      <button className='close-btn' onClick={() => setShowModal(false)}>X</button>
    <h2>מפה את הקובץ</h2>
      <div className="field-input">
      <button disabled={!validation || !field} onClick={addValidation}>הוסף</button>

      <select name="validations" value={validation} id="validations" onChange={e => setValidation(e.target.value)}>
          <option   disabled value="" >בחר בדיקה לביצוע</option>
          <option value="email">email</option>
          <option value="טלפון">טלפון</option>
          <option value="תאים ריקים">תאים ריקים</option>
          <option value="כפילויות">כפילויות</option>
        </select>
        <select value={field} className="table-keys-select" id="valids" onChange={e => setField(e.target.value)}>
          <option disabled  value="">בחר עמודה</option>
          {
            tableKeys.filter(key => key !== 'rowNum').map((tableKey,i) => {
              return <option key={tableKey+i} value={tableKey}>{tableKey}</option>
            })
          }
        </select>

      </div>
        <Validations validations={validations} />
    <button disabled={!tableKeys.length || !Object.keys(validations).length } onClick={validateSheet}>בדוק</button>
    </div>
  </div>
}

export default Modal