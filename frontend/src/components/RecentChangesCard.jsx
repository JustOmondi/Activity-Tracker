import React from 'react'
import { Collapse, Timeline  } from 'antd'
import { capitalize } from '../utils'
import { CloseCircleFilled, InfoCircleFilled, PlusCircleFilled } from '@ant-design/icons';

export default function RecentChangesCard({changes, title}) {

    const { Panel } = Collapse;

    const formatChanges = (item) => {
        const memberName = item['member_name']
        let reportName = item['report_name'] ? capitalize(item['report_name']) : ''
        let reportDate = item['report_date'] ? item['report_date'] : ''

        const action = item['changes'][0]['action']
        let itemUpdated = item['changes'][0]['item'].replace('_', ' ')
        const previousValue = item['changes'][0]['previous_value']
        const newValue = item['changes'][0]['new_value']

        if(itemUpdated === 'value') {
            itemUpdated = 'Attendance'
        }

        let color = 'blue'
        let dot = <InfoCircleFilled />
        let message = (<div className='text-slate-500'>
            <span className=''>{memberName}</span>: <span className='font-bold'>{reportName} {itemUpdated}</span> <span className=''>{action}</span> from <span className='text-black'>{previousValue}</span> to <span className='text-black'>{newValue}</span>
        </div>)

        if(action === 'added') {
            color = 'green'
            dot = <PlusCircleFilled />

            message = (<div className='text-slate-500'><span className=''>{memberName}</span>: Added</div>)

            if(reportName) {
                message = (<div className='text-slate-500'><span className=''>{memberName}</span>: <span className='font-bold'>{reportName} Attendance</span> added for <span className='text-black'>{reportDate}</span></div>)
            } 
        }

        if(action === 'removed') {
            color = 'red'
            dot = <CloseCircleFilled />
            message = (<div className='text-slate-500'><span className=''>{memberName}</span>: Removed</div>)
        }

        return {
            color: color,
            dot: dot,
            children: message,
        }
    }

  return (
    <Collapse accordion>
        <Panel header={<h2 className='font-bold text-md'>{title}</h2>}>
            <Timeline items={changes.map(formatChanges)} />
        </Panel>
    </Collapse>
  )
}
