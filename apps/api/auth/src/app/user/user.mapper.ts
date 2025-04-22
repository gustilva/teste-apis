import { Injectable } from '@nestjs/common';
import { AccountRole, UserDto } from '@spesia/common';
import { UserEntity } from '@spesia/api-shared';


@Injectable()
export class UserMapper {

    async entityToDto(entity: UserEntity): Promise<UserDto> {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            password: entity.password,
            role: entity.role as AccountRole,
        };
    }

    async entitiesToDTOs(input: UserEntity[]): Promise<UserDto[]> {
        return Promise.all(input.map(next => this.entityToDto(next)));
    }

}
