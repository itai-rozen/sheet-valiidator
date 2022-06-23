import React, { useState,useRef, useEffect } from 'react'
import './problems.css'

const Problems = ({ downloadFile, problems, setShowProblems, sheetData, setProblems, setSheetData, validateSheet }) => {
  const [rowNumFix, setRowNumFix] = useState(-1)
  const [valueToFix,setValueToFix] = useState('')

  const deleteRow = rowNumber => {
    setSheetData(sheetData.filter(row => row.__rowNum__ !== rowNumber - 1))
    setProblems(problems.filter(row => row.rowNum !== rowNumber))
  }
  const downloadProblems = () => {
    const problemRowNums = problems.map(problem => problem.rowNum)
    const problemItems =  sheetData.filter(item => (problemRowNums.includes(item.__rowNum__+1)))
    downloadFile(problemItems,'invites_problems')
  }
  const editRow = problemObj => {
    setRowNumFix(problemObj.rowNum)
    setValueToFix(problemObj.value)
  }

  const saveChanges = (problemField) => {
    console.log('problem field: ',problemField)
    setProblems(problems.map(problem => {
      if (problem.rowNum === rowNumFix) problem.value = valueToFix
      return problem
    }))
    setSheetData(sheetData.map(dataItem => {
      console.log('data field: ',dataItem[problemField])
      if (dataItem.__rowNum__ === rowNumFix - 1) dataItem[problemField] = valueToFix
      return dataItem
    }))
    setRowNumFix(-1)
    setValueToFix('')
    validateSheet()
  }
  const discardChanges = () => setRowNumFix(-1)

  useEffect(() => {
     (!problems.length) && setShowProblems(false)
  },[rowNumFix])
  return <div className="modal-container">
    <div className="problems-container modal">
      <button className="close-btn" onClick={() => setShowProblems(false)}>X</button>
      <h2>שורות שגויות</h2>
      <div className="list-container">

        <ul className="problem-headers">
          <li className="problem-header">מס' שורה</li>
          <li className="problem-header">סוג שגיאה</li>
          <li className="problem-header grow">ערך</li>
          <li></li>
          <li></li>
        </ul>
        <ul className="problem-list">
          {problems.map((problem, i) => {
            return <li key={i} className="problem-item">
              <div className="problem-container">
                <p className="row-number">{problem.rowNum}</p>
                <p className="row-problem">{problem.problem}</p>

                <p className="row-problem grow">
                  {
                    (problem.rowNum === rowNumFix) ? <input  defaultValue={valueToFix} onChange={e => setValueToFix(e.target.value)} /> : <>{problem.value || <i><strong>(ריק)</strong></i>}</>
                  }
                </p>
                {(problem.rowNum === rowNumFix) ? <>
                    <p className="change-row no-under" onClick={() => saveChanges(problem.field)}>✔️</p>
                    <p className="change-row no-under" onClick={discardChanges}>❌</p>
                </>
                  : <>
                    <p className='change-row' onClick={() => editRow(problem)}>תקן</p>
                    <p className='change-row' onClick={() => deleteRow(problem.rowNum)}>מחק</p>
                  </>
                }
              </div>
            </li>
          })}
        </ul>
      </div>
        <button disabled={!problems.length} onClick={downloadProblems}>Excel הורד שורות שגויות בקובץ </button>
    </div>
  </div>

}

export default Problems


