import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_API_URL, HTTP_200_OK, getAllReportItems } from '../Config';
import { setMemberUpdated, setMembersList, setSubgroupsList } from '../app/mainSlice';
import useAuth from './useAuth';
import useNotificationMessage from './useNotificationMessage';

const useMembersPage = () => {
    const [members, setMembers] = useState([])
    const [subgroups, setSubgroups] = useState([])
    const [addMemberModalVisible, setAddMemberModalVisible] = useState(false)
    const [newMemberName, setNewMemberName] = useState('')
    const [newMemberSubgroup, setNewMemberSubgroup] = useState('')

    const dispatch = useDispatch()

    const memberUpdated = useSelector((state) => state.memberUpdated.value)
    const storedMembersList = useSelector((state) => state.membersList.value)
    const storedSubgroupsList = useSelector((state) => state.subgroupsList.value)

    const {
        contextHolder,
        hideMessage,
        showMessage
    } = useNotificationMessage()

    const { fetchWithAuthHeader } = useAuth()

    // Get day of the week in ISO format where Monday = 1 .. Sunday = 7
    const currentDay = (new Date()).getDay()

    useEffect(() => {
        getMembers()
        getSubgroups()

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setSubgroups(formattedSubgroups)
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
                thisWeekReports: thisWeekReports,
                lastWeekReports: lastWeekReports
            }

            for (let reportItem of getAllReportItems()) {
                formattedMember[`${reportItem.name}Attendance`] = thisWeekReports[reportItem.name][currentDay]
            }

            formattedMembers.push(formattedMember)
        }

        setMembers(formattedMembers)
        dispatch(setMembersList(formattedMembers))
    }

    const getMembers = async () => {
        if (storedMembersList.length > 0 && !memberUpdated) {
            setMembers(storedMembersList)
            return
        }

        const URL = `${BASE_API_URL}/structure/members`

        try {
            const response = await fetchWithAuthHeader(URL)

            if (response.status === HTTP_200_OK) {
                let data = await response.json();
                formatMembers(data);
            } else {
                showMessage('error', `An error ocurred in fetching members. Please try again (E:${response.status})`)
            }
        } catch (error) {
            showMessage('error', `Network / server error occurred. Please try again (E:${error.name})`)
        }
    }

    const getSubgroups = async () => {
        if (storedSubgroupsList.length > 0) {
            formatSubgroups(storedSubgroupsList);
            return
        }

        const URL = `${BASE_API_URL}/structure/subgroups`

        try {
            const response = await fetchWithAuthHeader(URL);

            if (response.status === HTTP_200_OK) {
                let data = await response.json();

                formatSubgroups(data);
                dispatch(setSubgroupsList(data))
            } else {
                showMessage('error', `An error ocurred in fetching subgroups. Please try again (E:${response.status})`)
            }

        } catch (error) {
            showMessage('error', `Network / server error occurred. Please try again (E:${error.name})`)
        }
    }

    const handleAddMemberClick = () => {
        setAddMemberModalVisible(true)
    }

    const handleCancelClick = () => {
        setAddMemberModalVisible(false)
    }

    const handleAfterClose = () => {
        if (memberUpdated) {
            dispatch(setMemberUpdated(false))
            reloadTableData();
        }
    }

    const addMember = async () => {
        const underscoreName = newMemberName.toLowerCase().replace(' ', '_')

        const URL = `${BASE_API_URL}/structure/member/add?name=${underscoreName}&subgroup=${newMemberSubgroup}`

        showMessage('loading', 'Adding new member')

        try {
            const response = await fetchWithAuthHeader(URL)

            hideMessage()

            if (response.status === HTTP_200_OK) {
                showMessage('success', 'Member added successfully')

                dispatch(setMemberUpdated(true))

                setAddMemberModalVisible(false)

            } else {
                showMessage('error', `Adding new member failed. Please try again (E:${response.status})`)
            }
        } catch (error) {
            hideMessage()

            showMessage('error', `Network / server error occurred. Please try again (E:${error.name})`)
        }
    }

    const handleOkClick = () => {
        if (newMemberName === '' || !newMemberSubgroup) {
            showMessage('error', 'Please check that all fields are filled in')
        } else {
            addMember()
        }
    }

    const handleNameInputChange = ({ target }) => {
        setNewMemberName(target.value)
    }

    const handleSubgroupSelectChange = (value) => {
        setNewMemberSubgroup(value)
    }

    const getTableRowSkeleton = () => {
        return (
            <div className='flex justify-center md:justify-between m-4 flex-wrap'>
                <Skeleton.Input className='mb-2 md:mb-0' active />
                <Skeleton.Input className='mb-2 md:mb-0' active />
                <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
                <Skeleton.Input className='mb-2 md:mb-0 hidden lg:block' active />
            </div>
        )
    }

    return {
        addMemberModalVisible,
        contextHolder,
        getTableRowSkeleton,
        handleAddMemberClick,
        handleAfterClose,
        handleCancelClick,
        handleNameInputChange,
        handleOkClick,
        handleSubgroupSelectChange,
        hideMessage,
        members,
        reloadTableData,
        showMessage,
        subgroups
    }
}

export default useMembersPage