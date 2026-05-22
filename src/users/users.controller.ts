import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { UserRecommendationsOutDto } from './dto/user-recommendations-out.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserOutDto } from './dto/user-out.dto';
import { AddFollowingDto } from './dto/add-following.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get(':identifier/recommendations')
  async getRecommendations(
    @Param('identifier') identifier: string
  ): Promise<UserRecommendationsOutDto> {
    return this.userService.getRecommendations(identifier);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserOutDto> {
    return this.userService.create(dto);
  }

  @Get()
  async getAllUsers(): Promise<UserOutDto[]> {
    return this.userService.findAll();
  }

  @Get(':identifier')
  async getUserById(@Param('identifier') identifier: string): Promise<UserOutDto> {
    return this.userService.findByIdentifier(identifier);
  }

  @Post(':identifier/follow')
  async addFollowing(
    @Param('identifier') identifier: string,
    @Body() dto: AddFollowingDto
  ): Promise<UserOutDto> {
    return this.userService.addFollowing(identifier, dto);
  }
}