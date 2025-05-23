import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const formatTime = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  const hoursInString = hours.toString().padStart(2, "0");
  const minutesInString = minutes.toString().padStart(2, "0");
  const secondsInString = seconds.toString().padStart(2, "0");

  return `${hoursInString}:${minutesInString}:${secondsInString}`;
};

const Stopwatch = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Stopwatch</h1>
        <section>
          <div className="stopwatch">
            <h2>{formatTime(time)}</h2>
            <button onClick={() => setIsRunning((prev) => !prev)}>
              {isRunning ? "Stop" : "Start"}
            </button>
            <button onClick={handleReset}>Reset</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Stopwatch;
