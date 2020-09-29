import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { SignInDto } from './dto/sign-in.dto';
import { UserWithTokenSerializer } from './serializers/user-with-token.serializer';
import { SessionEntity } from '../sessions/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private sessionsService: SessionsService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UserWithTokenSerializer> {
    const { email } = signUpDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const newUser = await this.usersService.createUser(signUpDto);
    const newSession = await this.sessionsService.createSession(newUser);
    const newToken = this.sessionsService.createToken(newSession);

    return { user: newUser, token: newToken };
  }

  async signIn(userCredentials: SignInDto): Promise<UserWithTokenSerializer> {
    const { email, password } = userCredentials;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const isRightPassword = await this.usersService.comparePasswords(
      password,
      user.passwordHash,
    );
    if (!isRightPassword) {
      throw new ForbiddenException(`Password is incorrect`);
    }

    const session = await this.sessionsService.createSession(user);
    const token = this.sessionsService.createToken(session);

    return { user, token };
  }

  async signOut(session: SessionEntity): Promise<void> {
    await this.sessionsService.removeSession(session);
  }
}
