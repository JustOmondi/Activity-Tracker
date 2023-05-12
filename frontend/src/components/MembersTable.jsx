import { EditOutlined } from '@ant-design/icons';
import { Button, Checkbox, Table, Tooltip } from 'antd';
import React, { useState } from 'react';
import { getAllReportItems } from '../Config';
import MemberModal from './MemberModal';

import { useDispatch, useSelector } from 'react-redux';
import { setMemberUpdated } from '../app/mainSlice';

export default function MembersTable({ members, subgroups, reloadTableData, showMessage, hideMessage }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentMember, setCurrentMember] = useState({})

  const memberUpdated = useSelector((state) => state.memberUpdated.value)

  const dispatch = useDispatch()

  const handleRowClick = ({ target }) => {
    const row = target.closest('tr');
    const rowIndex = row && row.getAttribute('data-row-key');
    const member = rowIndex && members.find(item => item.key === parseInt(rowIndex));

    setCurrentMember(member)
    showModal()
  }

  const handleButtonClick = () => {
    showModal()
  }

  const hideModal = () => {
    setModalVisible(false)

    if (memberUpdated) {
      dispatch(setMemberUpdated(false))
      reloadTableData();
    }
  }

  const showModal = () => {
    setModalVisible(true)
  }

  const getReportColumns = () => {
    const columns = []

    for (let reportItem of getAllReportItems()) {
      columns.push({
        title: reportItem.title.split(' ')[0],
        dataIndex: `${reportItem.name}Attendance`,
        key: `${reportItem.name}-attendance`,
        filters: [
          { text: 'Checked', value: true },
          { text: 'Not checked', value: false }
        ],
        onFilter: (value, record) => {
          return value === record[`${reportItem.name}Attendance`]
        },
        responsive: ['lg'],
        render: (isChecked) => {
          return (
            <Checkbox checked={isChecked} className={`checkbox-${reportItem.color} scale-[1.7]`}></Checkbox>
          )
        }
      })
    }

    return columns
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (name) => {
        return (
          <div className='flex items-center'>
            <Tooltip title="Update">
              <Button className='bg-stone-950 shadow-md flex justify-center pt-2 mr-3' type="primary" shape="circle" icon={<EditOutlined />} onClick={handleButtonClick} />
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
      filters: subgroups.map(item => {
        const { label, ...rest } = item

        return { text: label, ...rest }
      }),
      onFilter: (value, record) => {
        return `Subgroup ${value}` === record.subgroup
      },
      sorter: (a, b) => a.subgroup.localeCompare(b.subgroup),
      sortDirections: ['ascend', 'descend'],
      render: (text) => {
        return (
          <h3>{text}</h3>
        )
      }
    },
    ...getReportColumns()
  ];

  return (
    <>
      {modalVisible && <MemberModal className='rounded-sm' hideModal={hideModal} member={currentMember} subgroups={subgroups} showMessage={showMessage} hideMessage={hideMessage} />}

      <Table
        dataSource={members}
        columns={columns}
        pagination={false}
        footer={() => `Total members: ${members.length}`}
        onRow={() => { return { onClick: handleRowClick } }} />
    </>

  )
}
