import { useState } from "react";
import "../App.css";
import {
  LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function Analytics() {
  const [showReport, setShowReport] = useState(false);

  const data = [
    { name: "Jan", services: 1, expenses: 1200 },
    { name: "Feb", services: 1, expenses: 2100 },
    { name: "Mar", services: 2, expenses: 9000 },
    { name: "Apr", services: 1, expenses: 2400 },
    { name: "May", services: 1, expenses: 3100 },
  ];

  return (
    <div className="analyticsWrapper">
      <p>SERVICE ANALYTICS</p>

      <div
        className="chartsRow clickableChart"
        onClick={() => setShowReport(true)}
      >
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="expenses" stroke="#06632b" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showReport && (
        <div className="overlay">
          <div className="overlayContent">
            <h2>Monthly Service Report</h2>

            <p>This report shows the analytics summary for the selected period.</p>

            <ul>
              <li><strong>Total Months:</strong> {data.length}</li>
              <li><strong>Highest Expenses:</strong> ${Math.max(...data.map(d => d.expenses))}</li>
              <li><strong>Lowest Expenses:</strong> ${Math.min(...data.map(d => d.expenses))}</li>
              <li><strong>Total Expenses:</strong> ${data.reduce((sum, d) => sum + d.expenses, 0)}</li>
            </ul>

            <button
              className="closeBtn"
              onClick={() => setShowReport(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Analytics;
