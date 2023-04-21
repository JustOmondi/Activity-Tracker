import React, { useState } from 'react'
import { Button, Input, Modal, Select, Collapse, Space, message } from 'antd';
import AttendanceWeekView from './AttendanceWeekView';

import { BASE_API_URL, LESSON, ACTIVITY, HOMEWORK, WEEKLY_MEETING } from '../constants';

import { setMemberUpdated } from '../app/mainSlice';
import { useDispatch } from 'react-redux'

export default function MemberModal({hideModal, member, subgroups}) {
  const memberNameUnderscore = member.name.toLowerCase().replace(' ', '_')

  const [open, setOpen] = useState(true);
  const [newNameUnderscore, setNewNameUnderscore] = useState(memberNameUnderscore);
  const [currentSubgroup, setMemberSubgroup] = useState(member.subgroup);
  const [isLoading, setIsLoading] = useState(false)

  const [messageApi, contextHolder] = message.useMessage();
  
  const dispatch = useDispatch()

  const showMessage = (type, message) => {
      const duration = type === 'loading' ? 0 : 5
      
      messageApi.open({
          type: type,
          content: message,
          duration: duration,
      });
  }

  const hideMessage = () => {
      messageApi.destroy()
  }

  const { Panel } = Collapse;

  const lessonAttendance = {
    'thisWeek': member.thisWeekReports[LESSON], 
    'lastWeek': member.lastWeekReports[LESSON],
    'color': member.lessonAttendance[0]
  }

  const meetingAttendance = {
    'thisWeek': member.thisWeekReports[WEEKLY_MEETING], 
    'lastWeek': member.lastWeekReports[WEEKLY_MEETING],
    'color': member.meetingAttendance[0]
  }

  const homeworkAttendance = {
    'thisWeek': member.thisWeekReports[HOMEWORK], 
    'lastWeek': member.lastWeekReports[HOMEWORK],
    'color': member.homeworkAttendance[0]
  }

  const activityAttendance = {
    'thisWeek': member.thisWeekReports[ACTIVITY], 
    'lastWeek': member.lastWeekReports[ACTIVITY],
    'color': member.activityAttendance[0]
  }

  
  const handleNameInputChange = ({target}) => {
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

    fetch(url, {method: 'POST'})
    .then(async (response) => {
        hideMessage()

        if (response.status === 200) {
            const message = 'Name updated successfully'

            showMessage('success', message)

            if(memberNameUnderscore !== newNameUnderscore) {
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
        console.log(error)
        const message = 'Update failed. Please try again'

        setIsLoading(false)
        showMessage('error', message)
    })
  };

  const handleSubgroupUpdateClick = () => {
    const url = `${BASE_API_URL}/structure/member/update?name=${memberNameUnderscore}&new_subgroup=${currentSubgroup}`

    setIsLoading(true)
    showMessage('loading', 'Updating member subgroup')

    fetch(url, {method: 'POST'})
    .then(async (response) => {
        hideMessage()

        console.log(response.status)

        if (response.status === 200) {
            const message = 'Subgroup updated successfully'

            showMessage('success', message)

            if(member.subgroup !== currentSubgroup) {
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

  const afterClose = () => {
    hideModal()
    setOpen(true);
  }

  return (
    <>
      {contextHolder}
      <Modal
        title={`Edit Member`}
        style={{ top: 50 }}
        open={open}
        afterClose={afterClose}
        onCancel={handleCancel}

        footer={[
          <Button key="cancel" className='cancel-button' onClick={handleCancel}>
            Close
          </Button>
        ]}
      >
        <div className='flex items-center mt-8'>
          <h3 className='mr-3 font-bold'>Name:</h3> 
          <Space.Compact style={{ width: '100%' }}>
            <Input defaultValue={member.name} onChange={handleNameInputChange}/>
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
                onChange={handleSubgroupSelectChange}
            />
            <Button disabled={isLoading} className='ok-button' onClick={handleSubgroupUpdateClick}>Update</Button>
          </Space.Compact>
          
        </div>

        <Collapse className='mt-4' accordion>
          <Panel header={<h3 className='font-bold'>Lesson Attendance</h3>} key="1">
            <AttendanceWeekView
              showMessage={showMessage}
              hideMessage={hideMessage}
              attendance={lessonAttendance}
              reportName={LESSON}
              memberName={newNameUnderscore}/>
          </Panel>
          <Panel header={<h3 className='font-bold'>Activity Attendance</h3>} key="2">
            <AttendanceWeekView
              showMessage={showMessage}
              hideMessage={hideMessage}
              attendance={activityAttendance}
              reportName={ACTIVITY}
              memberName={newNameUnderscore}/>
          </Panel>
          <Panel header={<h3 className='font-bold'>Homework Done</h3>} key="3">
            <AttendanceWeekView
              showMessage={showMessage}
              hideMessage={hideMessage}
              attendance={homeworkAttendance}
              reportName={HOMEWORK}
              memberName={newNameUnderscore}/>
          </Panel>
          <Panel header={<h3 className='font-bold'>Weekly Meeting Attendance</h3>} key="4">
            <AttendanceWeekView
              showMessage={showMessage}
              hideMessage={hideMessage}
              attendance={meetingAttendance}
              reportName={WEEKLY_MEETING}
              memberName={newNameUnderscore}/>
          </Panel>
        </Collapse>
      </Modal>
    </>
  );
}
