import { Button, Collapse, Input, Modal, Popconfirm, Select, Space } from 'antd'
import React from 'react'
import { getAllReportItems } from '../Config'
import useModal from '../hooks/useModal'
import AttendanceWeekView from './AttendanceWeekView'

export default function MemberModal({ hideModal, member, subgroups, showMessage, hideMessage }) {

  const { Panel } = Collapse

  const {
    open,
    isLoading,
    getAttendance,
    handleAfterClose,
    handleCancel,
    handleNameInputChange,
    handleNameUpdateClick,
    handleRemoveMemberClick,
    handleSubgroupSelectChange,
    handleSubgroupUpdateClick,
    newNameUnderscore
  } = useModal(member, hideModal, showMessage, hideMessage)

  return (
    <>
      <Modal
        title='Edit Member'
        style={{ top: 50 }}
        open={open}
        afterClose={handleAfterClose}
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
                  memberName={newNameUnderscore}
                  key={`panel-item-${index}`} />
              </Panel>
            )
          })}
        </Collapse>
      </Modal>
    </>
  );
}
