import { UserService } from './users.service';
import { Controller, Get, HttpException, HttpStatus, Logger, Query } from '@nestjs/common';
import {PaginatedUsersResponseDto, UsersResponseDto} from "./users.response.dto";

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getUsersPage(
    @Query('page') page: number,
    @Query('itemCount') itemCount: number
  ): Promise<PaginatedUsersResponseDto> {
    try {
      this.logger.log('Get users page');
      const paginatedUsers = await this.userService.getUsersPage(page, itemCount);
      const usersDto = paginatedUsers.users.map((user) => UsersResponseDto.fromUsersEntity(user));
      return {users: usersDto, totalPagesCount: paginatedUsers.totalPagesCount};
    } catch(e) {
      this.logger.log(`Error: ${e.message}`);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
