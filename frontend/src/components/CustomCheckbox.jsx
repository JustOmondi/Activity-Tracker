import React, {useState}from 'react'
import { Checkbox } from 'antd';
import { BASE_API_URL } from '../constants'
import { capitalize } from '../utils';

export default function CustomCheckbox({item, isChecked, showMessage, hideMessage, classes, reportName, member}) {
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(isChecked);

    const updateReportValue = (newChecked) => {
        const updateValue = newChecked ? 1 : 0
        const member_underscore_name = member.toLowerCase().replace(' ', '_')

        const url = `${BASE_API_URL}/reports/update-report-value?member_name=${member_underscore_name}&report_name=${reportName}&update_value=${updateValue}`

        showMessage('loading', `Updating ${capitalize(reportName)} attendance`)

        setIsLoading(true)

        fetch(url, {method: 'POST'})
        .then(response => {
            hideMessage()

            if (response.status == '200') {
                const message = `${capitalize(reportName)} attendance updated successfully`

                setChecked(newChecked)
                showMessage('success', message)

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
            disabled={isLoading}
            checked={checked}
            defaultChecked={isChecked}
            onChange={handleChange}>
                <p className='mt-2'>{item}</p>
        </Checkbox>
    )
}
