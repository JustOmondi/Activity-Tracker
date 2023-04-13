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
    key: 'subgroup',
  },
  {
    title: 'Lesson',
    dataIndex: 'lessonAttendance',
    key: 'lesson-attendance',
    render: (details) => {
      const color = details[0]
      const isChecked = true ? details[1] === 1 : false
      return (<Checkbox className={`checkbox-${color} scale-[1.7]`} onChange={handleOnChange}></Checkbox>)
    }
  },
  {
    title: 'Activity',
    dataIndex: 'activityAttendance',
    key: 'activity-attendance',
    render: (details) => {
      const color = details[0]
      const isChecked = true ? details[1] === 1 : false
      return (<Checkbox className={`checkbox-${color} scale-[1.7]`} checked={isChecked} onChange={handleOnChange}></Checkbox>)
    }
  },
  {
    title: 'Homework',
    dataIndex: 'homeworkDone',
    key: 'homework-done',
    render: (details) => {
      const color = details[0]
      const isChecked = true ? details[1] === 1 : false
      return (<Checkbox className={`checkbox-${color} scale-[1.7]`} checked={isChecked} onChange={handleOnChange}></Checkbox>)
    }
  },
  {
    title: 'Meeting',
    dataIndex: 'meetingAttendance',
    key: 'meeting-attendance',
    render: (details) => {
      const color = details[0]
      const isChecked = true ? details[1] === 1 : false
      return (<Checkbox className={`checkbox-${color} scale-[1.7]`} checked={isChecked} onChange={handleOnChange}></Checkbox>)
    }
  },
];


  return (
    <Table dataSource={members} columns={columns} />
  )
}
