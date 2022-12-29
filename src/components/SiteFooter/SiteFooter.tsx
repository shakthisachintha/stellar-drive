import React, { Component } from 'react'
import { Footer } from 'antd/es/layout/layout'

export default class SiteFooter extends Component {

  // get current year for footer
  getYear() {
    return new Date().getFullYear()
  }

  render() {
    return (
        <Footer style={{ textAlign: 'center' }}>Stellar Drive ©{this.getYear()} Created with ♥</Footer>
    )
  }
}
