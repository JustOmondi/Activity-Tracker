import React, { useState, useEffect } from 'react'
import { Table, Checkbox, Button, Tooltip, notification, Skeleton} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import MemberModal from './MemberModal';

export default function MembersTable({members, subgroups, isLoading}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentMember, setCurrentMember] = useState({})

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

  const onChange = (pagination, filters, sorter, extra) => {
    // console.dir(filters);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (name) => {
        return (
          <>
            {isLoading && <Skeleton.Input active />}
            {!isLoading && (
              <div className='flex items-center'>
                <Tooltip title="Update">
                  <Button className='bg-stone-950 shadow-md flex justify-center pt-2 mr-3' type="primary" shape="circle" icon={<EditOutlined />} onClick={handleButtonClick}/>
                </Tooltip>
                <h3>{name}</h3>
              </div>
            )}
          </>
        )
      }
    },
    {
      title: 'Subgroup',
      dataIndex: 'subgroup',
      key: 'subgroup',
      filters: subgroups.map(item => {
        const {label, ...rest} = item
        
        return {text: label, ...rest}
      }),
      onFilter: (value, record) => {
        return `Subgroup ${value}` === record.subgroup
      },
      sorter: (a, b) => a.subgroup.localeCompare(b.subgroup),
      sortDirections: ['ascend', 'descend'],
      render: (text) => {
        return (
          <>
            {isLoading && <Skeleton.Input active />}
            {!isLoading && (
              <h3>{text}</h3>
            )}
          </>
        )
      }
    },
    {
      title: 'Lesson',
      dataIndex: 'lessonAttendance',
      key: 'lesson-attendance',
      responsive: ['lg'],
      sorter: (a, b) => a.lessonAttendance.localeCompare(b.lessonAttendance),
      render: (details) => {
        const color = details[0]
        const isChecked = details[1]
        return (
          <>
            {isLoading && <Skeleton.Input active />}
            {!isLoading && <Checkbox checked={isChecked} className={`checkbox-${color} scale-[1.7]`}></Checkbox>}
          </>
        )
      }
    },
    {
      title: 'Activity',
      dataIndex: 'activityAttendance',
      key: 'activity-attendance',
      responsive: ['lg'],
      sorter: (a, b) => a.activityAttendance.localeCompare(b.activityAttendance),
      render: (details) => {
        const color = details[0]
        const isChecked = details[1]
        return (
          <>
            {isLoading && <Skeleton.Input active />}
            {!isLoading && <Checkbox checked={isChecked} className={`checkbox-${color} scale-[1.7]`}></Checkbox>}
          </>
        )
      }
    },
    {
      title: 'Homework',
      dataIndex: 'homeworkDone',
      key: 'homework-done',
      responsive: ['lg'],
      sorter: (a, b) => a.homeworkDone.localeCompare(b.homeworkDone),
      render: (details) => {
        const color = details[0]
        const isChecked = details[1]
        return (
          <>
            {isLoading && <Skeleton.Input active />}
            {!isLoading && <Checkbox checked={isChecked} className={`checkbox-${color} scale-[1.7]`}></Checkbox>}
          </>
        )
      }
    },
    {
      title: 'Meeting',
      dataIndex: 'meetingAttendance',
      key: 'meeting-attendance',
      responsive: ['lg'],
      sorter: (a, b) => a.meetingAttendance.localeCompare(b.meetingAttendance),
      render: (details) => {
        const color = details[0]
        const isChecked = details[1]
        return (
          <>
            {isLoading && <Skeleton.Input active />}
            {!isLoading && <Checkbox checked={isChecked} className={`checkbox-${color} scale-[1.7]`}></Checkbox>}
          </>
        )
      }
    },
  ];


  return (
    <>
      {modalVisible && <MemberModal className='rounded-sm' hideModal={hideModal} member={currentMember} subgroups={subgroups} />}
      <Table
        dataSource={members}
        loading={isLoading}
        columns={columns}
        pagination={false}
        footer={() => `Total members: ${members.length}`}
        onRow={(record, index) => { return {onClick: handleRowClick}}} 
        onChange={onChange} />
    </>
    
  )
}
