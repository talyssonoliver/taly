import { Module } from "@nestjs/common";
import { UserModule } from "./modules/user.module";
import { PlanModule } from "./plan/plan.module";
import { UserService } from "./services/user.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [UserModule, PlanModule],
  providers: [UserService, PrismaService],
})
export class AppModule {}
