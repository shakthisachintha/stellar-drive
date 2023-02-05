import React from 'react'
import { Header } from 'antd/es/layout/layout'
import { NavLink } from 'react-router-dom'
import './Navbar.scss'
import { asset } from '../../assets'
import { User } from '../../types'
import { Subscription } from 'rxjs'
import { AuthService } from '../../services/AuthService/AuthService'

interface NavbarState {
  isLogged: boolean,
  user?: User
}

export default class Navbar extends React.Component<any, NavbarState>{

  private authStatusSubscription?: Subscription;

  componentDidMount() {
    this.authStatusSubscription = AuthService.getInstance().getLoggedInStateObserver().subscribe(authState => {
      this.setState({
        isLogged: authState.isLoggedIn,
        user: {
          username: authState.user?.username || "",
          name: authState.user?.name || "",
          token: authState.user?.token || ""
        }
      })
    });
    AuthService.getInstance().checkAuthStatus();
  }

  async handleLogut() {
    await AuthService.getInstance().logout();
    window.location.href = '/login';
  }

  componentWillUnmount() {
    console.log('unmount');
    this.authStatusSubscription?.unsubscribe();
  }

  constructor(props: any) {
    super(props);
    this.state = { isLogged: false };
  }

  render() {
    const { isLogged, user } = this.state;
    return (
      <Header className='navbar-component'>
        <div>
          <NavLink to={'/'}>
          <div className='logo-container'>
            <img style={{ height: 40 }} src={asset.images.coverPng} alt="stellar drive logo" />
            <h2 style={{ color: "white", marginLeft: 20 }}>Stellar Drive</h2>
          </div>
          </NavLink>
        </div>

        <div>
          <div className='nav-menu-container'>
            {!isLogged && <div className='nav-item'>
              <NavLink className='nav-link' to={'/login'}> Login </NavLink>
            </div>}
            {isLogged && <div className='nav-item'>
              <NavLink className='nav-link capitalized' to={'/dashboard'}> {user?.name} </NavLink>
            </div>}
            {isLogged && <div className='nav-item'>
              <NavLink className='nav-link' to={'/upload'}> Upload </NavLink>
            </div>}
            {isLogged && <div className='nav-item'>
              <span onClick={this.handleLogut} className='nav-link'> Logout </span>
            </div>}
          </div>
        </div>
      </Header>
    )
  }
}
