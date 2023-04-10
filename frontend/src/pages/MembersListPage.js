import React, { useState, useEffect } from 'react'
import { BASE_API_URL } from '../App'

export default function MembersListPage() {
    const [memebrs, setMembers] = useState([])

    useEffect(() => {
        getMembers()
    }, [])

    let getMembers = async () => {
        const URL = `${BASE_API_URL}/structure/members/`

        let response = await fetch(URL);
        let data = await response.json();
        setMembers(data)
    }
    

    return (
        <div>
            <p>Members</p>
            {memebrs.map((member, index) => (
                <h3 key={index}>{member.full_name}</h3>
            ))}
        </div>
        
    )
}
