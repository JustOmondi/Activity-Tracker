import { useState } from 'react';

import { BASE_API_URL, HTTP_200_OK } from '../Config';

import { useDispatch } from 'react-redux';
import { setMemberUpdated } from '../app/mainSlice';
import useAuth from './useAuth';

const useModal = (member, hideModal, showMessage, hideMessage) => {
    const memberNameUnderscore = member.name.toLowerCase().replaceAll(' ', '_')

    const [open, setOpen] = useState(true);
    const [newNameUnderscore, setNewNameUnderscore] = useState(memberNameUnderscore);
    const [currentSubgroup, setMemberSubgroup] = useState(member.subgroup.split(' ')[1]);
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const { fetchWithAuthHeader } = useAuth()

    const getAttendance = (reportName, reportColor) => {
        return {
            'thisWeek': member.thisWeekReports[reportName],
            'lastWeek': member.lastWeekReports[reportName],
            'color': reportColor
        }
    }

    const handleNameInputChange = ({ target }) => {
        const name = target.value.toLowerCase().replace(' ', '_')
        setNewNameUnderscore(name)
    }

    const handleSubgroupSelectChange = (value) => {
        setMemberSubgroup(value)
    }

    const handleCancel = () => {
        setOpen(false);
    };

    const handleAfterClose = () => {
        hideModal()
        setOpen(true);
    }

    const handleNameUpdateClick = async () => {
        const URL = `${BASE_API_URL}/structure/member/update?name=${memberNameUnderscore}&new_name=${newNameUnderscore}`

        showMessage('loading', 'Updating member name')
        setIsLoading(true)

        try {
            const response = await fetchWithAuthHeader(URL)

            if (response.status === HTTP_200_OK) {
                hideMessage()
                showMessage('success', 'Name updated successfully')

                setOpen(false);
                if (memberNameUnderscore !== newNameUnderscore) {

                    // Update redux store to indicate a member has been updated 
                    dispatch(setMemberUpdated(true))
                }

            } else {
                showMessage('error', 'Update failed. Please try again')
            }

            setIsLoading(false)

        } catch (error) {
            hideMessage()
            setIsLoading(false)

            showMessage('error', 'Update failed. Please try again')
        }
    };

    const handleSubgroupUpdateClick = async () => {
        const URL = `${BASE_API_URL}/structure/member/update?name=${memberNameUnderscore}&new_subgroup=${currentSubgroup}`

        showMessage('loading', 'Updating member subgroup')
        setIsLoading(true)

        try {
            const response = await fetchWithAuthHeader(URL)

            hideMessage()
            setIsLoading(false)

            if (response.status === HTTP_200_OK) {
                const message = 'Subgroup updated successfully'

                showMessage('success', message)

                if (member.subgroup !== currentSubgroup) {
                    // Update redux store to indicate a member has been updated 
                    dispatch(setMemberUpdated(true))
                }

            } else {
                showMessage('error', 'Update failed. Please try again')
            }
        } catch (error) {
            hideMessage()
            setIsLoading(false)

            showMessage('error', 'Update failed. Please try again')
        }
    };

    const handleRemoveMemberClick = async () => {
        const URL = `${BASE_API_URL}/structure/member/remove?name=${memberNameUnderscore}&subgroup=${currentSubgroup}`

        showMessage('loading', 'Removing member')
        setIsLoading(true)

        try {
            const response = await fetchWithAuthHeader(URL)

            hideMessage()
            setIsLoading(false)

            if (response.status === HTTP_200_OK) {
                const message = 'Member removed successfully'

                showMessage('success', message)

                setOpen(false);
                dispatch(setMemberUpdated(true))

            } else {
                const message = 'Member removal failed. Please try again'

                showMessage('error', message)
            }
        } catch (error) {
            hideMessage()
            setIsLoading(false)

            showMessage('error', 'Member removal failed. Please try again')
        }
    }

    return {
        open,
        isLoading,
        getAttendance,
        handleAfterClose,
        handleCancel,
        handleNameInputChange,
        handleNameUpdateClick,
        handleSubgroupSelectChange,
        handleSubgroupUpdateClick,
        handleRemoveMemberClick,
        newNameUnderscore
    }
}

export default useModal