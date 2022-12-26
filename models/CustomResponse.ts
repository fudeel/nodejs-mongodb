export interface CustomResponse {
    error?: boolean,
    success?: boolean,
    status?: number,
    message?: string,
    forceLogout?: boolean,
    accessToken?: string,
    idToken?: string,
    referralCode?: string
}