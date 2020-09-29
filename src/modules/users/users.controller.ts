import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { DUser } from 'src/shared/decorators/user.decorator';
import { UserEntity } from './user.entity';
import { BearerGuard } from 'src/shared/guards/bearer.guard';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { UserSerializer } from './serializers/user.serializer';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('users')
@UseGuards(BearerGuard)
@UseInterceptors(new ResponseInterceptor(UserSerializer))
@ApiTags('Users Controller')
@ApiBearerAuth()
export class UsersController {
  @Get('current')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiOkResponse({ description: 'Logged user returned', type: UserSerializer })
  async getLoggedUser(@DUser() user: UserEntity): Promise<UserSerializer> {
    return user;
  }
}
