import React from 'react'
import './layout.css'
import HeaderPayment from '../Components/Header/HeaderPayment'

function LayoutPayment({Component}) {
  return (
    <div>
        <HeaderPayment />
        <div style={{marginTop: '20vh'}}>
        <Component />
        </div>
    </div>
  )
}

export default LayoutPayment;
