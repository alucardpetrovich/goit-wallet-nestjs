import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionsService } from 'src/modules/sessions/sessions.service';

@Injectable()
export class BearerGuard implements CanActivate {
  constructor(private sessionsService: SessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization ?? '';

    const token = authHeader.replace('Bearer ', '');
    const session = await this.sessionsService.findByToken(token);
    if (!session) {
      throw new UnauthorizedException();
    }

    request.user = session.user;
    request.session = session;

    return true;
  }
}
