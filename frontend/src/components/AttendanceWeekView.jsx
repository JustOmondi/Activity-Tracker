import React from 'react'
import { Checkbox, Card } from 'antd';

export default function AttendanceWeekView({attendance, reportName, member, color}) {
    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    const classes = 'mr-1 font-bold scale-[1.1]'

    return (
        <div>
            <h3>This week:</h3>
            <Card style={{width: '100%', justifyContent: 'space-evenly'}}>
                {daysOfWeek.map((item, index) => {
                    const dayOfWeek = index + 1
                    const checked = attendance.thisWeek[dayOfWeek]
                    const color = attendance.color

                    return(
                        <Checkbox key={index} className={`${classes} checkbox-${color}`} defaultChecked={checked}>
                            <p className='mt-2'>{item}</p>
                        </Checkbox>
                    )
                })}
            </Card>

            <h3>Last week:</h3>
            <Card style={{width: '100%', justifyContent: 'space-evenly'}}>
                {daysOfWeek.map((item, index) => {
                    const dayOfWeek = index + 1
                    const checked = attendance.lastWeek[dayOfWeek]
                    const color = attendance.color

                    return(
                        <Checkbox key={index} className={`${classes} checkbox-${color}`} disabled defaultChecked={checked}>
                            <p className='mt-2'>{item}</p>
                        </Checkbox>
                    )
                })}
            </Card>
        </div>
    )
}
