import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { AuthRepository } from "../repositories/auth.repository";
import { PrismaService } from "../prisma/prisma.service"; 

@Module({
	controllers: [AuthController],
	providers: [AuthService, AuthRepository, PrismaService],
	exports: [AuthService, PrismaService], // Exporta serviços para outros módulos
})
export class AuthModule {}
