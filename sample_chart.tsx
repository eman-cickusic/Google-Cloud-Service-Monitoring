import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SLOChartExample() {
  // Sample data representing SLI performance over time
  const [data] = useState([
    { time: '9:00 AM', availability: 99.95, latency: 120, target: 99.5 },
    { time: '10:00 AM', availability: 99.97, latency: 115, target: 99.5 },
    { time: '11:00 AM', availability: 99.99, latency: 105, target: 99.5 },
    { time: '12:00 PM', availability: 99.90, latency: 125, target: 99.5 },
    { time: '1:00 PM', availability: 99.85, latency: 135, target: 99.5 },
    { time: '2:00 PM', availability: 95.50, latency: 350, target: 99.5 }, // Error spike
    { time: '3:00 PM', availability: 97.20, latency: 250, target: 99.5 }, // Recovery
    { time: '4:00 PM', availability: 99.40, latency: 150, target: 99.5 },
    { time: '5:00 PM', availability: 99.80, latency: 120, target: 99.5 },
  ]);

  const [activeTab, setActiveTab] = useState('availability');

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Service Monitoring Visualization Example</h2>
      
      <div className="flex space-x-2 mb-4">
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === 'availability' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('availability')}
        >
          Availability SLI
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === 'latency' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('latency')}
        >
          Latency
        </button>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis 
              domain={activeTab === 'availability' ? [94, 100] : [0, 400]}
              label={{ 
                value: activeTab === 'availability' ? 'Availability (%)' : 'Latency (ms)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip />
            <Legend />
            
            {activeTab === 'availability' && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="availability" 
                  stroke="#3182ce" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#e53e3e" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                />
              </>
            )}
            
            {activeTab === 'latency' && (
              <Line 
                type="monotone" 
                dataKey="latency" 
                stroke="#38a169" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Chart Explanation</h3>
        {activeTab === 'availability' ? (
          <p className="text-gray-600">
            This chart shows the availability SLI over time. The blue line represents the actual availability percentage, 
            while the red dashed line shows the target SLO (99.5%). Notice the significant drop at 2:00 PM, which would 
            trigger an alert as it falls below the SLO threshold and burns through the error budget rapidly.
          </p>
        ) : (
          <p className="text-gray-600">
            This chart displays the latency (in milliseconds) over time. The spike at 2:00 PM correlates with the 
            availability drop, indicating a service disruption that affected both metrics. In a real monitoring setup,
            you could set SLOs for both availability and latency metrics.
          </p>
        )}
      </div>
    </div>
  );
}
