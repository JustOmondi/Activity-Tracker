import React from 'react'

export default function InfoCard({icon, title, currentValue, lastweekValue, color}) {
  return (
    <div className='shadow-lg bg-white p-4 w-1/4 rounded-2xl'>
        <div className={`card-icon-container rounded-md absolute -mt-9 icon-bg-${color} p-2`}>
            {icon}
        </div>
        <div className='flex justify-end'>
            <div className='card-title font-bold text-gray-900'>{title}</div>
        </div>
        <div className='flex justify-between mt-3 items-end	'>
            <div className='card-lastweek-value font-light text-slate-500'>Last week: {lastweekValue}</div>
            <div className={`card-current-value text-3xl font-bold value-color-${color}`}>{currentValue}</div>
        </div>
    </div>
  )
}
