import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserWithTokenSerializer } from './serializers/user-with-token.serializer';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { DSession } from 'src/shared/decorators/session.decorator';
import { SessionEntity } from '../sessions/session.entity';
import { BearerGuard } from 'src/shared/guards/bearer.guard';

@Controller('auth')
@ApiTags('Auth Controller')
@UseInterceptors(new ResponseInterceptor(UserWithTokenSerializer))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiConflictResponse({ description: 'User with such email already exists' })
  @ApiCreatedResponse({
    description: 'New User Registered',
    type: UserWithTokenSerializer,
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserWithTokenSerializer> {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in existing user' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'User with such email not found' })
  @ApiForbiddenResponse({ description: 'Provided password is incorrect' })
  @ApiCreatedResponse({
    description: 'Created session for existing user',
    type: UserWithTokenSerializer,
  })
  async signIn(@Body() signInDto: SignInDto): Promise<UserWithTokenSerializer> {
    return this.authService.signIn(signInDto);
  }

  @Delete('sign-out')
  @UseGuards(BearerGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Signs out user' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiNoContentResponse({ description: 'User signed out' })
  async signOut(@DSession() session: SessionEntity): Promise<void> {
    return this.authService.signOut(session);
  }
}
