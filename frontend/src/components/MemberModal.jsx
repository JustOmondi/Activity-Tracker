import React, { useState } from 'react'
import { Button, Input, Modal, Select, Collapse } from 'antd';
import AttendanceWeekView from './AttendanceWeekView';

import { LESSON, ACTIVITY, HOMEWORK, WEEKLY_MEETING } from '../constants';

export default function MemberModal({hideModal, member, subgroups}) {
    const [open, setOpen] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const { Panel } = Collapse;

    const lessonAttendance = true ? member.lessonAttendance[1] === 1 : false; 
    const meetingAttendance = true ? member.meetingAttendance[1] === 1 : false; 
    const homeworkDone = true ? member.homeworkDone[1] === 1 : false; 
    const activityAttendance = true ? member.activityAttendance[1] === 1 : false; 

    const handleOk = () => {
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false)
        setConfirmLoading(false);
      }, 2000);
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
        <Modal
          title={`Edit Member`}
          style={{ top: 50 }}
          open={open}
          onOk={handleOk}
          afterClose={hideModal}
          okButtonProps={{}}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}

          footer={[
            <Button key="cancel" className='cancel-button' onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="ok" className='ok-button' loading={confirmLoading} onClick={handleOk}>
              Update
            </Button>
          ]}
        >
          <div className='flex items-center mt-8'>
            <h3 className='mr-3 font-bold'>Name:</h3>
            <Input defaultValue={member.name} />
          </div>
          <div className='flex items-center mt-8'>
            <h3 className='mr-3 font-bold'>Subgroup:</h3>
            <Select
                defaultValue={member.subgroup}
                style={{ width: 120 }}
                options={subgroups}
            />
          </div>

          <Collapse className='mt-4' accordion>
            <Panel header="Lesson" key="1">
              <AttendanceWeekView attendanceList={lessonAttendance} reportName={LESSON} member={member.name}/>
            </Panel>
            <Panel header="Activity" key="2">
              <AttendanceWeekView attendanceList={activityAttendance} reportName={ACTIVITY} member={member.name}/>
            </Panel>
            <Panel header="Homework" key="3">
              <AttendanceWeekView attendanceList={homeworkAttendance} reportName={HOMEWORK} member={member.name}/>
            </Panel>
            <Panel header="Meeting" key="4">
              <AttendanceWeekView attendanceList={meetingAttendance} reportName={WEEKLY_MEETING} member={member.name}/>
            </Panel>
          </Collapse>
        </Modal>
      </>
    );
}
