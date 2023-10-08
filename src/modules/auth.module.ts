import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthFactory } from "src/common/jwt/jwt_auth.factory";
import { AuthService } from "src/services/auth.service";

@Module({
    providers: [
        AuthService,
        JwtAuthFactory,
        JwtService,
    ],
    exports: [
        AuthService, 
        JwtAuthFactory, 
    ],
})
export class AuthModule {}