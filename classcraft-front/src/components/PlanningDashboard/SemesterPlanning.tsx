import React from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useApiData } from "../../hooks/useApiData";
import { CalendarEvent } from "../../types/schedule";
import { usePlanningData } from "../../hooks/usePlanningData";
import { Classroom } from "../../types/type";

const locales = { fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const SemesterPlanning: React.FC = () => {
  const { rooms, groups, fields } = useApiData();
  const { reservations } = usePlanningData();
  const [currentView, setCurrentView] = React.useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [filterRoom, setFilterRoom] = React.useState<string>("all");
  const [filterGroup, setFilterGroup] = React.useState<string>("all");
  const [filterField, setFilterField] = React.useState<string>("all");

  // Convertir les réservations en événements pour le calendrier
  const events: CalendarEvent[] = reservations.map((reservation) => {
    const group = groups.find(g => g.id === reservation.groupId);
    const room = reservation.classroom || rooms.find(r => r.id === reservation.classroomId) as Classroom | undefined;
    const field = fields.find(f => f.id === group?.filiereId);

    // Parse the ISO strings and create dates in local timezone
    const startDate = new Date(reservation.startDateTime);
    const endDate = new Date(reservation.endDateTime);

    // Ensure the dates are set to the local timezone
    const localStart = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes()
    );

    const localEnd = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes()
    );

    return {
      id: reservation.id,
      title: `${reservation.submodule?.name || "Réservation"} - ${
        group?.name || reservation.groupName || ""
      }`,
      start: localStart,
      end: localEnd,
      resource: {
        room,
        group,
        field,
        type: reservation.type || "RESERVATION",
        wasAttended: reservation.wasAttended,
        professor: reservation.submodule?.teacher
      },
    };
  });

  // Appliquer les filtres
  const filteredEvents = events.filter((event) => {
    const roomMatch =
      filterRoom === "all" || event.resource.room?.id?.toString() === filterRoom;

    const groupMatch =
      filterGroup === "all" ||
      event.resource.group?.id?.toString() === filterGroup;

    const fieldMatch =
      filterField === "all" || 
      event.resource.field?.id?.toString() === filterField;

    return roomMatch && groupMatch && fieldMatch;
  });

  return (
    <div style={{ height: "800px", padding: "20px", paddingBottom: "40px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}>
        {/* Filtre par filière */}
        <select
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}>
          <option value="all">Toutes les filières</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id?.toString()}>
              {field.name}
            </option>
          ))}
        </select>

        {/* Filtre par salle */}
        <select
          value={filterRoom}
          onChange={(e) => setFilterRoom(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}>
          <option value="all">Toutes les salles</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id.toString()}>
              {room.name} (Capacité: {room.capacity})
            </option>
          ))}
        </select>

        {/* Filtre par groupe */}
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}>
          <option value="all">Tous les groupes</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id?.toString()}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        view={currentView}
        onView={(view: View) => setCurrentView(view)}
        date={currentDate}
        onNavigate={setCurrentDate}
        culture="fr"
        onSelectEvent={(event) => {
          setCurrentView(Views.DAY);
          setCurrentDate(event.start);
        }}
        messages={{
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          today: "Aujourd'hui",
          previous: "Précédent",
          next: "Suivant",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Réservation",
          noEventsInRange: "Aucune réservation prévue.",
        }}
        eventPropGetter={(event: CalendarEvent) => {
          let backgroundColor = "#2196F3"; // Bleu par défaut
          if (event.resource.type === "EXAM") backgroundColor = "#F44336";
          if (event.resource.type === "TD") backgroundColor = "#3ccd5f";
          if (event.resource.type === "TP") backgroundColor = "#30a2b4";
          if (event.resource.type === "RATTRAPAGE") backgroundColor = "#f15f0c";
          if (event.resource.type === "EVENT") backgroundColor = "#721b84";
          if (event.resource.type === "EXAM") backgroundColor = "#e71d1d";
          if (!event.resource.wasAttended) backgroundColor = "#9E9E9E";

          return { 
            style: { 
              backgroundColor, 
              height: 'auto', 
              whiteSpace: 'normal', 
              overflow: 'visible' 
            }
          };
        }}
        components={{
          event: ({ event }: { event: CalendarEvent }) => (
            <div style={{ 
              padding: "2px 4px", 
              fontSize: "0.8em",
            }}>
              <div style={{ fontWeight: "bold" }}>{event.resource.type} {event.resource.group?.name || ""}</div>
              {event.resource.professor && (
                <div>Prof: {event.resource.professor.firstName} {event.resource.professor.lastName} {event.resource.room?.name || ""}</div>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default SemesterPlanning;
