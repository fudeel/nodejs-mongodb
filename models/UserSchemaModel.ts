import {SocialNetworkModel} from "./user/social-network-model";

export interface UserSchemaModel {
    userId: string;
    accesstoken: string | null;
    username: string;
    fullname: string;
    email: string;
    active: boolean;
    basicInfoAvailableToChange: boolean;
    userMustInsertShippingAddress: boolean;
    password: string;
    resetPasswordToken: number | null;
    resetPasswordExpires: Date | null;
    isCertified: boolean;
    pic: string;
    role: string;
    occupation: string;
    companyName: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    socialNetwork: SocialNetworkModel;
    becomeSellerRequest: null | 'PENDING' | 'DENIED';
    firstname: string;
    lastname: string;
    website: string;
    language: string;
    timeZone: string;
    communication: {
        homePhone: string;
        personalPhone: string;
        workPhone: string;
    };
    emailSettings: {
        getNotification: boolean;
    };
    sellingItems: string[];
    emailToken: number | null;
    emailTokenExpires: Date | null;
    referralCode: string;
    referrer: string;

    save?: any;
}