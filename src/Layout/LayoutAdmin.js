import React from 'react'
import FooterPage from '../Components/Footer/FooterPage'
import './layout.css'
import HeaderAdmin from '../Components/Header/HeaderAdmin'

function LayoutAdmin({Component}) {
  return (
    <div>
        <HeaderAdmin />
        <div style={{marginTop: '8%'}}>
        <Component />
        </div>
        <FooterPage />
    </div>
  )
}

export default LayoutAdmin;
