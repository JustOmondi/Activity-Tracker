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
            const thisWeekReports = data[i]['reports']['this_week']
            const lastWeekReports = data[i]['reports']['last_week']

            // Get day of the week in ISO format where Monday = 1 .. Sunday = 7
            // const currentDay = (new Date()).getDay() + 1

            const currentDay=1
            let formattedMember = {
                key: i,
                name: data[i]['full_name'],
                subgroup: data[i]['subgroup'],
                lessonAttendance: [GREEN, thisWeekReports[currentDay]],
                activityAttendance: [BLUE, thisWeekReports[currentDay]],
                homeworkAttendance: [ORANGE, thisWeekReports[currentDay]],
                meetingAttendance: [PINK, thisWeekReports[currentDay]],
                thisWeekReports: thisWeekReports,
                lastWeekReports: lastWeekReports
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
