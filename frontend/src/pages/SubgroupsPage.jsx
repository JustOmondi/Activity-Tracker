import { Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { BASE_API_URL } from '../Config'
import SubgroupCard from '../components/SubgroupCard'
import useAuth from '../hooks/useAuth'

export default function SubgroupsPage() {
    const [subgroups, setSubgroups] = useState([])

    const { fetchWithAuthHeader } = useAuth()

    useEffect(() => {
        getSubgroups()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let getSubgroups = async () => {
        const URL = `${BASE_API_URL}/structure/subgroups`

        const response = await fetchWithAuthHeader(URL);
        const data = await response.json();
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
                <SubgroupCard key={index} name={subgroup.name} totalMembers={subgroup.total_members} totals={subgroup.report_totals} />
            ))}
        </div>

    )
}
