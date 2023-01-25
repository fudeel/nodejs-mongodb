export interface CustomResponse {
    error?: boolean,
    success?: boolean,
    status?: number,
    message?: string,
    forceLogout?: boolean,
    accesstoken?: string,
    idToken?: string,
    referralCode?: string,
    user?: any
}