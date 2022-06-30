import React, { useState, useEffect } from 'react'
import './validRows.css'

const ValidRows = ({ validData, sqlHeaders, setSqlHeaders, tableKeys }) => {
  const [hide,setHide] = useState('')
  const sqlHeaderMap = {
    target_phone: 'טלפון',
    target_name: 'שם',
    aff: 'קרבה',
    notes: 'הערות',
    inviter: 'מזמין',
    email: 'E-mail'
  }
  const getHeader = header => Object.keys(sqlHeaders)[getHeaderIdx(header)]
  const getHeaderIdx = headerStr => Object.values(sqlHeaders).findIndex(headerVal => headerVal === headerStr)
  useEffect(() => {
    setTimeout(() => setHide('hide'),3000)
  },[])

  useEffect(() => {
    console.log(sqlHeaders)
       // eslint-disable-next-line
  }, [sqlHeaders])

  return <div className="valid-rows-container">
    <p className={`phone ${hide}`}>ניתן לערוך ולטעון את הקובץ דרך המחשב בלבד</p>
    <ul className="valid-list">
      <li className="header-item">
        {
          tableKeys
            .filter(header => header !== 'rowNum')
            .map((header, i) =>
            {
              return (getHeader(header)) ?
                <p key={header+i} className='data-item'>
                  {
                    getHeader(header) === 'target_phone' ||
                    <span  onClick={() => setSqlHeaders({ ...sqlHeaders, [getHeader(header)]: '' })}>✎</span>
                  }
                  &nbsp;
                  {sqlHeaderMap[getHeader(header)]}
                </p> :
                <p key={header+i} className='data-item'>
                  <select 
                      name="" 
                      id="" 
                      defaultValue='' 
                      onChange={e => setSqlHeaders({ ...sqlHeaders, [e.target.value]: header })} >
                    <>
                      <option disabled value=''>שייך שדה</option>
                      {
                        Object.keys(sqlHeaders)
                          .filter(sqlHeader => sqlHeader !== 'target_phone').map(sqlHeader => {
                            return <option key={sqlHeader}
                              disabled={sqlHeaders[sqlHeader]}
                              value={sqlHeader}>
                              {sqlHeaderMap[sqlHeader]}
                            </option>
                          })
                      }
                    </>
                  </select>
                </p>
            }
            )
            .reverse()
        }
      </li>
      
        {
          validData.map((validRow, i) => {
            return <li key={i} className='row-item'>
              {
                tableKeys
                  .filter(tableKey => tableKey !== 'rowNum')
                  .reverse()
                  .map((tableKey, i) => {
                    return <p key={tableKey + i} className='data-item'>
                      {validRow[tableKey]}
                    </p>
                  })
              }
            </li>
          })
        }
    </ul>
  </div>
}

export default ValidRows