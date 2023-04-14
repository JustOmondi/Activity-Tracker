import React, { useState } from 'react'
import { Button, Checkbox, Input, Modal, Select } from 'antd';

export default function MemberModal({hideModal, member, subgroups}) {
    const [open, setOpen] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(false);

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
          <div className='mt-8 flex flex-col justify-center w-full member-modal-checkboxes'>
            <Checkbox className={`ml-2 mb-2 font-bold checkbox-${member.lessonAttendance[0]}`} defaultChecked={lessonAttendance}>Lesson Attendance</Checkbox>
            <Checkbox className={`ml-0 mb-2 font-bold checkbox-${member.activityAttendance[0]}`} defaultChecked={activityAttendance}>Activity Attendance</Checkbox>
            <Checkbox className={`ml-0 mb-2 font-bold checkbox-${member.homeworkDone[0]}`} defaultChecked={homeworkDone}>Homework Done</Checkbox>
            <Checkbox className={`ml-0 mb-2 font-bold checkbox-${member.meetingAttendance[0]}`} defaultChecked={meetingAttendance}>Weekly Meeting</Checkbox>
          </div>
        </Modal>
      </>
    );
}
