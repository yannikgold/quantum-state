import { useEffect, useState } from 'react';

const TARGET_DATE = '2030-01-01T00:00:00Z';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [workDaysLeft, setWorkDaysLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(TARGET_DATE) - +new Date();
      const timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
      setTimeLeft(timeLeft);
      
      // Calculate work days (Mon-Fri)
      let workDays = 0;
      // eslint-disable-next-line prefer-const
            let currentDate = new Date();
            const targetDate = new Date(TARGET_DATE);
            while (currentDate < targetDate) {
              if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                workDays++;
              }
              currentDate.setDate(currentDate.getDate() + 1);
            }
      setWorkDaysLeft(workDays);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-1">Countdown to Year 2 Quantum</h2>
        <p className="text-gray-400 text-sm mb-4">2030</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-3xl font-bold">{timeLeft.days}</div>
            <div className="text-sm">Days</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm">Hours</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm">Minutes</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm">Seconds</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Work Days Remaining</h2>
        <div className="text-4xl font-bold text-center">{workDaysLeft}</div>
        <div className="text-sm text-center mt-2">Monday–Friday</div>
      </div>
    </div>
  );
};
