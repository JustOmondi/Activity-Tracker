import { CaretRightOutlined, ClockCircleFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { LAST_WEEK, THIS_WEEK, getAllReportItems } from '../Config';

export default function SubgroupCard({ name, totalMembers, totals }) {

    const titleClasses = 'font-medium text-gray-900'
    const summaryClasses = 'text-gray-500 flex items-center font-bold'
    const iconContainerClasses = 'card-icon-container rounded-md p-2 mr-4'
    const lineItemClasses = 'flex items-center mb-6'

    const calculateAverage = (value) => {
        return ((value / totalMembers) * 100).toFixed(0)
    }

    return (
        <div className='subgroup-card shadow-lg bg-white mt-8 mx-6 mb-10 rounded-3xl flex flex-col items-center w-1/3 xl:w-2/5 flex-wrap'>
            <div className='w-2/3 flex justify-center items-center -mt-8 bg-black rounded-2xl p-4 shadow-black-500/50 shadow-2xl'>
                <h2 className='text-lg text-white font-bold'>{name}</h2>
            </div>
            <div className='mt-5 p-5'>
                {getAllReportItems().map((reportItem, index) => {
                    return (
                        <div key={index} className={lineItemClasses}>
                            <div className={`${iconContainerClasses} icon-bg-${reportItem.color}`}>
                                {reportItem.icon}
                            </div>
                            <div>
                                <div className={titleClasses}>{reportItem.title}</div>
                                <div className={summaryClasses}>
                                    <Tooltip className='flex items-center' title="This Week">
                                        <CaretRightOutlined />
                                        <div className={`value-color-${reportItem.color} mr-5 ml-1`}>{calculateAverage(totals[reportItem.name][THIS_WEEK])}%</div>
                                    </Tooltip>
                                    <Tooltip className='flex items-center' title="Last Week">
                                        <ClockCircleFilled />
                                        <div className='text-gray-500 ml-2'>{calculateAverage(totals[reportItem.name][LAST_WEEK])}%</div>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='bg-gray-100 px-4 py-4 w-full flex justify-center mt-3 rounded-bl-3xl rounded-b-3xl'>
                <p className='text-black font-light'>Total Members: {totalMembers}</p>
            </div>
        </div>
    )
}