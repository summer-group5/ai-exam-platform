import React, { useEffect, useState } from 'react';

export default function ExamTimer({
  initialHours = 1,
  initialMinutes = 30,
  initialSeconds = 0,
  onFinish
}) {
  const initialTime =
    initialHours * 3600 +
    initialMinutes * 60 +
    initialSeconds;

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);

      if (onFinish) {
        onFinish();
      }
    }
  }, [timeLeft, onFinish]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const format = (value) => String(value).padStart(2, '0');

  return (
    <div className="exam-timer">
      <span>
        {format(hours)}:{format(minutes)}:{format(seconds)}
      </span>
    </div>
  );
}