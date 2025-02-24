import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import type { UserService } from "../services/user.service";
import { CreateUserSchema } from "../dto/create-user.dto";
import { UpdateUserSchema } from "../dto/update-user.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: unknown) {
    const parsedBody = CreateUserSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.message);
    }
    return this.userService.createUser(parsedBody.data);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }
    return user;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: unknown) {
    const parsedBody = UpdateUserSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.message);
    }
    return this.userService.updateUser(id, parsedBody.data);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }
    return this.userService.deleteUser(id);
  }
}
