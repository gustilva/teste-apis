import { ResourceService } from '../services/resource.service';
import {
    ConfirmPasswordDto,
    LoginDto,
    LoginResponse,
    RefreshTokenDto,
    RefreshTokenResponse,
    ResetPasswordDto
} from '@spesia/common';


class AuthDataAccess extends ResourceService<LoginDto, LoginDto, LoginDto> {
    constructor() {
        super('auth');
    }

    async login(payload: LoginDto): Promise<LoginResponse> {
        return this.customEndpoint('POST', 'login', payload);
    }

    async refresh(payload: RefreshTokenDto): Promise<RefreshTokenResponse> {
        return this.customEndpoint('POST', 'refresh', payload);
    }

    async logout(payload: LoginDto): Promise<LoginDto> {
        return this.customEndpoint('POST', 'logout', payload);
    }

    async resetPassword(payload: ResetPasswordDto): Promise<any> {
        return this.customEndpoint('POST', 'reset-password', payload);
    }

    async confirmResetPassword(payload: ConfirmPasswordDto): Promise<any> {
        return this.customEndpoint('POST', `confirm-reset-password`, payload);
    }

}

export const authDataAccess = new AuthDataAccess();

export function replacePathArgs(path: string, args: Record<string, unknown>): string {
    let interpolated = path;

    for (const key of Object.keys(args)) {
        while (interpolated.includes(`/:${key}/`)) {
            interpolated = interpolated.replace(`/:${key}/`, `/${args[`${key}`]}/`);
        }

        while (interpolated.endsWith(`/:${key}`)) {
            interpolated = `${interpolated.slice(0, interpolated.length - key.length - 2)}/${args[`${key}`]}`;
        }
    }

    return interpolated;
}


/*
getById(id: number): Observable<CategoryDto> {
    return this.http.get(
        replacePathArgs(CategoriesCmsEndpointPaths.getById, {
            id,
        }),
    );
}*/
