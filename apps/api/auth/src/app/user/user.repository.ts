import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@spesia/api-shared';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createUser(request: UserEntity): Promise<UserEntity> {
        const user = this.userRepository.create(request);

        return this.userRepository.save(user);
    }

    async updateUser(id: number, request: UserEntity): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id } });

        return this.userRepository.save({ ...user, ...request });
    }

    async findById(id: number): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async findByName(name: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { name } });
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email } });
    }
}
