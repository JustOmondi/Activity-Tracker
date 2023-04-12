import React, { useState } from 'react'
import { Divider, Form, Radio, Skeleton, Space, Switch } from 'antd';

export default function InfoCard({icon, title, currentValue, lastweekValue, color}) {

  const [loading, setLoading] = useState(false);

  return (
    <div className='info-card shadow-lg bg-white p-3 m-1 rounded-2xl relative'>
        <div className={`card-icon-container rounded-md absolute -mt-6 icon-bg-${color} p-2`}>
            {icon}
        </div>
        <div className='flex justify-end'>
            <div className='card-title font-bold text-gray-900'>{title}</div>
        </div>
        <div>
            {loading &&  (
              <div className='flex w-full justify-between'>
                <Skeleton.Input active />
                <div><Skeleton.Avatar shape={'square'} size={'medium'} active /></div>
              </div>
            )}
            {!loading && (
              <div className='flex justify-between mt-3 items-end	'>
                <div className='card-lastweek-value font-light text-slate-500'>Last week: {lastweekValue}</div>
                <div className={`card-current-value text-3xl font-bold value-color-${color}`}>{currentValue}</div>
              </div>
            )}
            
        </div>
    </div>
  )
}
