import React from 'react'
import InfoCard from '../components/InfoCard'
import { BuildingOfficeIcon, UsersIcon, BoltIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import GraphCard from '../components/GraphCard'

export default function HomePage() {

  return (
    <div className='w-full'>
      <div className='highlights flex justify-evenly flex-wrap mt-3'>
        <InfoCard 
          icon={<BuildingOfficeIcon fill='#fff' className='h-8 w-8 text-white'/>}
          title={'Lesson Attendance'}
          currentValue={10}
          lastweekValue={5}
          color={'green'}
        />

        <InfoCard 
          icon={<BookOpenIcon fill='#fff' className='h-8 w-8 text-white'/>}
          title={'Homework Done'}
          currentValue={10}
          lastweekValue={5}
          color={'orange'}
        />

        <InfoCard 
          icon={<BoltIcon fill='#fff' className='h-8 w-8 text-white'/>}
          title={'Activity Attendance'}
          currentValue={10}
          lastweekValue={5}
          color={'blue'}
        />

        <InfoCard 
          icon={<UsersIcon fill='#fff' className='h-8 w-8 text-white'/>}
          title={'Weekly Meeting'}
          currentValue={10}
          lastweekValue={5}
          color={'pink'}
        />
      </div>
      <div className='graphs flex w-full justify-evenly flex-wrap mt-14 space-around'>
        <GraphCard
          color={'blue'}
          icon={<BoltIcon fill='#fff' className='h-8 w-8 text-white'/>} 
          title={'Activity Attendance'} 
        />

        <GraphCard
          color={'green'}
          icon={<BuildingOfficeIcon fill='#fff' className='h-8 w-8 text-white'/>} 
          title={'Lesson Attendance'} 
        />

        <GraphCard
          color={'orange'}
          icon={<BookOpenIcon fill='#fff' className='h-8 w-8 text-white'/>} 
          title={'Homework Done'} 
        />
      </div>
    </div>
  )
}
