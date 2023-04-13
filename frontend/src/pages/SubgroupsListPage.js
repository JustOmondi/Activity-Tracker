import React, { useState, useEffect } from 'react'
import { BASE_API_URL } from '../constants'

export default function SubgroupsListPage() {
    const [subgroups, setSubgroups] = useState([])

    useEffect(() => {
      getSubgroups()
    }, [])

    let getSubgroups = async () => {
        const URL = `${BASE_API_URL}/structure/subgroups/`

        let response = await fetch(URL);
        let data = await response.json();
        console.dir(data)
        setSubgroups(data)
    }
    
    return (
        <div>
            <p>SubgroupsPage</p>
            {subgroups.map((subgroup, index) => (
                <h3 key={index}>{subgroup.name}, {subgroup.total_members}</h3>
            ))}
        </div>
        
    )
}
