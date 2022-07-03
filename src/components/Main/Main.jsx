import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as XLSX from 'xlsx'
import Inputs from '../Inputs/Inputs'
import Loader from '../Loader/Loader'
import Problems from '../Problems/Problems'
import { saveToLocalStorage } from '../../localStorageService'
import './main.css'
import ValidRows from '../ValidRows/ValidRows'

const Main = () => {
  const [sheetData, setSheetData] = useState([])
  // const [validations, setValidations] = useState({})
  const [tableKeys, setTableKeys] = useState([])
  // const [showModal, setShowModal] = useState(false)
  const [showProblemsStr, setShowProblemsStr] = useState(false)
  const [showProblems, setShowProblems] = useState(false)
  const [problems, setProblems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sqlHeaders, setSqlHeaders] = useState({
    target_phone: '', target_name: '', aff: '', notes: '', inviter: '', email: ''
  })
  const [validData, setValidData] = useState([])
  const PATH = '/'

  const { event_hash } = useParams()


  const uploadFile = e => {
    setIsLoading(true)
    try {

      const file = e.target.files[0]
      const fileReader = new FileReader()
      file.type === 'text/csv' ?
        fileReader.readAsText(file) :
        fileReader.readAsArrayBuffer(file)

      fileReader.onload = e => {
        const bufferArray = e.target.result
        const workBook = XLSX.read(bufferArray, { type: file.type === 'text/csv' ? 'string' : "buffer" })
        const workSheetName = workBook.SheetNames[0]
        const workSheet = workBook.Sheets[workSheetName]
        getTableKeys(workSheet)
        const data = XLSX.utils.sheet_to_json(workSheet)

        setSheetData(data)
      }
      setIsLoading(false)
    } catch (err) {
      console.log('error at uploading: ', err)
    }

  }

  const updatePhoneValidation = () => {
    const phoneColHeader = getPhoneColHeader()
    setSqlHeaders({ ...sqlHeaders, target_phone: phoneColHeader })
    if (!phoneColHeader) {
      alert('הקובץ לא מכיל שדה תקין של מספרי טלפון. טען קובץ חדש.')
      setSheetData([])
      return
    }
  }

  const getPhoneColHeader = () => {
    for (let i = 0; i < sheetData.length; i++) {
      const row = sheetData[i]
      for (const field in row) {
        if (validatePhone(row[field])) return field
      }
    }
    return null
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
  }

  const initialValidateSheet = () => {
    setProblems([])
    setValidData([])
    let duplicateValues = []
    sheetData.forEach((rowObj, i) => {
      const phoneNumber = rowObj[sqlHeaders.target_phone]
      if (!validatePhone(phoneNumber)) {
        addProblem(rowObj.__rowNum__, 'טלפון', phoneNumber, sqlHeaders.target_phone)
        return
      }
      if (validateDuplicateCells(phoneNumber, i, sqlHeaders.target_phone) && !duplicateValues.includes(phoneNumber)) {
        addProblem(rowObj.__rowNum__, 'כפילויות', phoneNumber, sqlHeaders.target_phone)
        duplicateValues.push(phoneNumber)
        return
      }
      tableKeys.forEach(tableKey => {
        if (!rowObj[tableKey]) rowObj[tableKey] = ''
      })
      setValidData(prev => [...prev, rowObj])
    })
  }

  const validateSheet = () => {
    initialValidateSheet()
    setShowProblemsStr(true)
  }

  const addProblem = (rowNum, validationType, value, field) => {
    const problemObj = { rowNum: rowNum + 1, problem: validationType, value: value, field: field }
    // console.log('problem object: ', problemObj)
    setProblems(prevArr => [...prevArr, problemObj])
  }

  const validatePhone = (str, _ = '', _2 = '') => {
    const cleanStr = cleanString(str)
    return cleanStr.match(/^05[0-9]{8}$|^5[0-9]{8}$/)
  }


  const validateDuplicateCells = (str, i, col) => sheetData.find((row, index) => (str && row[col] === str && i !== index))

  const cleanString = str => (str + '').replace(/^972|[+()-.]/g, '').trim()

  const getSqlHeader = str => {
    for (const header in sqlHeaders) {
      if (sqlHeaders[header] === str) return header
    }
    return ''
  }

  const getHash = () => Math.random().toString(36).substring(5);

  const uploadToServer = () => {
    let sqlStr = {}
    validData.forEach(validRowObj => {
      for (const field in validRowObj) {
        const sqlHeader = getSqlHeader(field)
        if (sqlHeader) sqlStr[sqlHeader] = validRowObj[field]
      }
      sqlStr.isactive = 0
      sqlStr.isDick = 0
      sqlStr.event_hash = event_hash
      sqlStr.hash = getHash()

      addRowToSql(sqlStr)
    })
    // removeFromLocalStorage()
  }
  const addRowToSql = async (rowObj) => {
    try {

      await fetch(`${PATH}/`, {
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
    catch (err) {
      console.log(err.message)
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
    sheetData.length && saveToLocalStorage(sheetData)
    if (sheetData.length && !sqlHeaders.target_phone) updatePhoneValidation()
    // eslint-disable-next-line
  }, [sheetData])

  useEffect(() => {
    if (sqlHeaders.target_phone) validateSheet()
    // eslint-disable-next-line
  }, [sqlHeaders.target_phone])

  return <div className="main-container">
    <h1>d</h1>
    <Inputs
      downloadFile={downloadFile}
      uploadFile={uploadFile}
      tableKeys={tableKeys}
      problems={problems}
      // setShowModal={setShowModal}
      sqlHeaders={sqlHeaders}
      uploadToServer={uploadToServer}
      validData={validData}
      // validations={validations}
      validateSheet={validateSheet}
    />

    <div className="sheet-details-container">
    </div>
    {
      showProblemsStr && <div className='problem-msg-container'>
        <h2>
          בקובץ קיימות
          <span className='yellow'> {problems.length} </span> שורות שגויות מתוך {sheetData.length}
        </h2>
        <button disabled={!problems.length} onClick={() => setShowProblems(true)}>הצג</button>
      </div>
    }
    {
      showProblems && <Problems
        downloadFile={downloadFile}
        problems={problems}
        sheetData={sheetData}
        setProblems={setProblems}
        setShowProblems={setShowProblems}
        setSheetData={setSheetData}
        validateSheet={validateSheet}
      />
    }
    {
      (validData.length > 0) && <ValidRows
        validData={validData}
        sqlHeaders={sqlHeaders}
        setSqlHeaders={setSqlHeaders}
        tableKeys={tableKeys}
      />
    }
    {
      isLoading && <Loader />
    }

  </div>
}

export default Main

  // const validateRow = (rowObj, index) => {
  //   for (const value in validations) {

  //     const currValidation = validations[value]
  //     const currValue = rowObj[value]
  //     let validationFunc
  //     switch (currValidation) {
  //       case 'email':
  //         validationFunc = validateEmail;
  //         break;
  //       case 'טלפון':
  //         validationFunc = validatePhone;
  //         break;
  //       case 'תאים ריקים':
  //         validationFunc = validateFullCells;
  //         break;
  //       case 'כפילויות':
  //         validationFunc = validateDuplicateCells;
  //         break;
  //       default:
  //         validationFunc = console.log
  //         break;
  //     }
  //       if (!validationFunc(currValue + '', index, value))  addProblem(rowObj.__rowNum__, currValidation,currValue,value)
  //   }
  // }

  // const validateEmail = (str, _ = '', _2 = '') => str.match(/^\S+@\S+\.\S+$/)
  // const validateFullCells = (str, _ = '', _2 = '') => (str+'').trim() !== 'undefined'

/* {
showModal && <Modal
  setShowModal={setShowModal}
  setValidations={setValidations}
  tableKeys={tableKeys}
  validations={validations}
  validateSheet={validateSheet}
/>
} */
