import React, { useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Room, ExamSession } from '../../types/schedule';
import { format, eachDayOfInterval, isSameDay, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import pdfStyles from '../../styles/PlanningDashboard/RoomsPDFGenerator.module.css';
import 'jspdf-autotable';
import dailyStyles from '../../styles/PlanningDashboard/DailyRoomsOccupation.module.css';

interface RoomsPDFGeneratorProps {
  rooms: Room[];
  reservations: ExamSession[];
  startDate: string;
  endDate?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    marginHorizontal: 'auto',
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingVertical: 5,
  },
  tableHeader: {
    width: '25%',
    padding: 5,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderColor: '#000000',
    textAlign: 'center',
  },
  tableCell: {
    width: '25%',
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderColor: '#000000',
  },
  wideCell: {
    width: '25%',
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderColor: '#000000',
  },
  dateHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    padding: 5,
  },
  dateRangeContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    alignItems: 'center',
  },
  dateInput: {
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  "export-button": {
    // Add appropriate styles for the export button
  },
});

const timeSlots = [
  { start: '08:00', end: '10:00', label: '08:00-10:00' },
  { start: '10:15', end: '12:15', label: '10:15-12:15' },
  { start: '13:00', end: '15:00', label: '13:00-15:00' },
  { start: '15:15', end: '17:15', label: '15:15-17:15' },
];

const isReservationInTimeSlot = (
  reservation: ExamSession,
  slotStart: string,
  slotEnd: string
): boolean => {
  const parseTime = (time: string): number =>
    parse(time, 'HH:mm', new Date()).getTime();

  const slotStartTime = parseTime(slotStart);
  const slotEndTime = parseTime(slotEnd);

  const reservationStart = format(
    new Date(reservation.startDateTime),
    'HH:mm'
  );
  const reservationEnd = format(new Date(reservation.endDateTime), 'HH:mm');

  const resStartTime = parseTime(reservationStart);
  const resEndTime = parseTime(reservationEnd);

  return (
    (resStartTime >= slotStartTime && resStartTime < slotEndTime) ||
    (resEndTime > slotStartTime && resEndTime <= slotEndTime) ||
    (resStartTime <= slotStartTime && resEndTime >= slotEndTime)
  );
};

const RoomsPDFDocument = ({ rooms, reservations, startDate, endDate }: RoomsPDFGeneratorProps) => {
  const dates = endDate
    ? eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      })
    : [new Date(startDate)];

  console.log('RoomsPDFDocument received:', {
    rooms: rooms.map(r => ({ id: r.id, name: r.name })),
    reservations: reservations.map(r => ({
      id: r.id,
      roomId: r.classroomId,
      date: format(new Date(r.startDateTime), 'yyyy-MM-dd'),
      subModule: r.submodule?.name,
      groupName: r.groupName
    })),
    startDate,
    endDate,
    dates: dates.map(d => format(d, 'yyyy-MM-dd'))
  });

  return (
    <Document>
      {dates.map((date) => {
        // Filter reservations for the current date
        const dateReservations = reservations.filter(reservation => 
          isSameDay(new Date(reservation.startDateTime), date)
        );

        console.log('Filtering reservations for date:', {
          date: format(date, 'yyyy-MM-dd'),
          allReservations: reservations.length,
          filteredReservations: dateReservations.length,
          filteredDetails: dateReservations.map(r => ({
            id: r.id,
            roomId: r.classroomId,
            date: format(new Date(r.startDateTime), 'yyyy-MM-dd'),
            subModule: r.submodule?.name,
            groupName: r.groupName
          }))
        });

        return (
          <Page key={date.toISOString()} size="A4" style={styles.page} orientation="landscape">
            <Text style={styles.title}>Occupation des salles</Text>
            <Text style={styles.subtitle}>
              {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
            </Text>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Salle</Text>
                {timeSlots.map((slot) => (
                  <Text key={slot.label} style={styles.tableHeader}>
                    {slot.label}
                  </Text>
                ))}
              </View>

              {rooms.map((room) => (
                <View key={`${date.toISOString()}-${room.id}`} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {room.name} {room.type ? `(${room.type})` : ''}
                  </Text>

                  {timeSlots.map((slot) => {
                    const reservation = dateReservations.find(
                      (r) => {
                        const isSameRoom = r.classroomId === room.id;
                        const isInTimeSlot = isReservationInTimeSlot(r, slot.start, slot.end);
                        
                        console.log('Checking reservation for PDF:', {
                          reservationId: r.id,
                          roomId: room.id,
                          reservationRoomId: r.classroomId,
                          date: format(date, 'yyyy-MM-dd'),
                          reservationDate: format(new Date(r.startDateTime), 'yyyy-MM-dd'),
                          slotStart: slot.start,
                          slotEnd: slot.end,
                          reservationStart: format(new Date(r.startDateTime), 'HH:mm'),
                          reservationEnd: format(new Date(r.endDateTime), 'HH:mm'),
                          isSameRoom,
                          isInTimeSlot,
                          subModule: r.submodule?.name,
                          groupName: r.groupName
                        });

                        return isSameRoom && isInTimeSlot;
                      }
                    );

                    return (
                      <Text
                        key={`${date.toISOString()}-${room.id}-${slot.label}`}
                        style={styles.wideCell}
                      >
                        {reservation && reservation.submodule?.name
                          ? `Module: ${reservation.submodule.name}\n` +
                            `Groupe: ${reservation.groupName || 'N/A'}\n` +
                            `Prof: ${
                              reservation.submodule.teacher
                                ? `${reservation.submodule.teacher.firstName} ${reservation.submodule.teacher.lastName}`
                                : 'N/A'
                            }\n` +
                            `${reservation.wasAttended ? 'X' : '0'}`
                          : '---'}
                      </Text>
                    );
                  })}
                </View>
              ))}
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export const RoomsPDFGenerator: React.FC<RoomsPDFGeneratorProps> = ({
  rooms,
  reservations,
  startDate: initialStartDate,
  endDate: initialEndDate,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  console.log('RoomsPDFGenerator received:', {
    rooms,
    reservations,
    initialStartDate,
    initialEndDate,
  });

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      console.log('Generating PDF with data:', {
        rooms,
        reservations,
        startDate: initialStartDate,
        endDate: initialEndDate,
        reservationsCount: reservations.length,
        roomsCount: rooms.length
      });

      const blob = await pdf(
        <RoomsPDFDocument
          rooms={rooms}
          reservations={reservations}
          startDate={initialStartDate}
          endDate={initialEndDate}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `occupation-salles-${
        initialEndDate
          ? `${format(new Date(initialStartDate), 'yyyy-MM-dd')}-${format(
              new Date(initialEndDate),
              'yyyy-MM-dd'
            )}`
          : format(new Date(initialStartDate), 'yyyy-MM-dd')
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={pdfStyles.container}>
      <button
        onClick={handleGeneratePDF}
        disabled={isGenerating}
        className={dailyStyles["export-button"]}
      >
        {isGenerating ? "Génération..." : "Télécharger PDF"}
      </button>
    </div>
  );
}; 