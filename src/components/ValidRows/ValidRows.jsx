import React from 'react'
import './validRows.css'

const ValidRows = ({ validData, sqlHeaders, setSqlHeaders }) => {
  const sqlHeaderMap = {
    target_name: 'שם',
    aff: 'קרבה',
    notes: 'הערות',
    inviter: 'מזמין',
    email: 'E-mail'
  }
  const getHeader = header => Object.keys(sqlHeaders)[getHeaderIdx(header)]
  const getHeaderIdx = headerStr => Object.values(sqlHeaders).findIndex(headerVal => headerVal === headerStr)


  return <div className="valid-rows-container">
    <ul className="header-list valid-list">
      {
        Object.keys(validData[0]).reverse().map((header, i) =>
          <li key={header + i} className='row-header'>
              {
                (getHeader(header) === 'target_phone') ? 
                <p>טלפון</p>:
            <select name="" id="" defaultValue='' onChange={e => setSqlHeaders({...sqlHeaders, [e.target.value]: header})} >
                <>
                <option disabled value=''>שייך שדה</option>
                {
                  Object.keys(sqlHeaders)
                  .filter(sqlHeader => sqlHeader !== 'target_phone').map(sqlHeader => {
                    return <option key={sqlHeader} disabled={sqlHeaders[sqlHeader]} value={sqlHeader}>{sqlHeaderMap[sqlHeader]}</option>
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
            {Object.values(validRow).reverse().map((validItem,i) => <p key={validItem+i} className='data-item'>{validItem}</p>)}
          </li>
        })
      }
    </ul>
  </div>
}

export default ValidRows