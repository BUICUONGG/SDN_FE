import React from 'react'
import FooterPage from '../Components/Footer/FooterPage'
import HeaderPage from '../Components/Header/HeaderPage'
import './layout.css'
import HeaderCart from '../Components/Header/HeaderCart'

function LayoutCart({Component}) {
  return (
    <div>
        <HeaderCart />
        <div style={{marginTop: '20vh'}}>
        <Component />
        </div>
        <FooterPage />
    </div>
  )
}

export default LayoutCart;
