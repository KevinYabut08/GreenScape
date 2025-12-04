import "../App.css";

function Progress({ percentage = 70 }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progressWrapper">
      <p>SERVICE PROGRESS</p>
      <div className="ringWrapper">
        <svg className="ring" width="160" height="160">
          <circle
            className="ringBg"
            cx="80"
            cy="80"
            r={radius}
          />
          <circle
            className="ringProgress"
            cx="80"
            cy="80"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="ringText">{percentage}%</div>
      </div>
    </div>
  );
}

export default Progress;

