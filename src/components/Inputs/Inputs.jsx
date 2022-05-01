import React from 'react'
import * as XLSX from 'xlsx'
import './inputs.css'

const Inputs = ({ downloadFile, uploadFile,tableKeys,setShowModal,validateSheet, validations }) => {
  return <div className="input-container">
     <input className='file-input' type="file" onChange={uploadFile} />
      <button disabled={!tableKeys.length} onClick={() => setShowModal(true)}>add validations</button>
      <button disabled={!tableKeys.length || !Object.keys(validations).length } onClick={validateSheet}>Validate</button>
      <button onClick={() => downloadFile()}>Download</button>
  </div>
}

export default Inputs