import React from 'react'
import './inputs.css'

const Inputs = ({ uploadFile,tableKeys,setShowModal,validateSheet }) => {
  return <div className="input-container">
     <input className='file-input' type="file" onChange={uploadFile} />
      <button disabled={!tableKeys.length} onClick={() => setShowModal(true)}>add validations</button>
      <button disabled={!tableKeys.length} onClick={validateSheet}>Validate</button>
  </div>
}

export default Inputs