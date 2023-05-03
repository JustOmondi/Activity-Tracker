import React, { useState, useEffect } from 'react'
import { BASE_API_URL, BLUE, ORANGE, GREEN, PINK, LESSON, ACTIVITY, HOMEWORK, WEEKLY_MEETING } from '../constants'
import { Button, Input, Modal, Select, Space, message, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MembersTable from '../components/MembersTable'

import { setMemberUpdated } from '../app/mainSlice';
import { useDispatch, useSelector } from 'react-redux'

export default function MembersListPage() {
    const [members, setMembers] = useState([])
    const [subgroups, setsubgroups] = useState([])
    const [addMemberModalVisible, setAddMemberModalVisible] = useState(false)
    const [newMemberName, setNewMemberName] = useState('')
    const [newMemberSubgroup, setNewMemberSubgroup] = useState('')

    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch()
    const memberUpdated = useSelector((state) => state.memberUpdated.value)

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

    // Get day of the week in ISO format where Monday = 1 .. Sunday = 7
    const currentDay = (new Date()).getDay()

    useEffect(() => {
        getMembers()
        getSubgroups()
    }, [])

    const reloadTableData = async () => {
        // Delay reload for 3 seconds to allow any notifications to show

        setTimeout(() => {
            setMembers([])
            getMembers()
            getSubgroups()   
          }, 2000);
    }

    const formatSubgroups = (data) => {
        let formattedSubgroups = []

        for (let i = 0; i < data.length; i++) {
            const name = data[i]['name']
            const value = name.split(" ")[1]

            let formattedSubgroup = { value: value, label: name }

            formattedSubgroups.push(formattedSubgroup)
        }
        setsubgroups(formattedSubgroups)
    }

    const formatMembers = (data) => {
        let formattedMembers = []

        for (let i = 0; i < data.length; i++) {
            const thisWeekReports = data[i]['reports']['this_week']
            const lastWeekReports = data[i]['reports']['last_week']

            let formattedMember = {
                key: i,
                name: data[i]['full_name'],
                subgroup: data[i]['subgroup'],
                lessonAttendance: [GREEN, thisWeekReports[LESSON][currentDay]],
                activityAttendance: [BLUE, thisWeekReports[ACTIVITY][currentDay]],
                homeworkAttendance: [ORANGE, thisWeekReports[HOMEWORK][currentDay]],
                meetingAttendance: [PINK, thisWeekReports[WEEKLY_MEETING][currentDay]],
                thisWeekReports: thisWeekReports,
                lastWeekReports: lastWeekReports
            }

            formattedMembers.push(formattedMember)
        }
        
        setMembers(formattedMembers)
    }

    const getMembers = async () => {
        const URL = `${BASE_API_URL}/structure/members`

        let response = await fetch(URL);
        let data = await response.json();
        formatMembers(data);
    }

    const getSubgroups = async () => {
        const URL = `${BASE_API_URL}/structure/subgroups`

        let response = await fetch(URL);
        let data = await response.json();
        
        formatSubgroups(data);
    }

    const handleAddMemberClick = () => {
        setAddMemberModalVisible(true)
    }

    const handleCancelClick = () => {
        setAddMemberModalVisible(false)
    }

    const handleAfterClose = () => {
        if(memberUpdated) {
            dispatch(setMemberUpdated(false))
            reloadTableData();
        }
    }

    const handleOkClick = () => {
        if(newMemberName === '' || !newMemberSubgroup) {
            showMessage('error', 'Please check that all fields are filled in')
        } else {
            const underscoreName = newMemberName.toLowerCase().replace(' ', '_')

            const url = `${BASE_API_URL}/structure/member/add?name=${underscoreName}&subgroup=${newMemberSubgroup}`

            showMessage('loading', 'Adding new member')

            fetch(url, {method: 'POST'})
            .then(async (response) => {
                hideMessage()

                if (response.status === 200) {
                    const message = 'Member added successfully'

                    showMessage('success', message)

                    dispatch(setMemberUpdated(true))
                
                } else {
                    const message = 'Adding new member failed. Please try again'

                    showMessage('error', message)
                }
                
                setAddMemberModalVisible(false)
            })
        }
    }

    const handleNameInputChange = ({target}) => {
        setNewMemberName(target.value)
    }

    const handleSubgroupSelectChange = (value) => {
        setNewMemberSubgroup(value)
    }
    
    return (
        <div>
            {(members.length === 0) && (
                <div className='rounded-2xl bg-white p-4 w-full shadow-lg'>
                    <div className='flex justify-between m-4 flex-wrap'>
                        <Skeleton.Input className='mb-2 md:mb-0' active />
                        <Skeleton.Input className='mb-2 md:mb-0' active />
                        <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                        <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                        <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                        <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                    </div>
                    <div className='flex justify-between m-4 flex-wrap'>
                        <Skeleton.Input className='mb-2 md:mb-0' active />
                        <Skeleton.Input className='mb-2 md:mb-0' active />
                        <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                        <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                        <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                        <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                    </div>
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
                                <Input onChange={handleNameInputChange}/>
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
                    <MembersTable members={members} subgroups={subgroups} reloadTableData={reloadTableData} showMessage={showMessage} hideMessage={hideMessage} />
                </>
                
            )}
        </div> 
    )
}
