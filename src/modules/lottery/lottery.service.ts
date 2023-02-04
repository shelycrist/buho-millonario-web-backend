import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import { CreateLotteryDTO } from './dtos/create-lottery.dto';
import { UpdateLotteryDto } from './dtos/update-lottery.dto';
import { Lottery } from './lottery.entity';

@Injectable()
export class LotteryService {
  constructor(
    @InjectRepository(Lottery)
    private lotteryRepository: Repository<Lottery>,
  ) {}

  async findAll(): Promise<Lottery[]> {
    return this.lotteryRepository.find();
  }

  async activeLottery(): Promise<Lottery[]> {
    // get all lotteries where startDate is less than now and resultDigits is null
    return this.lotteryRepository.find({
      where: {
        resultDigits: IsNull(),
      },
    });
  }

  async find(id: number): Promise<Lottery> {
    const lottery = await this.lotteryRepository.findOne({ where: { id } });
    if (!lottery) {
      throw new NotFoundException('Lottery not found');
    }
    return lottery;
  }

  async createLottery(lottery: CreateLotteryDTO): Promise<Lottery> {
    return this.lotteryRepository.save(lottery);
  }

  async updateLottery(
    id: number,
    lottery: UpdateLotteryDto,
  ): Promise<UpdateResult> {
    return this.lotteryRepository.update(id, lottery);
  }

  async deleteLottery(id: number): Promise<UpdateResult> {
    return this.lotteryRepository.softDelete(id);
  }

  async clear(): Promise<void> {
    await this.lotteryRepository.query('TRUNCATE TABLE "lottery" CASCADE');
    await this.lotteryRepository.query(
      'ALTER SEQUENCE "state_id_seq" RESTART WITH 1',
    );
  }
}
