import React from 'react'
import { BuildingOfficeIcon, UsersIcon, BoltIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import {CaretRightOutlined, ClockCircleFilled} from '@ant-design/icons';

export default function SubgroupCard({name, totalMembers, totals}) {

    const titleClasses = 'font-medium text-gray-900'
    const summaryClasses= 'text-gray-500 flex items-center font-bold'
    const iconContainerClasses = 'card-icon-container rounded-md p-2 mr-4'
    const iconClasses = 'h-8 w-8 text-white'
    const lineItemClasses = 'flex items-center mb-6'

  return (
    <div className='subgroup-card shadow-lg bg-white mt-8 mx-6 mb-10 rounded-3xl flex flex-col items-center w-1/3 xl:w-2/5 flex-wrap'> 
        <div className='w-2/3 flex justify-center items-center -mt-8 bg-black rounded-2xl p-4 shadow-black-500/50 shadow-2xl'>
            <h2 className='text-lg text-white font-bold'>{name}</h2>
        </div>
        <div className='mt-5 p-5'>
            <div className={lineItemClasses}>
                <div className={`${iconContainerClasses} icon-bg-green`}>
                    <BuildingOfficeIcon fill='#fff' className={iconClasses}/>
                </div>
                <div>
                    <div className={titleClasses}>Lesson Attendance</div>
                    <div className={summaryClasses}>
                        <CaretRightOutlined /> <span className='value-color-green mr-5 ml-1'>3</span> <ClockCircleFilled /> <span className='text-gray-500 ml-1'>3</span>
                    </div>
                </div>
            </div>
            <div className={lineItemClasses}>
                <div className={`${iconContainerClasses} icon-bg-blue`}>
                    <BoltIcon fill='#fff' className={iconClasses}/>
                </div>
                <div>
                    <div className={titleClasses}>Activity Attendance</div>
                    <div className={summaryClasses}>
                        <CaretRightOutlined /> <span className='value-color-blue mr-5 ml-1'>3</span> <ClockCircleFilled /> <span className='text-gray-500 ml-1'>3</span>
                    </div>
                </div>
            </div>
            <div className={lineItemClasses}>
                <div className={`${iconContainerClasses} icon-bg-pink`}>
                    <UsersIcon fill='#fff' className={iconClasses}/>
                </div>
                <div>
                    <div className={titleClasses}>Weekly Meeting Attendance</div>
                    <div className={summaryClasses}>
                        <CaretRightOutlined /> <span className='value-color-pink mr-5 ml-1'>3</span> <ClockCircleFilled /> <span className='text-gray-500 ml-1'>3</span>
                    </div>
                </div>
            </div>
            <div className={lineItemClasses}>
                <div className={`${iconContainerClasses} icon-bg-orange`}>
                    <BookOpenIcon fill='#fff' className={iconClasses}/>
                </div>
                <div>
                    <div className={titleClasses}>Homework Done</div>
                    <div className={summaryClasses}>
                        <CaretRightOutlined /> <span className='value-color-orange mr-5 ml-1'>3</span> <ClockCircleFilled /> <span className='text-gray-500 ml-1'>3</span>
                    </div>
                </div>
            </div>
        </div>
        <div className='bg-gray-100 px-4 py-4 w-full flex justify-center mt-3 rounded-bl-3xl rounded-b-3xl'>
            <p className='text-black font-light'>Total Members: {totalMembers}</p>
        </div>
    </div>
  )
}
