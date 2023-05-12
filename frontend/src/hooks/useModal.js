import { useState } from 'react';

import { BASE_API_URL } from '../Config';

import { useDispatch } from 'react-redux';
import { setMemberUpdated } from '../app/mainSlice';

const useModal = (member, hideModal, showMessage, hideMessage) => {
    const memberNameUnderscore = member.name.toLowerCase().replaceAll(' ', '_')

    const [open, setOpen] = useState(true);
    const [newNameUnderscore, setNewNameUnderscore] = useState(memberNameUnderscore);
    const [currentSubgroup, setMemberSubgroup] = useState(member.subgroup.split(' ')[1]);
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

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

    const handleNameUpdateClick = () => {
        const url = `${BASE_API_URL}/structure/member/update?name=${memberNameUnderscore}&new_name=${newNameUnderscore}`

        setIsLoading(true)
        showMessage('loading', 'Updating member name')

        fetch(url, { method: 'POST' })
            .then(async (response) => {
                hideMessage()

                if (response.status === 200) {
                    const message = 'Name updated successfully'

                    showMessage('success', message)

                    setOpen(false);
                    if (memberNameUnderscore !== newNameUnderscore) {
                        // Update redux store to indicate a member has been updated 
                        dispatch(setMemberUpdated(true))
                    }

                } else {
                    const message = 'Update failed. Please try again'

                    showMessage('error', message)
                }

                setIsLoading(false)
            })
            .catch(error => {
                hideMessage()
                const message = 'Update failed. Please try again'

                setIsLoading(false)
                showMessage('error', message)
            })
    };

    const handleSubgroupUpdateClick = () => {
        const url = `${BASE_API_URL}/structure/member/update?name=${memberNameUnderscore}&new_subgroup=${currentSubgroup}`

        setIsLoading(true)
        showMessage('loading', 'Updating member subgroup')

        fetch(url, { method: 'POST' })
            .then(async (response) => {
                hideMessage()

                console.log(response.status)

                if (response.status === 200) {
                    const message = 'Subgroup updated successfully'

                    showMessage('success', message)

                    if (member.subgroup !== currentSubgroup) {
                        // Update redux store to indicate a member has been updated 
                        dispatch(setMemberUpdated(true))
                    }

                } else {
                    const message = 'Update failed. Please try again'

                    showMessage('error', message)
                }

                setIsLoading(false)
            })
            .catch(error => {
                console.log(error)
                hideMessage()

                const message = 'Update failed. Please try again'

                setIsLoading(false)
                showMessage('error', message)
            })
    };

    const handleRemoveMemberClick = () => {
        const url = `${BASE_API_URL}/structure/member/remove?name=${memberNameUnderscore}&subgroup=${currentSubgroup}`

        setIsLoading(true)
        showMessage('loading', 'Removing member')

        fetch(url, { method: 'POST' })
            .then(async (response) => {
                hideMessage()

                if (response.status === 200) {
                    const message = 'Member removed successfully'

                    showMessage('success', message)

                    setOpen(false);
                    dispatch(setMemberUpdated(true))

                } else {
                    const message = 'Member removal failed. Please try again'

                    showMessage('error', message)
                }

                setIsLoading(false)
            })
            .catch(error => {
                hideMessage()
                const message = 'Member removal failed. Please try again'

                setIsLoading(false)
                showMessage('error', message)
            })
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