import { Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_API_URL, HTTP_200_OK } from '../Config'
import { setSubgroupsList } from '../app/mainSlice'
import SubgroupCard from '../components/SubgroupCard'
import useAuth from '../hooks/useAuth'
import useNotificationMessage from '../hooks/useNotificationMessage'

export default function SubgroupsPage() {
    const [subgroups, setSubgroups] = useState([])

    const {
        contextHolder,
        showMessage
    } = useNotificationMessage()

    const { fetchWithAuthHeader } = useAuth()

    const dispatch = useDispatch()
    const storedSubgroupsList = useSelector((state) => state.subgroupsList.value)

    useEffect(() => {
        getSubgroups()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let getSubgroups = async () => {
        if (storedSubgroupsList.length > 0) {
            setSubgroups(storedSubgroupsList)
            return
        }

        const URL = `${BASE_API_URL}/structure/subgroups`

        try {
            const response = await fetchWithAuthHeader(URL);

            if (response.status === HTTP_200_OK) {
                const data = await response.json();
                setSubgroups(data)
                dispatch(setSubgroupsList(data))
            } else {
                showMessage('error', `An error ocurred in fetching subgroups. Please try again (E:${response.status})`)
            }
        } catch (error) {
            showMessage('error', `Network / server error occurred. Please try again (E:${error.name})`)
        }
    }

    return (
        <div className='flex flex-wrap justify-center'>
            {contextHolder}
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
