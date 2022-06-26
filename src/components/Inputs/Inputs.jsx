import React from 'react'

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
    <input className='file-input' type="file" onChange={uploadFile} />
    {/* <button disabled={!tableKeys.length || !Object.keys(validations).length } onClick={validateSheet}>בדוק</button> */}
    {/* <button disabled={!tableKeys.length} onClick={() => setShowModal(true)}>מפה את הקובץ</button> */}
    <button disabled={!validData.length || !sqlHeaders.target_name} onClick={uploadToServer}>טען שורות תקינות</button>
    <button disabled={!validData.length} onClick={() => downloadFile(validData, 'invites_valids')}>הורד שורות תקינות</button>
  </div>
}

export default Inputs