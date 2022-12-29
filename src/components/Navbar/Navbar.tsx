import React, { Component } from 'react'
import { Header } from 'antd/es/layout/layout'
import { NavLink } from 'react-router-dom'
import './Navbar.scss'
import { asset } from '../../assets'
import { User } from '../../types'

interface NavbarState {
  isLogged: boolean,
  user?: User
}

export default class Navbar extends Component<any, NavbarState>{

  constructor(props: any) {
    super(props);
    this.state =  {isLogged: false };
  }

  render() {
    return (
      <Header className='navbar-component'>
        <div>
          <div className='logo-container'>
            <img style={{ height: 40 }} src={asset.images.coverPng} alt="stellar drive logo" />
            <h2 style={{ color: "white", marginLeft: 20 }}>Stellar Drive</h2>
          </div>
        </div>

        <div>
          <div className='nav-menu-container'>
            <div className='nav-item'>
              <NavLink className='nav-link' to={'/login'}> Login </NavLink>
            </div>
            <div className='nav-item'>
              <NavLink className='nav-link' to={'/dashboard'}> Dashboard </NavLink>
            </div>
            <div className='nav-item'>
              <NavLink className='nav-link' to={'/upload'}> Upload </NavLink>
            </div>
          </div>
        </div>

      </Header>
    )
  }
}
