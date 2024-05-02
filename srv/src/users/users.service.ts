import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { PaginatedUsersDto } from './users.response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  /**
    * @param {Number} page - номер страницы
    * @param {Number} itemCount - количество юзеров на странице
    * @returns {Promise<PaginatedUsersDto>} - Возвращает Promise страницу юзеров и максимальное количество страниц
  */
  async getUsersPage(page: number, itemCount: number): Promise<PaginatedUsersDto> {
    try {
      const offset = (page - 1) * itemCount; 
      const users: UsersEntity[] = await this.usersRepo.find({
        take: itemCount,
        skip: offset
      });
      const usersCount = await this.usersRepo.count();
      const totalPagesCount = Math.ceil(usersCount/itemCount);
      return { users, totalPagesCount }
    } catch(e) {
      throw new Error(e.message);
    }
  }
}
