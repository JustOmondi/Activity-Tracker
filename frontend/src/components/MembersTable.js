import React, { useState, useEffect } from 'react'
import { Table, Checkbox, Button, Tooltip, notification} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import MemberModal from './MemberModal';

export default function MembersTable({members, isLoading}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentMember, setCurrentMember] = useState({})
  const [showNotification, setShowNotification] = useState(false)

  const handleRowClick = ({target}) => {
    const row = target.closest('tr');
    const rowIndex = row && row.getAttribute('data-row-key'); 
    const member = rowIndex && members.find(item => item.key === parseInt(rowIndex));

    setCurrentMember(member)
    showModal()
  }

  const handleButtonClick = ({target}) => {
    showModal()
  }

  const hideModal = () => {
    setModalVisible(false)
  }

  const showModal = () => {
    setModalVisible(true)
  }


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => {
        return (
          <div className='flex items-center'>
              <Tooltip title="Update">
                <Button className='bg-stone-950 shadow-md flex justify-center pt-2 mr-3' type="primary" shape="circle" icon={<EditOutlined />} onClick={handleButtonClick}/>
              </Tooltip>
              <h3>{name}</h3>
          </div>
        )
      }
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
        return (<Checkbox checked={isChecked} className={`checkbox-${color} scale-[1.7]`}></Checkbox>)
      }
    },
    {
      title: 'Activity',
      dataIndex: 'activityAttendance',
      key: 'activity-attendance',
      render: (details) => {
        const color = details[0]
        const isChecked = true ? details[1] === 1 : false
        return (<Checkbox checked={isChecked} className={`checkbox-${color} scale-[1.7]`}></Checkbox>)
      }
    },
    {
      title: 'Homework',
      dataIndex: 'homeworkDone',
      key: 'homework-done',
      render: (details) => {
        const color = details[0]
        const isChecked = true ? details[1] === 1 : false
        return (<Checkbox checked={isChecked} className={`checkbox-${color} scale-[1.7]`}></Checkbox>)
      }
    },
    {
      title: 'Meeting',
      dataIndex: 'meetingAttendance',
      key: 'meeting-attendance',
      render: (details) => {
        const color = details[0]
        const isChecked = true ? details[1] === 1 : false
        return (<Checkbox checked={isChecked} className={`checkbox-${color} scale-[1.7]`}></Checkbox>)
      }
    },
  ];


  return (
    <>
      {modalVisible && <MemberModal className='rounded-sm' hideModal={hideModal} member={currentMember}/>}
      <Table
        loading={isLoading}
        dataSource={members}
        columns={columns}
        onRow={(record, index) => { return {onClick: handleRowClick}}} />
    </>
    
  )
}
