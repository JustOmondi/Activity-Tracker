import React from 'react'
import { Checkbox, Card } from 'antd';

export default function AttendanceWeekView({attendance, reportName, member, color}) {
    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

    return (
        <div>
            <h3>This week:</h3>
            <Card style={{display: 'flex'}}>
                {daysOfWeek.map((item, index) => {
                    const dayOfWeek = index + 1
                    const checked = attendance.thisWeek[dayOfWeek]
                    const color = attendance.color
                    const classes = `ml-2 mb-2 font-bold checkbox-${color}`

                    return(
                        <Checkbox key={index} className={classes} defaultChecked={checked}>{item}</Checkbox>
                    )
                })}
            </Card>

            <h3>Last week:</h3>
            <Card style={{display: 'flex'}}>
                {daysOfWeek.map((item, index) => {
                    const dayOfWeek = index + 1
                    const checked = attendance.lastWeek[dayOfWeek]
                    const color = attendance.color
                    const classes = `ml-2 mb-2 font-bold checkbox-${color}`

                    return(
                        <Checkbox key={index} className={classes} disabled defaultChecked={checked}>{item}</Checkbox>
                    )
                })}
            </Card>
        </div>
    )
}
