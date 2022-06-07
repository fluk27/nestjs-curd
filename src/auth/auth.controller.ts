import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ) {
        
    }
    @UseGuards(LocalAuthGuard)
  @Post('/signin')
  singnIn(@Request() req: any): Promise<any> {
    return this.authService.login(req.user)
  }
}
