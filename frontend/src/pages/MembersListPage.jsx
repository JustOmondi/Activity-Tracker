import React, { useState, useEffect } from 'react'
import { BASE_API_URL, BLUE, ORANGE, GREEN, PINK, LESSON, ACTIVITY, HOMEWORK, WEEKLY_MEETING } from '../constants'
import { Skeleton} from 'antd';
import MembersTable from '../components/MembersTable'

export default function MembersListPage() {
    const [members, setMembers] = useState([])
    const [subgroups, setsubgroups] = useState([])

    // Get day of the week in ISO format where Monday = 1 .. Sunday = 7
    const currentDay = (new Date()).getDay() + 1

    useEffect(() => {
        getMembers()
        getSubgroups()
    }, [])

    const reloadTableData = async () => {
        setMembers([])
        getMembers()
        getSubgroups()   
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
        const URL = `${BASE_API_URL}/structure/members/`

        let response = await fetch(URL);
        let data = await response.json();
        
        formatMembers(data);
    }

    const getSubgroups = async () => {
        const URL = `${BASE_API_URL}/structure/subgroups/`

        let response = await fetch(URL);
        let data = await response.json();
        
        formatSubgroups(data);
    }
    
    return (
        <div>
            {(members.length === 0) && (
                <div className='rounded-2xl bg-white p-4 w-full'>
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
            {(members.length > 0) && <MembersTable members={members} subgroups={subgroups} reloadTableData={reloadTableData}/>}
        </div> 
    )
}
