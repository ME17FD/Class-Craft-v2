// pages/DailyReportsPage.tsx
import React from "react";
import DailyRoomsOccupation from "./DailyRoomsOccupation";

const DailyReportsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date().toISOString().split("T")[0]
  );



  return (
    <div className="daily-reports-page">
      <div className="date-selector">
        <label htmlFor="report-date">Date : </label>
        <input
          id="report-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <DailyRoomsOccupation date={selectedDate} />
    </div>
  );
};

export default DailyReportsPage;
