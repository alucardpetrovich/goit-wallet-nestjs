import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionEntity } from './session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionsRepository: Repository<SessionEntity>,
    private configService: ConfigService,
  ) {}

  async findByToken(token: string): Promise<SessionEntity | null> {
    const jwtSecret = this.configService.get<string>('encrypt.jwt.secret');

    let sid: string;
    try {
      sid = (jwt.verify(token, jwtSecret) as any).sid;
    } catch (err) {
      return null;
    }

    const session = await this.sessionsRepository.findOne(sid, {
      relations: ['user'],
    });
    if (!session) {
      return null;
    }

    return session;
  }

  async createSession(user: UserEntity): Promise<SessionEntity> {
    return this.sessionsRepository.save({ user });
  }

  async removeSession(session: SessionEntity): Promise<void> {
    await this.sessionsRepository.remove(session);
  }

  createToken(session: SessionEntity): string {
    const tokenPayload: JwtPayload = { sid: session.id };
    const jwtSecret = this.configService.get<string>('encrypt.jwt.secret');
    const expiresIn = this.configService.get<number>('encrypt.jwt.expiresIn');

    return jwt.sign(tokenPayload, jwtSecret, { expiresIn });
  }
}
