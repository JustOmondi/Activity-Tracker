import React from 'react'
import {Link} from "react-router-dom";

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


export default function ReportGraphTile({icon, title, graphData, color, link}) {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const config = {
    labels,
    datasets: [
      {
        label: 'Last week',
        data: graphData['last_week'],
        backgroundColor: '#ffffff70',
      },
      {
        label: 'This week',
        data: graphData['this_week'],
        backgroundColor: '#fff',
      },
    ],
  };

  const options = {
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

  return (
    <Link className='graph-card mb-14 xl:mb-1' to={link}>
      <div className='shadow-lg bg-white p-4 mt-8 mx-2 rounded-2xl'> 
        <div className='flex justify-center -mt-16'>
            <div className={`graph-container relative w-full p-3 rounded-2xl graph-bg-${color}`}>
              <Bar options={options} data={config} />
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
    </Link>
    
  )
}
