import React, { useContext } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import ThemeContext from '../../context/ThemeContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import './TaskStats.css';

// ... (ChartJS.register and all your data/options logic remains the same)
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const TaskStats = ({ tasks }) => {
  const { theme } = useContext(ThemeContext);

  const textColor = theme === 'light' ? '#333' : '#f4f4f4';
  const tickColor = theme === 'light' ? '#777' : '#aaa';
  const gridColor = theme ==='light' ? '#e0e0e0' : '#444';

  // --- (Data calculation logic is unchanged) ---
  const categoryCounts = tasks.reduce((acc, task) => {
    const category = task.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, { Low: 0, Medium: 0, High: 0 });

  // --- (Chart data objects are unchanged) ---
  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [{
      label: '# of Tasks',
      data: Object.values(categoryCounts),
      backgroundColor: ['rgba(0, 119, 204, 0.7)', 'rgba(0, 168, 107, 0.7)', 'rgba(255, 122, 0, 0.7)', 'rgba(255, 193, 7, 0.7)', 'rgba(153, 102, 255, 0.7)'],
      borderColor: ['rgba(0, 119, 204, 1)', 'rgba(0, 168, 107, 1)', 'rgba(255, 122, 0, 1)', 'rgba(255, 193, 7, 1)', 'rgba(153, 102, 255, 1)'],
      borderWidth: 1,
    }],
  };
  const priorityData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      label: 'Tasks by Priority',
      data: [priorityCounts.Low, priorityCounts.Medium, priorityCounts.High],
      backgroundColor: ['rgba(0, 168, 107, 0.7)', 'rgba(255, 193, 7, 0.7)', 'rgba(255, 122, 0, 0.7)'],
      borderColor: ['rgba(0, 168, 107, 1)', 'rgba(255, 193, 7, 1)', 'rgba(255, 122, 0, 1)'],
      borderWidth: 1,
    }],
  };

  // --- (Chart options are unchanged) ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: textColor } },
      title: { display: true, text: 'Tasks by Category', color: textColor },
    },
  };
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Tasks by Priority', color: textColor },
    },
    scales: {
      y: { ticks: { color: tickColor }, grid: { color: gridColor } },
      x: { ticks: { color: tickColor }, grid: { color: gridColor } }
    }
  };

  return (
    <div className="charts-container">
      {/* This is the card background */}
      <div className="chart-wrapper">
        {/* THIS IS THE NEW WRAPPER */}
        <div className="chart-inner-wrapper">
          <Pie data={categoryData} options={chartOptions} />
        </div>
      </div>
      
      {/* This is the card background */}
      <div className="chart-wrapper">
        {/* THIS IS THE NEW WRAPPER */}
        <div className="chart-inner-wrapper">
          <Bar data={priorityData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default TaskStats;