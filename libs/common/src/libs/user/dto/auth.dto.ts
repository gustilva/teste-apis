import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { AccountRole } from '../../app-config/roles.enum';


export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    email!: string;

    @ApiProperty()
    @IsNotEmpty()
    password!: string;
}

export class LoginResponse {
    @ApiProperty()
    accessToken!: string;

    @ApiProperty()
    refreshToken!: string;

    @ApiProperty()
    userRole!: AccountRole;

    @ApiProperty()
    userId!: number;

    @ApiProperty()
    userName!: string;

    @ApiProperty()
    userEmail!: string;
}

export class LogoutDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId!: number;
}

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    email!: string;
}

export type ResendConfirmationEmailDto = Pick<ResetPasswordDto, 'email'>;


export class ConfirmAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    email!: string;

    @ApiProperty()
    @IsNotEmpty()
    token!: string;
}

export class ConfirmPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    userId!: number;

    @ApiProperty()
    @IsNotEmpty()
    token!: string;

    @ApiProperty()
    @IsNotEmpty()
    newPassword!: string;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId!: number;

    @ApiProperty()
    @IsNotEmpty()
    refreshToken!: string;
}

export class RefreshTokenResponse {
    @ApiProperty()
    accessToken!: string;
}
