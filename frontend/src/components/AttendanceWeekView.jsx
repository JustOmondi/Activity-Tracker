import { Card, Checkbox } from 'antd';
import React from 'react';
import CustomCheckbox from './CustomCheckbox';

export default function AttendanceWeekView({ attendance, reportName, memberName, hideMessage, showMessage }) {
    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    const checkboxClasses = 'mr-1 font-bold scale-[1.3]'

    return (
        <div>
            <h3>This week:</h3>
            <Card style={{ width: '100%', justifyContent: 'space-evenly' }}>
                {daysOfWeek.map((item, index) => {
                    const dayOfWeek = index + 1
                    const checked = attendance.thisWeek[dayOfWeek]
                    const color = attendance.color

                    return (
                        <CustomCheckbox
                            key={index}
                            isChecked={checked}
                            item={item}
                            dayOfWeek={dayOfWeek}
                            classes={`${checkboxClasses} checkbox-${color}`}
                            memberName={memberName}
                            reportName={reportName}
                            showMessage={showMessage}
                            hideMessage={hideMessage}>
                        </CustomCheckbox>
                    )
                })}
            </Card>

            <h3>Last week:</h3>
            <Card style={{ width: '100%', justifyContent: 'space-evenly' }}>
                {daysOfWeek.map((item, index) => {
                    const dayOfWeek = index + 1
                    const checked = attendance.lastWeek[dayOfWeek]
                    const color = attendance.color

                    return (
                        <Checkbox
                            key={index}
                            className={`${checkboxClasses} checkbox-${color}`}
                            disabled
                            defaultChecked={checked}>
                            <p className='mt-2'>{item}</p>
                        </Checkbox>
                    )
                })}
            </Card>
        </div>
    )
}
