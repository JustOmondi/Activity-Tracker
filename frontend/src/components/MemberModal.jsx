import { Button, Collapse, Input, Modal, Popconfirm, Select, Space } from 'antd';
import React, { useState } from 'react';
import AttendanceWeekView from './AttendanceWeekView';

import { BASE_API_URL, getAllReportItems } from '../Config';

import { useDispatch } from 'react-redux';
import { setMemberUpdated } from '../app/mainSlice';

export default function MemberModal({ hideModal, member, subgroups, showMessage, hideMessage }) {
  const memberNameUnderscore = member.name.toLowerCase().replaceAll(' ', '_')

  const [open, setOpen] = useState(true);
  const [newNameUnderscore, setNewNameUnderscore] = useState(memberNameUnderscore);
  const [currentSubgroup, setMemberSubgroup] = useState(member.subgroup.split(' ')[1]);
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const { Panel } = Collapse;

  const getAttendance = (reportName, reportColor) => {
    return {
      'thisWeek': member.thisWeekReports[reportName],
      'lastWeek': member.lastWeekReports[reportName],
      'color': reportColor
    }
  }

  const handleNameInputChange = ({ target }) => {
    const name = target.value.toLowerCase().replace(' ', '_')
    setNewNameUnderscore(name)
  }

  const handleSubgroupSelectChange = (value) => {
    setMemberSubgroup(value)
  }

  const handleNameUpdateClick = () => {
    const url = `${BASE_API_URL}/structure/member/update?name=${memberNameUnderscore}&new_name=${newNameUnderscore}`

    setIsLoading(true)
    showMessage('loading', 'Updating member name')

    fetch(url, { method: 'POST' })
      .then(async (response) => {
        hideMessage()

        if (response.status === 200) {
          const message = 'Name updated successfully'

          showMessage('success', message)

          setOpen(false);
          if (memberNameUnderscore !== newNameUnderscore) {
            // Update redux store to indicate a member has been updated 
            dispatch(setMemberUpdated(true))
          }

        } else {
          const message = 'Update failed. Please try again'

          showMessage('error', message)
        }

        setIsLoading(false)
      })
      .catch(error => {
        hideMessage()
        const message = 'Update failed. Please try again'

        setIsLoading(false)
        showMessage('error', message)
      })
  };

  const handleSubgroupUpdateClick = () => {
    const url = `${BASE_API_URL}/structure/member/update?name=${memberNameUnderscore}&new_subgroup=${currentSubgroup}`

    setIsLoading(true)
    showMessage('loading', 'Updating member subgroup')

    fetch(url, { method: 'POST' })
      .then(async (response) => {
        hideMessage()

        console.log(response.status)

        if (response.status === 200) {
          const message = 'Subgroup updated successfully'

          showMessage('success', message)

          if (member.subgroup !== currentSubgroup) {
            // Update redux store to indicate a member has been updated 
            dispatch(setMemberUpdated(true))
          }

        } else {
          const message = 'Update failed. Please try again'

          showMessage('error', message)
        }

        setIsLoading(false)
      })
      .catch(error => {
        console.log(error)
        hideMessage()

        const message = 'Update failed. Please try again'

        setIsLoading(false)
        showMessage('error', message)
      })
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleRemoveMemberClick = () => {
    const url = `${BASE_API_URL}/structure/member/remove?name=${memberNameUnderscore}&subgroup=${currentSubgroup}`

    setIsLoading(true)
    showMessage('loading', 'Removing member')

    fetch(url, { method: 'POST' })
      .then(async (response) => {
        hideMessage()

        if (response.status === 200) {
          const message = 'Member removed successfully'

          showMessage('success', message)

          setOpen(false);
          dispatch(setMemberUpdated(true))

        } else {
          const message = 'Member removal failed. Please try again'

          showMessage('error', message)
        }

        setIsLoading(false)
      })
      .catch(error => {
        hideMessage()
        const message = 'Member removal failed. Please try again'

        setIsLoading(false)
        showMessage('error', message)
      })
  };

  const afterClose = () => {
    hideModal()
    setOpen(true);
  }

  return (
    <>
      <Modal
        title='Edit Member'
        style={{ top: 50 }}
        open={open}
        afterClose={afterClose}
        onCancel={handleCancel}

        footer={[
          <Popconfirm
            title={`Remove ${member.name}`}
            description={`Are you sure you would like to remove this member?`}
            onConfirm={handleRemoveMemberClick}
            onCancel={() => { }}
            okText="Yes"
            cancelText="No">
            <Button key="remove" type='default'>
              Remove Member
            </Button>
          </Popconfirm>,
          <Button key="cancel" className='cancel-button' onClick={handleCancel}>
            Close
          </Button>
        ]}>
        <div className='flex items-center mt-8'>
          <h3 className='mr-3 font-bold'>Name:</h3>
          <Space.Compact style={{ width: '100%' }}>
            <Input defaultValue={member.name} onChange={handleNameInputChange} />
            <Button disabled={isLoading} className='ok-button' onClick={handleNameUpdateClick}>Update</Button>
          </Space.Compact>
        </div>
        <div className='flex items-center mt-8'>
          <h3 className='mr-3 font-bold'>Subgroup:</h3>
          <Space.Compact style={{ width: '100%' }}>
            <Select
              defaultValue={member.subgroup}
              style={{ width: 120 }}
              options={subgroups}
              onChange={handleSubgroupSelectChange} />
            <Button disabled={isLoading} className='ok-button' onClick={handleSubgroupUpdateClick}>Update</Button>
          </Space.Compact>

        </div>

        <Collapse className='mt-4' accordion>
          {getAllReportItems().map((reportItem, index) => {
            return (
              <Panel header={<h3 className='font-bold'>{reportItem.title}</h3>} key={index}>
                <AttendanceWeekView
                  showMessage={showMessage}
                  hideMessage={hideMessage}
                  attendance={getAttendance(reportItem.name, reportItem.color)}
                  reportName={reportItem.name}
                  memberName={newNameUnderscore} />
              </Panel>
            )
          })}
        </Collapse>
      </Modal>
    </>
  );
}
