import React from 'react'
import * as XLSX from 'xlsx'
import './inputs.css'

const Inputs = ({ downloadFile,problems, uploadFile,tableKeys,setShowModal,validateSheet, validations }) => {
  return <div className="input-container">
     <input className='file-input' type="file" onChange={uploadFile} />
      <button disabled={!tableKeys.length || !Object.keys(validations).length } onClick={validateSheet}>בדוק</button>
      <button disabled={!tableKeys.length} onClick={() => setShowModal(true)}>מפה את הקובץ</button>
      <button disabled={(!tableKeys.length || problems.length > 0) || !validations.length}>טען שורות תקינות</button>
      {/* <button onClick={() => downloadFile()}>Download</button> */}
  </div>
}

export default Inputs