
import { Table } from 'antd';
import React from 'react';

import useMembersTable from '../hooks/useMembersTable';
import MemberModal from './MemberModal';

export default function MembersTable({ members, subgroups, reloadTableData, showMessage, hideMessage }) {
  const {
    columns,
    currentMember,
    handleRowClick,
    hideModal,
    modalVisible
  } = useMembersTable(members, subgroups, reloadTableData)

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
