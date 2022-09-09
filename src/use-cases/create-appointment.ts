import { Appointment } from "../entities/appointment";
import { AppointmentsRepository } from "../repositories/appintments-repository";

interface CreateAppointmentRequest {
  customer: string;
  endsAt: Date;
  startsAt: Date;
}

type CreateAppointmentResponse = Appointment;

export class CreateAppointment {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute({
    customer,
    endsAt,
    startsAt,
  }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const overlappingAppointment =
      await this.appointmentsRepository.findOverlappingAppointment(
        startsAt,
        endsAt
      );

    if (overlappingAppointment) {
      throw new Error("Another appointment overlaps this appointmenr dates");
    }

    const appointment = new Appointment({
      customer,
      endsAt,
      startsAt,
    });

    await this.appointmentsRepository.create(appointment);

    return appointment;
  }
}
