import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import {HashRouter , Route , Link, Switch,withRouter} from 'react-router-dom'
import {Data} from './data'
import {Home} from './home'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const createHistory = require("history").createBrowserHistory
const history = createHistory()
class Index extends React.Component {
  render() {
    let locationHash  = history.location.hash
    locationHash = locationHash.replace('#', '');
    return (
     <>
     <Layout>
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Header>
    <HashRouter>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={[locationHash]}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
           <Menu.Item key="/"><Link to="/">主页</Link></Menu.Item>
           <Menu.Item key="/data"><Link to="/data">数据源管理</Link></Menu.Item>
          
          <SubMenu key="sub2" icon={<LaptopOutlined />} title="业务校验">
            <Menu.Item key="5">option5</Menu.Item>
            <Menu.Item key="6">option6</Menu.Item>
            <Menu.Item key="7">option7</Menu.Item>
            <Menu.Item key="8">option8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<NotificationOutlined />} title="业务规则分析">
            <Menu.Item key="9">分类规则分析</Menu.Item>
            <Menu.Item key="10">线性规则分析</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 480,
          }}
        >
          <Switch>
               <Route exact={true} path="/" component={Home}></Route>
               <Route path="/data" component={Data}></Route>
           </Switch>
        </Content>
      </Layout>
    </Layout>
    </HashRouter>
  </Layout>
     </>
    )
   }
}

ReactDOM.render(
  <Index />,
  document.getElementById('container'),
);