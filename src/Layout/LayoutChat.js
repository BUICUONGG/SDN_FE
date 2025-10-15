import React from 'react'
import FooterPage from '../Components/Footer/FooterPage'
import HeaderPage from '../Components/Header/HeaderPage'
import './layout.css'

function LayoutChat({Component}) {
  return (
    <div>
        <HeaderPage />
        <div style={{marginTop: '20vh'}}>
        <Component />
        </div>
    </div>
  )
}

export default LayoutChat;
