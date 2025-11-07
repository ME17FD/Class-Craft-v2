import { useState, useEffect } from "react";
import api from "../services/api";
import { Room, ExamSession } from "../types/schedule";

// Match the backend enum
export enum ReservationType {
  CM = "CM",
  TD = "TD",
  TP = "TP",
  EXAM = "EXAM",
  RATTRAPAGE = "RATTRAPAGE",
  EVENT = "EVENT"
}

export const usePlanningData = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanningData = async () => {
    try {
      setLoading(true);
      const [roomsResponse, reservationsResponse] = await Promise.all([
        api.get("/api/classrooms"),
        api.get("/api/reservations?include=subModule,subModule.teacher,group")
      ]);

      setRooms(roomsResponse.data);
      setReservations(reservationsResponse.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch planning data:", err);
      setError("Failed to load planning data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanningData();
  }, []);

  const updatePresence = async (reservationId: number, wasAttended: boolean) => {
    try {
      await api.put(`/api/reservations/${reservationId}/mark-attended`, {
        wasAttended
      });
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, wasAttended }
            : reservation
        )
      );
    } catch (err) {
      console.error("Failed to update presence:", err);
      throw err;
    }
  };

  const createReservation = async (exam: ExamSession) => {
    try {
      // Validate dates
      const startDate = new Date(exam.startDateTime);
      const endDate = new Date(exam.endDateTime);
      const now = new Date();

      if (startDate >= endDate) {
        throw new Error("Start time must be before end time");
      }

      if (startDate < now) {
        throw new Error("Cannot create reservations in the past");
      }

      // Ensure type is a valid enum value
      const type = exam.type.toUpperCase() as ReservationType;
      if (!Object.values(ReservationType).includes(type)) {
        throw new Error(`Invalid reservation type: ${type}`);
      }

      // Format the request body to match the exact DTO structure
      const reservationData = {
        type,
        startDateTime: exam.startDateTime,
        endDateTime: exam.endDateTime,
        groupId: exam.groupId,
        classroomId: exam.classroomId,
        subModuleId: exam.subModuleId,
        wasAttended: exam.wasAttended || false,
        groupName: exam.groupName || null
      };

      console.log("Creating reservation with data:", JSON.stringify(reservationData, null, 2));
      
      // First check if the time slot is available
      const isAvailable = await api.get("/api/reservations/check-availability", {
        params: {
          classroomId: exam.classroomId,
          startDateTime: exam.startDateTime,
          endDateTime: exam.endDateTime
        }
      });

      console.log("Time slot availability:", isAvailable.data);

      if (!isAvailable.data) {
        throw new Error("This time slot is not available for the selected classroom");
      }

      const response = await api.post("/api/reservations", reservationData);
      console.log("Reservation created successfully:", response.data);

      // Update local state with the new reservation
      setReservations(prev => [...prev, response.data]);
      
      return response.data;
    } catch (err: any) {
      console.error("Failed to create reservation:", {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
      throw err;
    }
  };

  const updateReservation = async (exam: ExamSession) => {
    try {
      // Validate dates
      const startDate = new Date(exam.startDateTime);
      const endDate = new Date(exam.endDateTime);
      const now = new Date();

      if (startDate >= endDate) {
        throw new Error("Start time must be before end time");
      }

      if (startDate < now) {
        throw new Error("Cannot create reservations in the past");
      }

      // Ensure type is a valid enum value
      const type = exam.type.toUpperCase() as ReservationType;
      if (!Object.values(ReservationType).includes(type)) {
        throw new Error(`Invalid reservation type: ${type}`);
      }

      // Format the request body to match the exact DTO structure
      const reservationData = {
        type,
        startDateTime: exam.startDateTime,
        endDateTime: exam.endDateTime,
        groupId: exam.groupId,
        classroomId: exam.classroomId,
        subModuleId: exam.subModuleId,
        wasAttended: exam.wasAttended || false,
        groupName: exam.groupName || null
      };

      console.log("Updating reservation with data:", JSON.stringify(reservationData, null, 2));

      // First check if the time slot is available (excluding current reservation)
      const isAvailable = await api.get("/api/reservations/check-availability", {
        params: {
          classroomId: exam.classroomId,
          startDateTime: exam.startDateTime,
          endDateTime: exam.endDateTime
        }
      });

      console.log("Time slot availability:", isAvailable.data);

      if (!isAvailable.data) {
        throw new Error("This time slot is not available for the selected classroom");
      }

      const response = await api.put(`/api/reservations/${exam.id}`, reservationData);
      console.log("Reservation updated successfully:", response.data);

      // Update local state with the updated reservation and wait for it to complete
      await new Promise<void>((resolve) => {
        setReservations(prev => {
          const updated = prev.map(reservation => 
            reservation.id === exam.id ? response.data : reservation
          );
          resolve();
          return updated;
        });
      });
      
      return response.data;
    } catch (err: any) {
      console.error("Failed to update reservation:", {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
      throw err;
    }
  };

  return {
    rooms,
    reservations,
    loading,
    error,
    updatePresence,
    createReservation,
    updateReservation,
    refreshData: fetchPlanningData,
    setReservations
  };
};