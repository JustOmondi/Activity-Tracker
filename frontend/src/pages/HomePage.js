import React from 'react'
import InfoCard from '../components/InfoCard'
import { ArrowLeftOnRectangleIcon, ChartBarIcon, HomeIcon, ListBulletIcon, UsersIcon } from '@heroicons/react/24/outline'
import GraphCard from '../components/GraphCard'

export default function HomePage() {

  // icon = <FontAwesomeIcon icon={icon({name: 'coffee', family: 'sharp', style: 'solid'})} />

  return (
    <div>
      {/* <InfoCard 
        icon={<ChartBarIcon className='h-8 w-8 text-white'/>}
        title={'Lesson Attendance'}
        currentValue={10}
        lastweekValue={5}
        color={'green'}
      /> */}
      <GraphCard
        color={'green'}
        icon={<ChartBarIcon className='h-8 w-8 text-white'/>} 
        title={'Lesson Attendance'} />
    </div>
  )
}
