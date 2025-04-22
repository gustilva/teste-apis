import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AccountRole } from '../../app-config/roles.enum';


export class UserDto {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isConfirmed?: boolean;


    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(AccountRole)
    role: AccountRole = AccountRole.User;

    @ApiProperty()
    @IsOptional()
    password?: string;
}

export class GetUserByIdDto {
    @ApiProperty()
    @IsNotEmpty()
    id!: number;
}

export class UserResponseDto {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email!: string;
}

export type UserCreateResponse = UserResponseDto;
export type GetUserByIdResponse = UserResponseDto;
