import React, { useState, useEffect } from 'react'
import { BASE_API_URL } from '../constants'
import SubgroupCard from '../components/SubgroupCard'
import { Skeleton  } from 'antd'

export default function SubgroupsPage() {
    const [subgroups, setSubgroups] = useState([])

    useEffect(() => {
      getSubgroups()
    }, [])

    let getSubgroups = async () => {
        const URL = `${BASE_API_URL}/structure/subgroups`

        let response = await fetch(URL);
        let data = await response.json();
        setSubgroups(data)
    }
    
    return (
        <div className='flex flex-wrap justify-center'>
            {subgroups.length === 0 && (
                <div className='subgroup-card shadow-lg bg-white p-6 mt-8 mx-6 rounded-3xl w-1/3 xl:w-2/5'>
                    <Skeleton active paragraph={{ rows: 4 }} />
                </div>
            )}    
            
            {subgroups.length !== 0 && subgroups.map((subgroup, index) => (
                <SubgroupCard key={index} name={subgroup.name} totalMembers={subgroup.total_members} totals={subgroup.report_totals}/>
            ))}
        </div>
        
    )
}
