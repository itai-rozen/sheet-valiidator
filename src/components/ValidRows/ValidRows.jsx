import React, { useEffect } from 'react'
import './validRows.css'

const ValidRows = ({ validData, sqlHeaders, setSqlHeaders, tableKeys }) => {
  const sqlHeaderMap = {
    target_phone: 'טלפון',
    target_name: 'שם',
    aff: 'קרבה',
    notes: 'הערות',
    modifier: 'מזמין',
    email: 'E-mail'
  }
  const getHeader = header => Object.keys(sqlHeaders)[getHeaderIdx(header)]
  const getHeaderIdx = headerStr => Object.values(sqlHeaders).findIndex(headerVal => headerVal === headerStr)

  useEffect(() => {
    console.log('sql headers:', sqlHeaders)
    console.log('table keys: ', tableKeys)
  }, [sqlHeaders])
  return <div className="valid-rows-container">
    <ul className="header-list valid-list">
      {
        Object.keys(validData[0]).reverse()
        .filter(header => header !== 'rowNum')
        .map((header, i) =>
          <li key={header + i} className='row-header'>

            {
              (getHeader(header)) ?
                <p>{sqlHeaderMap[getHeader(header)]}
                  {getHeader(header) === 'target_phone' ||
                    <span onClick={() => setSqlHeaders({ ...sqlHeaders, [getHeader(header)]: '' })}>❌</span>
                  }
                </p> :
                <select name="" id="" defaultValue='' onChange={e => setSqlHeaders({ ...sqlHeaders, [e.target.value]: header })} >
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
            }
          </li>
        )
      }
    </ul>
    <ul className="rows-list valid-list">
      {
        validData.map((validRow, i) => {
          return <li key={i} className='row-item'>
            {
              tableKeys
              .filter(tableKey => tableKey !== 'rowNum')
              .reverse()
              .map((tableKey,i) => {
               return <p key={tableKey+i} className='data-item'>{validRow[tableKey]}</p> 
              })
              // Object.values(validRow).reverse()
              //   .map((validItem, j) => {
              //     return (validItem) ?
              //       <p key={validItem + j} className='data-item'>{validItem}</p> :
              //       <p key={validItem + j} className='data-item'></p>

              //   })
            }
          </li>
        })
      }
    </ul>
  </div>
}

export default ValidRows