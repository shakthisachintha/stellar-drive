import React from 'react'
import { Button, Form, Input, Tabs } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { AuthService } from '../../services/AuthService/AuthService';
import { Toast } from '../../services/ToastNotificationService/Toast';

export default class LoginPage extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = { isLogged: false };
  }

  renderLogin() {

    const onFinish = async (values: any) => {
      try {
        await AuthService.getInstance().login(values.username, values.password);
        this.props.history.push('/dashboard');
      } catch (error: any) {
        Toast.error("Login error", error.message);
      }
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    return (
      <div>
        <h1>Login</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ username: "", password: "" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout={'vertical'}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  renderRegister() {

    const onFinish = async (values: any) => {
      try {
        await AuthService.getInstance().register(values.username, values.password, values.name, values.email)
        this.props.history.push('/login');
      } catch (error: any) {
        Toast.error("Registration error", error.message);
      }
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    return (
      <div>
        <h1>Register</h1>
        <Form
          name="normal_login"
          className="login-form"
          autoComplete='off'
          initialValues={{ name: "", username: "", password: "", confirmPassword: "", email: "" }}
          aria-autocomplete='none'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout={'vertical'}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please pick a username!' }]}
          >
            <Input autoComplete="off" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter an email address!' }, { type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input autoComplete="off" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input autoComplete="off" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              autoComplete="off"
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: 'Please type password again!' }]}
          >
            <Input
              autoComplete="off"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  render() {
    return (
      <Tabs
        defaultActiveKey="1"
        centered
        items={[
          { label: 'Login', key: 'login', children: this.renderLogin() },
          { label: 'Register', key: 'register', children: this.renderRegister() }
        ]}
      />
    )
  }
}
