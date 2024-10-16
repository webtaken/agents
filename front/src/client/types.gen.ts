// This file is auto-generated by @hey-api/openapi-ts

/**
 * Serializer for JWT authentication.
 */
export type JWT = {
    access: string;
    refresh: string;
    user: UserDetails;
};

export type Login = {
    username?: string;
    email?: string;
    password: string;
};

/**
 * User model w/o password
 */
export type PatchedUserDetails = {
    readonly pk?: number;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     */
    username?: string;
    readonly email?: string;
    first_name?: string;
    last_name?: string;
};

export type Register = {
    username: string;
    email: string;
    password1: string;
    password2: string;
};

export type RestAuthDetail = {
    readonly detail: string;
};

export type SocialLogin = {
    access_token?: string;
    code?: string;
    id_token?: string;
};

export type TokenRefresh = {
    readonly access: string;
    refresh: string;
};

export type TokenVerify = {
    token: string;
};

/**
 * User model w/o password
 */
export type UserDetails = {
    readonly pk: number;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     */
    username: string;
    readonly email: string;
    first_name?: string;
    last_name?: string;
};

export type VerifyEmail = {
    key: string;
};

export type AuthGoogleCreateData = {
    requestBody?: SocialLogin;
};

export type AuthGoogleCreateResponse = SocialLogin;

export type AuthLoginCreateData = {
    requestBody: Login;
};

export type AuthLoginCreateResponse = JWT;

export type AuthLogoutCreateResponse = RestAuthDetail;

export type AuthRegisterCreateData = {
    requestBody: Register;
};

export type AuthRegisterCreateResponse = JWT;

export type AuthRegisterVerifyEmailCreateData = {
    requestBody: VerifyEmail;
};

export type AuthRegisterVerifyEmailCreateResponse = RestAuthDetail;

export type AuthTokenRefreshCreateData = {
    requestBody: TokenRefresh;
};

export type AuthTokenRefreshCreateResponse = TokenRefresh;

export type AuthTokenVerifyCreateData = {
    requestBody: TokenVerify;
};

export type AuthTokenVerifyCreateResponse = TokenVerify;

export type AuthUserRetrieveResponse = UserDetails;

export type AuthUserUpdateData = {
    requestBody: UserDetails;
};

export type AuthUserUpdateResponse = UserDetails;

export type AuthUserPartialUpdateData = {
    requestBody?: PatchedUserDetails;
};

export type AuthUserPartialUpdateResponse = UserDetails;

export type $OpenApiTs = {
    '/api/auth/google/': {
        post: {
            req: AuthGoogleCreateData;
            res: {
                200: SocialLogin;
            };
        };
    };
    '/api/auth/login/': {
        post: {
            req: AuthLoginCreateData;
            res: {
                200: JWT;
            };
        };
    };
    '/api/auth/logout/': {
        post: {
            res: {
                200: RestAuthDetail;
            };
        };
    };
    '/api/auth/register/': {
        post: {
            req: AuthRegisterCreateData;
            res: {
                201: JWT;
            };
        };
    };
    '/api/auth/register/verify-email': {
        post: {
            req: AuthRegisterVerifyEmailCreateData;
            res: {
                200: RestAuthDetail;
            };
        };
    };
    '/api/auth/token/refresh/': {
        post: {
            req: AuthTokenRefreshCreateData;
            res: {
                200: TokenRefresh;
            };
        };
    };
    '/api/auth/token/verify/': {
        post: {
            req: AuthTokenVerifyCreateData;
            res: {
                200: TokenVerify;
            };
        };
    };
    '/api/auth/user/': {
        get: {
            res: {
                200: UserDetails;
            };
        };
        put: {
            req: AuthUserUpdateData;
            res: {
                200: UserDetails;
            };
        };
        patch: {
            req: AuthUserPartialUpdateData;
            res: {
                200: UserDetails;
            };
        };
    };
};