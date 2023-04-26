import React, {useState}from 'react'
import { Checkbox } from 'antd';
import { BASE_API_URL } from '../constants'
import { capitalize } from '../utils';

import { setMemberUpdated } from '../app/mainSlice';
import { useDispatch } from 'react-redux'

export default function CustomCheckbox({item, isChecked, dayOfWeek, showMessage, hideMessage, classes, reportName, memberName }) {
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(isChecked);

    const dispatch = useDispatch()

    const currentDay = (new Date()).getDay()

    const updateReportValue = (newChecked) => {
        const updateValue = newChecked ? 1 : 0

        const url = `${BASE_API_URL}/reports/update/value?member_name=${memberName}&report_name=${reportName}&value=${updateValue}&day=${dayOfWeek}`

        showMessage('loading', `Updating ${capitalize(reportName)} attendance`)

        setIsLoading(true)

        fetch(url, {method: 'POST'})
        .then(async (response) => {
            hideMessage()

            if (response.status === 200) {
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
        })
        .catch(error => {
            hideMessage()

            const message = 'Update failed. Please try again'

            setChecked(!newChecked)
            setIsLoading(false)

            showMessage('error', message)
        })
    }

    const handleChange = ({target}) => {
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
