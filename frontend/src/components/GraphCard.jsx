import React from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
);

export const options = {
  responsive: true,
  barThickness: '8',
  color: '#fff',
  plugins: {
    legend: {
      display: false,
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#fff'
      },
      grid: {
        display: false,
      }
    },
    y: {
      min: 0,
      max: 10,
      ticks: {
        color: '#fff',
        stepSize: 2,
      },
      grid: {
        borderDash: 8,
        color: '#ffffff20',

      }
    }
  }
};

const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Last week',
      data: [4, 6, 10, 3, 6, 9, 10],
      backgroundColor: '#ffffff70',
    },
    {
      label: 'This week',
      data: [4, 6, 10, 3, 6, 9, 10].reverse(),
      backgroundColor: '#fff',
    },
  ],
};

export default function GraphCard({icon, title, currentValue, lastweekValue, color}) {
  return (
    <div className='graph-card shadow-lg bg-white p-4 mb-8 mt-8 mx-2 rounded-2xl'>
        <div className='flex justify-center -mt-16'>
            <div className={`graph-container relative w-full p-3 rounded-2xl graph-bg-${color}`}>
              <Bar options={options} data={data} />
            </div>
        </div>
        <div className='flex justify-left mt-5'>
            <div className={`card-icon-container rounded-md icon-bg-${color} p-2 mr-4`}>
                {icon}
            </div>
            <div>
                <div className='card-title font-bold text-gray-900'>{title}</div>
                <div className='card-title font-light text-slate-500'>Last 7 days</div>
            </div>
        </div>
    </div>
  )
}
