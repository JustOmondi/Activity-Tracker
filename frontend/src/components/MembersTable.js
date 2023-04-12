import React from 'react'
import { Space, Table, Tag, Checkbox } from 'antd';



export default function MembersTable({color, members}) {
  
const handleOnChange = ({target}) => {
  return true
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Subgroup',
    dataIndex: 'subgroup',
    key: 'age',
  },
  {
    title: 'Last Week Attended',
    dataIndex: 'lastweek-attended',
    key: 'lastweek-attended',
    render: (lastweekAttended) => (<Checkbox className={`checkbox-${color} scale-[1.7]`} checked={lastweekAttended} disabled={true}></Checkbox>)
  },
  {
    title: 'Attended',
    dataIndex: 'attended',
    key: 'attended',
    render: (attended) => (<Checkbox className={`checkbox-${color} scale-[1.7]`} checked={attended} disabled={false} onChange={handleOnChange}></Checkbox>)
  },
];


  return (
    <Table dataSource={members} columns={columns} />
  )
}
