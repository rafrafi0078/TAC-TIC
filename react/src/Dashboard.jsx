import { ProCard, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register the components with ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);
const { Statistic } = StatisticCard;
const imgStyle = {
    display: 'block',
    width: 42,
    height: 42,
  };

export default function Dashboard() {
 
    const [loading, setLoading] = useState(false);
    const [responsive, setResponsive] = useState(false);
    const [tasksDone, setTasksDone] = useState(0);
    const [tasksTodo, setTaskTodo] = useState(0);

    const [vehicletasksDone, setvehicleTasksDone] = useState(0);
    const [vehicletasksTodo, setvehicleTaskTodo] = useState(0);

    const [projectDone, setprojectDone] = useState(0);
    const [projectTodo, setprojectTodo] = useState(0);

    const [projectInReview, setprojectInReview] = useState(0);
    const [projectBacklog, setprojectBacklog] = useState(0);

    const [usersByGroupData, setUsersByGroupData] = useState({
      labels: [],
      datasets: [
        {
          label: 'User Group Distribution', // This label is optional; it's used for accessibility purposes
          data: [],
          backgroundColor: [], // We'll populate this with dynamic colors later
          borderWidth: 1, // Optional: if you want borders on your chart slices
        },
      ],
    });
    const [totalUsers, setTotalUsers] = useState(0);
    const getdata = () => {
      setLoading(true);
      axiosClient.get('/dashboard')
        .then(({ data }) => {
          console.log('Data fetched:', data);
    
          // Handle the scenario where group might be null
          const usersByGroup = data.usersByGroup || [];
          const labels = usersByGroup.map(group => group.group || 'Undefined');
          const totals = usersByGroup.map(group => group.total);
          const total = totals.reduce((acc, current) => acc + current, 0);
          setTotalUsers(total);
          // Set the state for the pie chart data
          setUsersByGroupData({
            labels,
            datasets: [{
              data: totals,
              backgroundColor: [
                // Define colors for each slice here
                '#FF6384', '#36A2EB', '#FFCE56','#5bd171' // ...and so on
              ],
              borderWidth: 1,
            }],
          });
    
          // Update other state variables
          setTasksDone(data.numberOfTasksDone || 0);
          setTaskTodo(data.numberOfTasksTodo || 0);
          setvehicleTasksDone(data.numberOfVehicleTasksDone || 0);
          setvehicleTaskTodo(data.numberOfVehicleTasksTodo || 0);
          setprojectDone(data.numberOfProjectTDone || 0);
          setprojectTodo(data.numberOfTProjectTodo || 0);
          setprojectInReview(data.numberOfProjectTInReview || 0);
          setprojectBacklog(data.numberOfProjectTBacklog || 0);
    
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    };
    const options = {
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
        tooltip: {
          // Tooltip options here
        },
      },
    };
  
    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
        ctx.fillText(String(totalUsers), centerX, centerY);
        ctx.restore();
      },
    };
      useEffect(() => {
        getdata();
       
    }, []);
    return (
        <>
        <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
        <StatisticCard
          statistic={{
            title: 'Project Tasks Todo',
            value: tasksTodo,
            icon: (
              <img
                style={imgStyle}
                src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: 'Project Tasks Done',
            value: tasksDone,
            icon: (
              <img
                style={imgStyle}
                src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: 'Vehicle Tasks Todo',
            value: vehicletasksTodo,
            icon: (
              <img
                style={imgStyle}
                src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: 'Vehicle Tasks Done',
            value: vehicletasksDone,
            icon: (
              <img
                style={imgStyle}
                src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                alt="icon"
              />
            ),
          }}
        />
      </StatisticCard.Group>
    </RcResizeObserver>
            <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        title="Projects"
       
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: 'ToDo',
                  value: projectTodo,
              
                }}
              />
              <StatisticCard
                statistic={{
                  title: 'Done',
                  value: projectDone,
                
                }}
              />
            </ProCard>
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: 'InReview',
                  value: projectInReview,
             
                }}
              />
              <StatisticCard
                statistic={{
                  title: 'Backlog',
                  value: projectBacklog,
               
                }}
              />
            </ProCard>
          </ProCard>
          <StatisticCard
            title="Project Tasks Progress"
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/_dZIob2NB/zhuzhuangtu.svg"
                width="100%"
              />
            }
          />
        </ProCard>
        <StatisticCard
        title="Users"
        chart={
          <Pie data={usersByGroupData} options={options} plugins={[centerTextPlugin]} />
        }
      />
      </ProCard>
    </RcResizeObserver>
        </>
    );
}
