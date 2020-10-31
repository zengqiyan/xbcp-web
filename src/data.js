import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Table, Tag, Space } from 'antd';
import {pageDataSources} from './dataSourceService'
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
  constructor(props){
    super(props)
    this.state={
        dataSource : [],  //数据源
        total: 0,
     
    }
}
componentDidMount(){
  this.pageData(1,10);
}
  pageData(pageNum,pageSize){
    pageDataSources({"pageNum":pageNum,"pageSize":pageSize},(data)=>{
      let list=data.list.map((item)=>{
        return {
                key: item.id,
                name: item.name,
                type: item.type,
            }
    })
      this.setState({
        dataSource:list,
        total:data.total
    })
    })
  }
  render() {  
    
     const {dataSource,total} = this.state
     return (
      <>
      <Table columns={columns} dataSource={dataSource} pagination={{total:total,pageSize:10,onChange:this.pageData}}/>
      </>
     )
    }
}
