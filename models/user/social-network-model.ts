export interface SocialNetworkModel {
    instagram?: {
        profile: string | null,
        status: 'PENDING' | 'VERIFIED' | 'DENIED' | null,
    }
    tiktok?: {
        profile: string,
        status: 'PENDING' | 'VERIFIED' | 'DENIED' | null,
    },
    twitch?: {
        profile: string,
        status: 'PENDING' | 'VERIFIED' | 'DENIED' | null,
    },
    twitter?: {
        profile: string,
        status: 'PENDING' | 'VERIFIED' | 'DENIED' | null,
    }
}
