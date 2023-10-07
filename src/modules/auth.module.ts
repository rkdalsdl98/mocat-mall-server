import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtAuthFactory } from "src/common/jwt/jwt_auth.factory";
import { AuthService } from "src/services/auth.service";

@Module({
    providers: [
        AuthService,
        JwtAuthFactory,
        {
            provide: "JwtService",
            useClass: JwtService,
        },
    ],
    exports: [
        AuthService, 
        JwtAuthFactory, 
    ],
})
export class AuthModule {}