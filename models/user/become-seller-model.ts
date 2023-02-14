import {UpdateBasicInfoModel} from "./update-basic-info-model";
import {UpdateShippingAddressInfoModel} from "./update-shipping-address-info-model";

export interface BecomeSellerModel {
    addressInfo: UpdateShippingAddressInfoModel;
    basicInfo: UpdateBasicInfoModel;
    validSocialNetworks: ValidSocialNetworkModel[];
    email?: string;
    requesterId: string;
}

export interface ValidSocialNetworkModel {
    profile: string;
    social: string;
    status: '' | 'PENDING' | 'VERIFIED' | 'DENIED' | null;
}