import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import Inputs from '../Inputs/Inputs'
import Loader from '../Loader/Loader'
import Modal from '../Modal/Modal'
import Problems from '../Problems/Problems'
import Validations from '../Validations/Validations'

import './main.css'

const Main = () => {
  const [sheetData, setSheetData] = useState([])
  const [validations, setValidations] = useState({})
  const [tableKeys, setTableKeys] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showProblemsStr, setShowProblemsStr] = useState(false)
  const [showProblems, setShowProblems] = useState(false)
  const [problems, setProblems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const PATH = process.env.NODE_ENV === 'development' ?
    'http://localhost:9000/.netlify/functions/index' :
    'https://sheet-server.netlify.app/.netlify/functions/index'
  const uploadFile = e => {
    setIsLoading(true)
    const file = e.target.files[0]

    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)

    fileReader.onload = e => {
      const bufferArray = e.target.result
      const workBook = XLSX.read(bufferArray, { type: "buffer" })
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]
      getTableKeys(workSheet)
      const data = XLSX.utils.sheet_to_json(workSheet)
      // console.log('sheet data: ',data)
      setSheetData(data)
      // addRowsToTable(data)

      // TODO save to localStorage every 10 mins
    }
    setIsLoading(false)
  }

  const addRowsToTable = async rows => {
    for (const row of rows) {
      try {
        await addRowToSql(row)
      } catch (err) {
        console.log(err)
      }
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
    headers.unshift('rowNum')
    setTableKeys(headers)
    // createSqlTable(headers)
  }

  const validateSheet = () => {
    setProblems([])
    sheetData.forEach((row, i) => {
      validateRow(row, i)
    })
    setShowModal(false)
    setShowProblemsStr(true)
  }

  const validateRow = (rowObj, index) => {
    console.log('validations: ', validations)
    console.log('row: ', rowObj)
    for (const value in validations) {
      const currValidation = validations[value]
      const currValue = rowObj[value]
      let validationFunc
      switch (currValidation) {
        case 'email':
          validationFunc = validateEmail;
          break;
        case 'טלפון':
          validationFunc = validatePhone;
          break;
        case 'תאים ריקים':
          validationFunc = validateFullCells;
          break;
        case 'כפילויות':
          validationFunc = validateDuplicateCells;
          break;
        default:
          validationFunc = console.log
          break;
      }
      if (!validationFunc(currValue + '', index, value)) {
        const problemObj = { rowNum: rowObj.__rowNum__ + 1, problem: currValidation, value: currValue, field: value }
        console.log('problem object: ', problemObj)
        setProblems(prevArr => [...prevArr, problemObj])
      }
    }

  }

  const validateEmail = (str, _, _2) => str.match(/^\S+@\S+\.\S+$/)

  const validatePhone = (str, _, _2) => {
    const cleanStr = cleanString(str)
    return cleanStr.match(/^05[0-9]{8}$|^5[0-9]{8}$/)
  }

  const validateFullCells = (str, _, _2) => str.trim() !== 'undefined'

  const validateDuplicateCells = (str, i, col) => !sheetData.find((row, index) => (row[col] === str && i !== index))

  const cleanString = str => str.replace(/^972|[+().]/g, '')

  const addRowToSql = async (rowObj, endpoint = '') => {
    if (!endpoint) rowObj.rowNum = rowObj.__rowNum__ + 1
    await fetch(`${PATH}/${endpoint}`, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rowObj)
    });
  }

  const createSqlTable = async tableHeaders => {
    try {
      await fetch(`${PATH}/create-table`, {
        method: 'POST',
        body: JSON.stringify(tableHeaders),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const downloadFile = async (objArr, fileName) => {
    const newSheet = XLSX.utils.json_to_sheet(objArr)
    const newWorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(newWorkBook, newSheet, "mod sheet")
    await XLSX.writeFile(newWorkBook, `${fileName}.xlsx`)
  }

  useEffect(() => {
    console.log('sheet: ', sheetData)
  }, [sheetData])

  return <div className="main-container">
    <h1>רשימת תפוצה</h1>
    <Inputs
      downloadFile={downloadFile}
      uploadFile={uploadFile}
      tableKeys={tableKeys}
      problems={problems}
      setShowModal={setShowModal}
      validations={validations}
      validateSheet={validateSheet} />

    <div className="sheet-details-container">
    </div>
    {
      showProblemsStr && <div className='problem-msg-container'>
        <h2>
          בקובץ קיימות
          <span style={{ color: 'yellow' }}> {problems.length} </span> שורות שגויות מתוך {sheetData.length}</h2>
        <button onClick={() => setShowProblems(true)}>הצג</button>
      </div>
    }
    {
      showProblems && <Problems
        downloadFile={downloadFile}
        problems={problems}
        sheetData={sheetData}
        setProblems={setProblems}
        setShowProblems={setShowProblems}
        setSheetData={setSheetData} />
    }
    {
      showModal && <Modal
        setShowModal={setShowModal}
        setValidations={setValidations}
        tableKeys={tableKeys}
        validations={validations}
        validateSheet={validateSheet}
      />
    }
    {
      isLoading && <Loader />
    }

  </div>
}

export default Main
