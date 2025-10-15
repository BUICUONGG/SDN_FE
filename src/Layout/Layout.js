import React from 'react'
import FooterPage from '../Components/Footer/FooterPage'
import HeaderPage from '../Components/Header/HeaderPage'
import './layout.css'

function Layout({Component}) {
  return (
    <div>
        <HeaderPage />
        <div style={{marginTop: '20vh'}}>
        <Component />
        </div>
        <FooterPage />
    </div>
  )
}

export default Layout;
