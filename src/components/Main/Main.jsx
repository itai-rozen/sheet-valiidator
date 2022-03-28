import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import Modal from '../Modal/Modal'
import Problems from '../Problems/Problems'
import Validations from '../Validations/Validations'

import './main.css'

const Main = () => {
  const [sheetData, setSheetData] = useState([])
  const [validations, setValidations] = useState({})
  const [tableKeys, setTableKeys] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [problems, setProblems] = useState([])

  const uploadFile = e => {
    const file = e.target.files[0]
    console.log(file)

    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)

    fileReader.onload = e => {
      const bufferArray = e.target.result
      const workBook = XLSX.read(bufferArray, { type: "buffer" })
      console.log('work book: ', workBook)
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]
      getTableKeys(workSheet)
      const sheetData = XLSX.utils.sheet_to_json(workSheet)
      setSheetData(sheetData)
    }
  }

  const getTableKeys = ws => {
    const rangeCells = XLSX.utils.decode_range(ws['!ref'])
    const headerRow = rangeCells.s.r
    const startingCol = rangeCells.s.c
    const endingCol = rangeCells.e.c
    const headers = []
    for (let i = startingCol; i <= endingCol; i++) {
      let cell = ws[XLSX.utils.encode_cell({ c: i, r: headerRow })]
      if (cell && cell.t) headers.push(XLSX.utils.format_cell(cell))
    }
    setTableKeys(headers)
  }

  const validateSheet = () => {
    setProblems([])
    sheetData.forEach((row,i) => {
      console.log(row)
      validateRow(row,i)
    })
  }

  const validateRow = (rowObj,index) => {
    for (const value in validations) {
      // console.log('validations: ', validations)
      // console.log('value: ', value)
      // console.log('validations[value]: ', validations[value])
      // console.log('row[value] :',rowObj[value])
      const currValidation = validations[value]
      const currValue = rowObj[value]
      let validationFunc
      switch(currValidation){
        case 'email':
          validationFunc = validateEmail;
          break;
        case 'phone':
          validationFunc = validatePhone;
          break;
        case 'empty cells':
          validationFunc = validateFullCells;
          break;
        case 'duplicate':
          validationFunc = validateDuplicateCells;
          break;
        default:
          validationFunc = console.log
          break;
      }
      if (!validationFunc(currValue + '',index,value)) setProblems(prevArr => [...prevArr, {rowNum: rowObj.__rowNum__ , problem:currValidation, value:currValue}])
    }
  
}

const validateEmail = (str,_,_2) => str.match(/^\S+@\S+\.\S+$/)

const validatePhone = (str,_,_2) => {
  const cleanStr = cleanString(str)
  return cleanStr.match(/^05[0-9]{8}$|^5[0-9]{8}$/)
} 

const validateFullCells = (str,_,_2) => str.trim() !== 'undefined'

const validateDuplicateCells = (str,i,col) => !sheetData.find((row,index) => (row[col] === str && i !== index))

const cleanString = str =>  str.replace(/^972|[+().]/g, '')
  
useEffect(() => {
  console.log(cleanString('97266.21.56'))
}, [])

return <div className="main-container">
  <h1>Sheet evaluator</h1>
  <div className="input-container">
    <input type="file" onChange={uploadFile} />
    <button disabled={!tableKeys.length} onClick={() => setShowModal(true)}>add validations</button>
    <button disabled={!tableKeys.length} onClick={validateSheet}>Validate</button>
  </div>

  <Validations  validations={validations} />


  <Problems problems={problems} />
  {showModal && <Modal
    setShowModal={setShowModal}
    validations={validations}
    setValidations={setValidations}
    tableKeys={tableKeys}
  />}
</div>
}

export default Main
