export interface ActivationCode {
    error?: boolean,
    message?: string,
    code: number | null,
    expiry: Date | null
}