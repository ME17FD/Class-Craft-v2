// PDFGenerator.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Group, Professor } from "../../types/type";
import { Session, Room } from "../../types/schedule";
import style from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import React from "react";
import { pdf } from "@react-pdf/renderer";

interface Reservation {
  id: number;
  startDateTime: string;
  endDateTime: string;
  wasAttended: boolean;
  subModuleId: number;
  groupId: number;
  classroomId: number;
  subModule?: {
    name: string;
    professor?: {
      firstName: string;
      lastName: string;
    };
  };
  group?: {
    name: string;
  };
  classroom?: Room;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    width: "100%",
    marginHorizontal: "auto",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#cccccc",
    paddingVertical: 5,
  },
  tableHeader: {
    width: "20%",
    padding: 5,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    width: "20%",
    padding: 5,
    fontSize: 10,
  },
  wideCell: {
    width: "40%",
    padding: 5,
    fontSize: 10,
  },
});

// Type pour les différents types de données
type PDFData = {
  group?: Group | null;
  professor?: Professor | null;
  sessions?: Session[];
  reservations?: Reservation[];
  rooms?: Room[];
  date?: string;
  type: "group" | "professor" | "makeup" | "exam" | "rooms";
};

const GroupPdfDocument = ({ data }: { data: PDFData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Emploi du temps - {data.group?.name}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Jour</Text>
          <Text style={styles.tableHeader}>Heure</Text>
          <Text style={styles.tableHeader}>Module</Text>
          <Text style={styles.tableHeader}>Professeur</Text>
          <Text style={styles.tableHeader}>Salle</Text>
        </View>

        {data.sessions?.map((session) => (
          <View style={styles.tableRow} key={session.id}>
            <Text style={styles.tableCell}>
              {session.day || session.dayOfWeek}
            </Text>
            <Text style={styles.tableCell}>
              {session.startTime} - {session.endTime}
            </Text>
            <Text style={styles.tableCell}>
              {session.module?.name || session.subModule?.name}
            </Text>
            <Text style={styles.tableCell}>
              {session?.professor?.firstName} {session?.professor?.lastName}
            </Text>
            <Text style={styles.tableCell}>{session?.classroom?.name}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const ProfessorPdfDocument = ({ data }: { data: PDFData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        Emploi du temps - {data.professor?.firstName} {data.professor?.lastName}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Jour</Text>
          <Text style={styles.tableHeader}>Heure</Text>
          <Text style={styles.tableHeader}>Module</Text>
          <Text style={styles.tableHeader}>Groupe</Text>
          <Text style={styles.tableHeader}>Salle</Text>
        </View>

        {data.sessions?.map((session) => (
          <View style={styles.tableRow} key={session.id}>
            <Text style={styles.tableCell}>
              {session.day || session.dayOfWeek}
            </Text>
            <Text style={styles.tableCell}>
              {session.startTime} - {session.endTime}
            </Text>
            <Text style={styles.tableCell}>
              {session.module?.name || session.subModule?.name}
            </Text>
            <Text style={styles.tableCell}>{session.group?.name}</Text>
            <Text style={styles.tableCell}>{session?.classroom?.name}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const MakeupPdfDocument = ({ data }: { data: PDFData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        Planning des Rattrapages - {data.group?.name}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Jour</Text>
          <Text style={styles.tableHeader}>Heure</Text>
          <Text style={styles.tableHeader}>Module</Text>
          <Text style={styles.tableHeader}>Professeur</Text>
          <Text style={styles.tableHeader}>Salle</Text>
        </View>

        {data.sessions?.map((session) => (
          <View style={styles.tableRow} key={session.id}>
            <Text style={styles.tableCell}>
              {session.day || session.dayOfWeek}
            </Text>
            <Text style={styles.tableCell}>
              {session.startTime} - {session.endTime}
            </Text>
            <Text style={styles.tableCell}>
              {session.module?.name || session.subModule?.name}
            </Text>
            <Text style={styles.tableCell}>
              {session?.professor?.firstName} {session?.professor?.lastName}
            </Text>
            <Text style={styles.tableCell}>{session?.classroom?.name}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const ExamPdfDocument = ({ data }: { data: PDFData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        Planning des Examens - {data.group?.name}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Jour</Text>
          <Text style={styles.tableHeader}>Heure</Text>
          <Text style={styles.tableHeader}>Module</Text>
          <Text style={styles.tableHeader}>Surveillant</Text>
          <Text style={styles.tableHeader}>Salle</Text>
        </View>

        {data.sessions?.map((session) => (
          <View style={styles.tableRow} key={session.id}>
            <Text style={styles.tableCell}>
              {session.day || session.dayOfWeek}
            </Text>
            <Text style={styles.tableCell}>
              {session.startTime} - {session.endTime}
            </Text>
            <Text style={styles.tableCell}>
              {session.module?.name || session.subModule?.name}
            </Text>
            <Text style={styles.tableCell}>
              {session?.professor?.firstName} {session?.professor?.lastName}
            </Text>
            <Text style={styles.tableCell}>{session?.classroom?.name}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const RoomsPdfDocument = ({ data }: { data: PDFData }) => {
  if (!data.rooms || !data.reservations || !data.date) {
    return (
      <Document>
        <Page size="A4" style={styles.page} orientation="landscape">
          <Text style={styles.title}>Données manquantes</Text>
        </Page>
      </Document>
    );
  }

  const rooms = data.rooms;
  const reservations = data.reservations;

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Text style={styles.title}>Occupation des salles</Text>
        <Text style={styles.subtitle}>
          {new Date(data.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Salle</Text>
            <Text style={styles.tableHeader}>08:00-10:00</Text>
            <Text style={styles.tableHeader}>10:15-12:15</Text>
            <Text style={styles.tableHeader}>13:00-15:00</Text>
            <Text style={styles.tableHeader}>15:15-17:15</Text>
            <Text style={styles.tableHeader}>Capacité</Text>
          </View>

          {rooms.map((room) => (
            <View style={styles.tableRow} key={`room-${room.id}`}>
              <Text style={styles.tableCell}>
                {room.name} {room.type ? `(${room.type})` : ''}
              </Text>

              {["08:00-10:00", "10:15-12:15", "13:00-15:00", "15:15-17:15"].map(
                (timeSlot, index) => {
                  const [start, end] = timeSlot.split("-");
                  const reservation = reservations.find(
                    (r) =>
                      r.classroomId === room.id &&
                      new Date(r.startDateTime).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) <= end &&
                      new Date(r.endDateTime).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) >= start
                  );

                  return (
                    <Text 
                      style={styles.wideCell} 
                      key={`room-${room.id}-timeslot-${index}-${timeSlot}`}
                    >
                      {reservation
                        ? `Module: ${reservation.subModule?.name || "N/A"}\n` +
                          `Groupe: ${reservation.group?.name || "N/A"}\n` +
                          `Prof: ${
                            reservation.subModule?.professor?.firstName || ""
                          } ${
                            reservation.subModule?.professor?.lastName || ""
                          }\n` +
                          `Présence: ${reservation.wasAttended ? "✔" : "✖"}`
                        : "Libre"}
                    </Text>
                  );
                }
              )}

              <Text style={styles.tableCell}>{room.capacity}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

const PdfDocument = ({ data }: { data: PDFData }) => {
  switch (data.type) {
    case "group":
      return <GroupPdfDocument key={`group-${data.group?.id}`} data={data} />;
    case "professor":
      return <ProfessorPdfDocument key={`professor-${data.professor?.id}`} data={data} />;
    case "makeup":
      return <MakeupPdfDocument key={`makeup-${data.group?.id}`} data={data} />;
    case "exam":
      return <ExamPdfDocument key={`exam-${data.group?.id}`} data={data} />;
    case "rooms":
      return <RoomsPdfDocument key={`rooms-${data.date}`} data={data} />;
    default:
      return null;
  }
};

export const PDFGenerator = ({ data }: { data: PDFData }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const getFileName = () => {
    switch (data.type) {
      case "group":
        return `emploi-du-temps-${data.group?.name || "groupe"}.pdf`;
      case "professor":
        return `emploi-du-temps-${data.professor?.firstName || ""}-${
          data.professor?.lastName || "professeur"
        }.pdf`;
      case "makeup":
        return `rattrapages-${data.group?.name || "groupe"}.pdf`;
      case "exam":
        return `examens-${data.group?.name || "groupe"}.pdf`;
      case "rooms":
        return `occupation-salles-${data.date || ""}.pdf`;
      default:
        return "document.pdf";
    }
  };

  // Ensure data is valid before rendering
  const isValidData = () => {
    if (!data) return false;
    
    switch (data.type) {
      case "rooms":
        return Array.isArray(data.rooms) && Array.isArray(data.reservations);
      case "group":
        return data.group && Array.isArray(data.sessions);
      case "professor":
        return data.professor && Array.isArray(data.sessions);
      case "makeup":
      case "exam":
        return data.group && Array.isArray(data.sessions);
      default:
        return false;
    }
  };

  const handleGeneratePDF = async () => {
    if (!isValidData()) {
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await pdf(<PdfDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getFileName();
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

  if (!isValidData()) {
    return (
      <button className={style.pdfButton} disabled>
        Données invalides
      </button>
    );
  }

  return (
    <button 
      className={style.pdfButton} 
      onClick={handleGeneratePDF}
      disabled={isGenerating}
    >
      {isGenerating ? "Génération..." : "📄 Télécharger PDF"}
    </button>
  );
};
