import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';

import { Table, Tag, Space } from 'antd';

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    //render: text => <a>{text}</a>,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>查看</a>
        <a>修改</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: '星火test',
    type: "mysql",
  },
  {
    key: '2',
    name: '双师test',
    type: "mysql",
  },
  {
    key: '3',
    name: '培优test',
    type: "mysql",
  },
];
export  class Data extends React.Component {
  render() {
  
     return (
      <>
      <Table columns={columns} dataSource={data} />
      </>
     )
    }
}
