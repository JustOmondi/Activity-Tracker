import React from 'react'
import { Checkbox, Card } from 'antd';

export default function AttendanceWeekView({attendanceList, reportName, member}) {
  return (
    <div>
        <h3>This week:</h3>
        <Card style={{display: 'flex'}}>
            {attendanceList.map((item) => {
            const {thisWeekChecked, color, day} = item
            const classes = `ml-2 mb-2 font-bold checkbox-${color}`

            return(
                <Checkbox className={classes} defaultChecked={thisWeekChecked}>{day}</Checkbox>
            )
            })}
        </Card>

        <h3>Last week:</h3>
        <Card style={{display: 'flex'}}>
        {attendanceList.map((item) => {
            const {lastWeekChecked, day} = item
            const classes = 'ml-2 mb-2 font-bold'

            return(
                <Checkbox className={classes} checked={lastWeekChecked}>{day}</Checkbox>
            )
            })}
        </Card>
        </div>
  )
}
