import {Method} from "axios";
import firebase from "firebase/compat";
import functions = firebase.functions;

export interface UserSchemaModel {
    userId: string;
    accessToken: string | null;
    username: string;
    fullname: string;
    email: string;
    active: boolean;
    basicInfoAvailableToChange: boolean;
    shippingInfoAvailableToChange: boolean;
    password: string;
    resetPasswordToken: string | null;
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
    socialNetworks: {
        google: string
        facebook: string;
        instagram: string;
        linkedin: string;
        twitter: string;
        tiktok: string;
    };
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