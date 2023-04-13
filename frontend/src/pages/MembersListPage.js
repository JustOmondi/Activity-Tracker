import React, { useState, useEffect } from 'react'
import { BASE_API_URL, BLUE, ORANGE, GREEN, PINK } from '../constants'
import MembersTable from '../components/MembersTable'

export default function MembersListPage() {
    const [members, setMembers] = useState([])

    useEffect(() => {
        getMembers()
    }, [])

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
            }

            formattedMembers.push(formattedMember)
        }
        setMembers(formattedMembers)

        console.dir(formattedMembers);
    }

    let getMembers = async () => {
        const URL = `${BASE_API_URL}/structure/members/`

        let response = await fetch(URL);
        let data = await response.json();
        formatMembers(data);
    }
    

    return (
        <div>
            <MembersTable members={members}/>
        </div> 
    )
}
