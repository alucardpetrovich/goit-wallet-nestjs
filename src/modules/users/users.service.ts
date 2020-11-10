import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ email });
  }

  async createUser({
    username,
    email,
    password,
  }: SignUpDto): Promise<UserEntity> {
    const passwordHash = await this.createPasswordHash(password);
    return this.usersRepository.save({ username, email, passwordHash });
  }

  async updateUserBalance(
    user: UserEntity,
    amountToAdd: number,
  ): Promise<UserEntity> {
    const updateResult = await this.usersRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ balance: () => `balance + ${amountToAdd}` })
      .where('id = :userId', { userId: user.id })
      .returning('*')
      .execute();

    const updatedUser = updateResult.raw[0];
    return updatedUser;
  }

  async comparePasswords(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcryptjs.compare(password, passwordHash);
  }

  private async createPasswordHash(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>(
      'encrypt.bcrypt.saltRounds',
    );

    return bcryptjs.hash(password, saltRounds);
  }
}
