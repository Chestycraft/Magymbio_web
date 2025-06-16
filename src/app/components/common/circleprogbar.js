import React from 'react';
import {
  CircularProgressbar,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const MembershipProgress = ({ daysLeft, totalDays }) => {
  const percentage = (daysLeft / totalDays) * 100;
  let color = '#00e676'; // green
  if (daysLeft <= 3) {
    color = '#f44336'; // red
  } else if (daysLeft <= 7) {
    color = '#ff9800'; // orange
  }

  return (
    <div style={{ width: 150, margin: '20px auto' }}>
      <CircularProgressbar
        value={percentage}
        text={`${daysLeft}d`}
        styles={buildStyles({
          textColor: 'white',
          pathColor: color,
          trailColor: '#ddd',
        })}
      />
    </div>
  );
};

export default MembershipProgress;
