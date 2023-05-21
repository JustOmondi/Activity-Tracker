import { Checkbox } from 'antd';
import React, { useState } from 'react';
import { BASE_API_URL, HTTP_200_OK } from '../Config';
import { capitalize } from '../utils';

import { useDispatch } from 'react-redux';
import { setMemberUpdated } from '../app/mainSlice';
import useAuth from '../hooks/useAuth';

export default function CustomCheckbox({ item, isChecked, dayOfWeek, showMessage, hideMessage, classes, reportName, memberName }) {
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(isChecked);

    const dispatch = useDispatch()

    const { fetchWithAuthHeader } = useAuth()

    const currentDay = (new Date()).getDay()

    const updateReportValue = async (newChecked) => {
        const updateValue = newChecked ? 1 : 0

        const URL = `${BASE_API_URL}/reports/update/value?member_name=${memberName}&report_name=${reportName}&value=${updateValue}&day=${dayOfWeek}`

        showMessage('loading', `Updating ${capitalize(reportName)} attendance`)

        setIsLoading(true)

        try {
            const response = await fetchWithAuthHeader(URL)

            if (response.status === HTTP_200_OK) {
                hideMessage()

                const message = `${capitalize(reportName)} attendance updated successfully`

                setChecked(newChecked)
                showMessage('success', message)

                // Update redux store to indicate a member has been updated 
                dispatch(setMemberUpdated(true))

            } else {
                const message = 'Update failed. Please try again'

                setChecked(!newChecked);
                showMessage('error', message)
            }

            setIsLoading(false)

        } catch (error) {
            hideMessage()

            const message = 'Update failed. Please try again'

            setChecked(!newChecked)
            setIsLoading(false)

            showMessage('error', message)
        }
    }

    const handleChange = ({ target }) => {
        return updateReportValue(target.checked);
    }

    return (
        <Checkbox
            className={classes}
            disabled={isLoading || dayOfWeek > currentDay}
            checked={checked}
            defaultChecked={isChecked}
            onChange={handleChange}>
            <p className='mt-2'>{item}</p>
        </Checkbox>
    )
}
