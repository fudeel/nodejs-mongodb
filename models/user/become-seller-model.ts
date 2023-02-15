export interface BecomeSellerModel {
    requesterId: string;
}

export interface ValidSocialNetworkModel {
    profile: string;
    social: string;
    status: '' | 'PENDING' | 'VERIFIED' | 'DENIED' | null;
}