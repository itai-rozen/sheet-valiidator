import React from 'react'
import { FaUpload } from 'react-icons/fa'
import './inputs.css'

const Inputs = ({
  downloadFile,
  // problems,
  uploadFile,
  // tableKeys,
  // setShowModal,
  sqlHeaders,
  uploadToServer,
  validData,
  // validateSheet,
  // validations 
}) => {


  return <div className="input-container">
    <label htmlFor="file">
    <div className="button-like">
    <FaUpload />
    <p>
     העלה קובץ רשימת אורחים
    </p>
    </div>
    
    <input className='file-input' id="file" type="file" onChange={uploadFile} />
    </label>
    {/* <button disabled={!tableKeys.length || !Object.keys(validations).length } onClick={validateSheet}>בדוק</button> */}
    {/* <button disabled={!tableKeys.length} onClick={() => setShowModal(true)}>מפה את הקובץ</button> */}
    <button className='upload-btn' disabled={!validData.length || !sqlHeaders.target_name} onClick={uploadToServer}>טען שורות תקינות</button>
    <button disabled={!validData.length} onClick={() => downloadFile(validData, 'invites_valids')}>הורד שורות תקינות</button>
  </div>
}

export default Inputs