import React, { useState, useEffect } from 'react'
import { BASE_API_URL } from '../App'
import MembersTable from '../components/MembersTable'

export default function MembersListPage() {
    const [members, setMembers] = useState([])

    useEffect(() => {
        getMembers()
    }, [])

    function formatMembers(data) {
        let formattedMembers = []
        for (let i = 0; i < data.length; i++) {
            let formattedMember = {
                key: i,
                name: data[i]['full_name'],
                subgroup: data[i]['subgroup'],
                lastweekAttended: true ? data[i]['reports']['lastweek_lesson_count'] === '1' :  false,
                attended: true ? data[i]['reports']['lesson_count'] === '1' : false,
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
