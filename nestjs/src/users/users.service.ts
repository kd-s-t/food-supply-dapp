import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      username: 'test',
      password: bcrypt.hashSync('password123', 10),
    },
  ];

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }
}
