export interface AddressModel {
  country: CountryModel,
  state: StateModel,
  city: City,
  zip: string,
  streetOne: string,
  streetTwo?: string
}

export interface CountryModel {
  id: number,
  iso2: string,
  name: string,
  iso3?: string,
  phoneCode?: string,
  capital?: string,
  currency?: string,
  native?: string,
  emoji?: string,
  emojiU?: string
}

export interface StateModel {
  id: string,
  name: string,
  iso2: string,
  country_id?: string,
  country_code?: string
}

export interface City {
  id: string,
  name: string
}
