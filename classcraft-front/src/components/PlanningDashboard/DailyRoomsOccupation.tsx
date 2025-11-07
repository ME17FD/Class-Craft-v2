import React, { useEffect, useState } from "react";
import styles from "../../styles/PlanningDashboard/DailyRoomsOccupation.module.css";
import { usePlanningData } from "../../hooks/usePlanningData";
import { format, parse, isSameDay, eachDayOfInterval, addDays } from "date-fns";
import { ExamSession } from "../../types/schedule";
import * as XLSX from "xlsx";
import { RoomsPDFGenerator } from './RoomsPDFGenerator';

interface DailyRoomsOccupationProps {
  date: string;
}

const timeSlots = [
  { start: "08:00", end: "10:00", label: "08:00-10:00" },
  { start: "10:15", end: "12:15", label: "10:15-12:15" },
  { start: "13:00", end: "15:00", label: "13:00-15:00" },
  { start: "15:15", end: "17:15", label: "15:15-17:15" },
] as const;

const DailyRoomsOccupation: React.FC<DailyRoomsOccupationProps> = ({
  date,
}) => {
  const { rooms, reservations, loading, error, updatePresence } =
    usePlanningData();
  const selectedDate = new Date(date);
  const [useDateRange, setUseDateRange] = useState(false);
  const [endDate, setEndDate] = useState(date);

  useEffect(() => {
    console.log("Current reservations:", reservations);
    console.log("Selected date:", date);
    console.log("Rooms data:", rooms);
  }, [reservations, date, rooms]);

  const dayReservations = React.useMemo(() => {
    console.log('Filtering reservations:', {
      allReservations: reservations,
      selectedDate: format(selectedDate, 'yyyy-MM-dd'),
      selectedDateObj: selectedDate
    });

    const filtered = reservations.filter((reservation) => {
      const reservationDate = new Date(reservation.startDateTime);
      const isSameDayResult = isSameDay(reservationDate, selectedDate);
      
      console.log('Checking reservation:', {
        reservationId: reservation.id,
        reservationDate: format(reservationDate, 'yyyy-MM-dd'),
        selectedDate: format(selectedDate, 'yyyy-MM-dd'),
        isSameDay: isSameDayResult,
        roomId: reservation.classroomId,
        subModule: reservation.submodule?.name,
        groupName: reservation.groupName
      });

      return isSameDayResult;
    });

    console.log('Filtered reservations for PDF:', {
      filteredCount: filtered.length,
      filteredReservations: filtered.map(r => ({
        id: r.id,
        roomId: r.classroomId,
        date: format(new Date(r.startDateTime), 'yyyy-MM-dd'),
        subModule: r.submodule?.name,
        groupName: r.groupName
      }))
    });
    return filtered;
  }, [reservations, date]);

  const isReservationInTimeSlot = (
    reservation: ExamSession,
    slotStart: string,
    slotEnd: string
  ): boolean => {
    const parseTime = (time: string): number =>
      parse(time, "HH:mm", new Date()).getTime();

    const slotStartTime = parseTime(slotStart);
    const slotEndTime = parseTime(slotEnd);

    const reservationStart = format(
      new Date(reservation.startDateTime),
      "HH:mm"
    );
    const reservationEnd = format(new Date(reservation.endDateTime), "HH:mm");

    const resStartTime = parseTime(reservationStart);
    const resEndTime = parseTime(reservationEnd);

    const isInSlot =
      (resStartTime >= slotStartTime && resStartTime < slotEndTime) ||
      (resEndTime > slotStartTime && resEndTime <= slotEndTime) ||
      (resStartTime <= slotStartTime && resEndTime >= slotEndTime);

    console.log(
      `Checking reservation ${reservation.id} (${reservationStart}-${reservationEnd}) against slot ${slotStart}-${slotEnd}:`,
      isInSlot
    );
    return isInSlot;
  };

  const getReservationStatus = (
    reservation: ExamSession | null
  ): "empty" | "absent" | "occupied" => {
    if (!reservation) return "empty";
    if (reservation.wasAttended === false) return "absent";
    return "occupied";
  };

  const handlePresenceChange = async (
    reservationId: number,
    currentValue: boolean
  ) => {
    console.log(
      "Updating presence for reservation:",
      reservationId,
      "from",
      currentValue,
      "to",
      !currentValue
    );
    try {
      await updatePresence(reservationId, !currentValue);
      console.log("Presence updated successfully");
    } catch (err) {
      console.error("Failed to update presence:", err);
      alert("Failed to update presence. Check console for details.");
    }
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Get date range
    const dates = useDateRange
      ? eachDayOfInterval({
          start: new Date(date),
          end: new Date(endDate),
        })
      : [new Date(date)];

    // Create a sheet for each date
    dates.forEach((currentDate) => {
      const dateReservations = reservations.filter(reservation => 
        isSameDay(new Date(reservation.startDateTime), currentDate)
      );

      const data: (string | number)[][] = [];

      // Header row
      data.push(["Salle", ...timeSlots.map((slot) => slot.label)]);

      rooms.forEach((room) => {
        const row: (string | number)[] = [room.name];

        for (const slot of timeSlots) {
          const reservation = dateReservations.find(
            (r) =>
              r.classroomId === room.id &&
              isReservationInTimeSlot(r, slot.start, slot.end)
          );

          if (reservation) {
            const moduleName = reservation.submodule?.name || "N/A";
            const groupName =
              reservation.groupName || `ID: ${reservation.groupId}` || "N/A";
            const profName = reservation.submodule?.teacher
              ? `${reservation.submodule.teacher.firstName} ${reservation.submodule.teacher.lastName}`
              : "N/A";
            const presence = reservation.wasAttended ? "X" : "0";

            // multiline text to force Excel auto row height
            const cellContent =
              `Module: ${moduleName}\n` +
              `Groupe: ${groupName}\n` +
              `Prof: ${profName}\n` +
              `${presence}`;

            row.push(cellContent);
          } else {
            row.push("-"); // fill libre cells with "-"
          }
        }

        data.push(row);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Bold headers
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[cellAddress]) continue;
        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
        worksheet[cellAddress].s.font = { bold: true };
      }

      // Wrap text & auto column width
      const colWidths = data[0].map((_, colIndex) => {
        let maxLength = 10;
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
          const cell = data[rowIndex][colIndex];
          if (cell) {
            const cellLines = String(cell).split("\n");
            const longestLineLength = cellLines.reduce(
              (max, line) => Math.max(max, line.length),
              0
            );
            maxLength = Math.max(maxLength, longestLineLength);
          }
        }
        return { wch: maxLength + 2 };
      });
      worksheet["!cols"] = colWidths;

      // Apply wrapText & vertical alignment top to all cells except header
      for (let R = 1; R <= range.e.r; ++R) {
        let maxLines = 1; // Track maximum number of lines in this row
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          if (cell) {
            if (!cell.s) cell.s = {};
            if (!cell.s.alignment) cell.s.alignment = {};
            cell.s.alignment.wrapText = true;
            cell.s.alignment.vertical = "top";
            
            // Calculate number of lines in this cell
            const cellContent = String(cell.v || '');
            const lineCount = cellContent.split('\n').length;
            maxLines = Math.max(maxLines, lineCount);
          }
        }
        
        // Set row height based on content (approximately 15 points per line)
        if (!worksheet['!rows']) worksheet['!rows'] = [];
        worksheet['!rows'][R] = { hpt: maxLines * 15 };
      }

      // Add sheet with formatted date as name
      const sheetName = format(currentDate, "dd-MM-yyyy");
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    // Generate filename based on date range
    const filename = useDateRange
      ? `occupation-salles-${format(new Date(date), "yyyy-MM-dd")}-${format(
          new Date(endDate),
          "yyyy-MM-dd"
        )}.xlsx`
      : `occupation-salles-${format(new Date(date), "yyyy-MM-dd")}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-spinner"]}></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["error-container"]}>
        <p className={styles["error-message"]}>{error}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className={styles["empty-state"]}>
        <p>Aucune salle n'est disponible.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  return (
    <div className={styles["daily-rooms-planning"]}>
      <h1>Planning journalier - Occupation des salles</h1>
      <h2>{format(selectedDate, "dd MMMM yyyy")}</h2>

      <div className={styles["debug-info"]}>
        <div className={styles["export-controls"]}>
          <label className={styles.toggleLabel}>
            Utiliser une plage de dates
            <div className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={useDateRange}
                onChange={(e) => setUseDateRange(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </div>
          </label>
          {useDateRange && (
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={date}
              max={format(addDays(new Date(date), 30), 'yyyy-MM-dd')}
              className={styles["date-input"]}
            />
          )}
          <div className={styles["export-buttons"]}>
            <button onClick={exportToExcel}>
              Télécharger Excel
            </button>
            <RoomsPDFGenerator
              rooms={rooms}
              reservations={reservations}
              startDate={date}
              endDate={useDateRange ? endDate : undefined}
            />
          </div>
        </div>
      </div>

      <div className={styles["planning-grid"]}>
        <div className={`${styles["grid-row"]} ${styles["header"]}`}>
          <div className={`${styles["room-cell"]} ${styles["header-cell"]}`}>
            SALLE
          </div>
          {timeSlots.map((slot) => (
            <div
              key={slot.label}
              className={`${styles["time-slot-cell"]} ${styles["header-cell"]}`}>
              {slot.label}
            </div>
          ))}
        </div>

        {rooms.map((room) => (
          <div key={room.id} className={styles["grid-row"]}>
            <div className={styles["room-cell"]}>
              {room.name}
              <div className={styles["room-info"]}>
                {room.capacity} places • {room.type || "Non spécifié"}
              </div>
            </div>

            {timeSlots.map((slot) => {
              const reservation = dayReservations.find(
                (r) =>
                  r.classroomId === room.id &&
                  isReservationInTimeSlot(r, slot.start, slot.end)
              );

              const status = getReservationStatus(reservation || null);

              return (
                <div
                  key={`${room.id}-${slot.start}`}
                  className={`${styles["session-cell"]} ${styles[status]}`}
                  data-testid={`cell-${room.id}-${slot.start.replace(
                    ":",
                    ""
                  )}`}>
                  {reservation ? (
                    <div className={styles["session-content"]}>
                      <div className={styles["session-title"]}>
                        {reservation.submodule?.name || "Réservation"}
                      </div>
                      {reservation.submodule?.teacher && (
                        <div className={styles["session-professor"]}>
                          Prof: {reservation.submodule.teacher.firstName}{" "}
                          {reservation.submodule.teacher.lastName}
                        </div>
                      )}
                      <div className={styles["session-details"]}>
                        {reservation.groupName
                          ? `Groupe ${reservation.groupName}`
                          : `Groupe ID: ${reservation.groupId}`}
                      </div>
                      <label className={styles["checkbox-label"]}>
                        Prof. présent:
                        <input
                          type="checkbox"
                          checked={reservation.wasAttended}
                          onChange={() =>
                            handlePresenceChange(
                              reservation.id,
                              reservation.wasAttended
                            )
                          }
                          data-testid={`checkbox-${reservation.id}`}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className={styles["empty-label"]}>Libre</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyRoomsOccupation;
