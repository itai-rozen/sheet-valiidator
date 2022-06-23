import React from 'react'
import * as XLSX from 'xlsx'
import './inputs.css'

const Inputs = ({ 
                  downloadFile,
                  problems, 
                  uploadFile,
                  tableKeys,
                  setShowModal,
                  validData,
                  validateSheet, 
                  validations }) => {
  return <div className="input-container">
     <input className='file-input' type="file" onChange={uploadFile} />
      {/* <button disabled={!tableKeys.length || !Object.keys(validations).length } onClick={validateSheet}>בדוק</button> */}
      <button disabled={!tableKeys.length} onClick={() => setShowModal(true)}>מפה את הקובץ</button>
      <button disabled={!validData.length} onClick={() => console.log('valid data: ',validData)}>טען שורות תקינות</button>
      <button disabled={!validData.length} onClick={() => downloadFile(validData, 'invites_valids')}>הורד שורות תקינות</button>
  </div>
}

export default Inputs