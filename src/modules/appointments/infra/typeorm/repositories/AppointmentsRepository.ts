import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const findAppointment = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });
    return findAppointment;
  }

  public async findAllInDayFromProvider({
    provider_id,
    month,
    year,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const findAppointment = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });
    return findAppointment;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
