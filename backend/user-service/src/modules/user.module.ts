import { Module } from "@nestjs/common";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { PlanModule } from "../plan/plan.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [PlanModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
