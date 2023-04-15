import React, { useState, useEffect } from 'react'
import { BASE_API_URL, BLUE, ORANGE, GREEN, PINK } from '../constants'
import MembersTable from '../components/MembersTable'

export default function MembersListPage() {
    const [members, setMembers] = useState([])
    const [subgroups, setsubgroups] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getMembers()
        getSubgroups()

        setIsLoading(false)
    }, [])

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

    function formatMembers(data) {
        let formattedMembers = []
        for (let i = 0; i < data.length; i++) {
            const reports = data[i]['reports']

            let formattedMember = {
                key: i,
                name: data[i]['full_name'],
                subgroup: data[i]['subgroup'],
                lessonAttendance: [GREEN, reports['lesson_count']],
                activityAttendance: [BLUE, reports['activity_count']],
                homeworkDone: [ORANGE, reports['homework_count']],
                meetingAttendance: [PINK, reports['weekly_meeting_count']],
                reports: reports
            }

            formattedMembers.push(formattedMember)
        }
        setMembers(formattedMembers)
    }

    let getMembers = async () => {
        const URL = `${BASE_API_URL}/structure/members/`
        setIsLoading(true)
        let response = await fetch(URL);
        let data = await response.json();
        
        formatMembers(data);
    }

    let getSubgroups = async () => {
        const URL = `${BASE_API_URL}/structure/subgroups/`
        setIsLoading(true)
        let response = await fetch(URL);
        let data = await response.json();
        formatSubgroups(data);
    }
    
    return (
        <div>
            <MembersTable members={members} subgroups={subgroups} isLoading={isLoading}/>
        </div> 
    )
}
