import { ObjectId } from "mongodb";

export type Reservation = {
    _id: ObjectId,
    userId: ObjectId,
    session: ObjectId,
    date: string,
    status: ReservationStatus,
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}
