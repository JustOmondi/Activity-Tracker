import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Space } from 'antd';
import React from 'react';
import MembersTable from '../components/MembersTable';
import useMembersPage from '../hooks/useMembersPage';

export default function MembersPage() {

    const {
        addMemberModalVisible,
        contextHolder,
        getTableRowSkeleton,
        handleAddMemberClick,
        handleAfterClose,
        handleCancelClick,
        handleNameInputChange,
        handleOkClick,
        handleSubgroupSelectChange,
        hideMessage,
        members,
        reloadTableData,
        showMessage,
        subgroups
    } = useMembersPage()

    return (
        <div>
            {(members.length === 0) && (
                <div className='rounded-2xl bg-white p-4 w-full shadow-lg'>
                    {getTableRowSkeleton()}
                    {getTableRowSkeleton()}
                </div>
            )}
            {(members.length > 0) && (
                <>
                    {contextHolder}
                    <Button
                        className='bg-black text-white shadow-md mb-6 flex items-center mr-3'
                        onClick={handleAddMemberClick}
                        type='primary'
                        size='large'
                        icon={<PlusOutlined />}>
                        Add Member
                    </Button>

                    <Modal
                        title="Add New Member"
                        open={addMemberModalVisible}
                        afterClose={handleAfterClose}
                        onOk={handleOkClick}
                        onCancel={handleCancelClick}
                        footer={[
                            <Button key="ok" className='ok-button' onClick={handleOkClick}>
                                Submit
                            </Button>
                        ]}>
                        <div className='flex items-center mt-8'>
                            <h3 className='mr-3 font-bold'>Name:</h3>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input onChange={handleNameInputChange} />
                            </Space.Compact>
                        </div>

                        <div className='flex items-center mt-8'>
                            <h3 className='mr-3 font-bold'>Subgroup:</h3>
                            <Space.Compact style={{ width: '100%' }}>
                                <Select
                                    allowClear
                                    style={{ width: 120 }}
                                    options={subgroups}
                                    onChange={handleSubgroupSelectChange}
                                />
                            </Space.Compact>
                        </div>
                    </Modal>
                    <MembersTable
                        members={members}
                        subgroups={subgroups}
                        reloadTableData={reloadTableData}
                        showMessage={showMessage}
                        hideMessage={hideMessage}
                    />
                </>
            )}
        </div>
    )
}
