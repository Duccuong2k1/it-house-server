import axios from "axios";
import config from "next/config";

export interface GoongAutocompletePlace {
  description: string;
  matched_substrings: string[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: string[];
  has_children: boolean;
  display_type: string;
  score: number;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
}

export interface GoongPlaceDetail {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
}

export interface GooongGeocodePlace {
  address_components: {
    long_name: string;
    short_name: string;
  }[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  reference: string;
  types: string[];
}

export class GoongGeocoder {
  private static _instance: GoongGeocoder;
  static get instance() {
    if (!this._instance) this._instance = new GoongGeocoder();
    return this._instance;
  }
  apiKey = "";
  mapKey = "";
  hostName = `https://rsapi.goong.io`;

  hashedData = {};
  constructor() {
    const {
      publicRuntimeConfig: {
        goongjs: { apiKey, mapKey },
      },
    } = config();
    this.apiKey = apiKey;
    this.mapKey = mapKey;
  }

  async geocode(address: string = ""): Promise<GooongGeocodePlace[]> {
    const uri = `${this.hostName}/geocode`;
    const params = {
      api_key: this.apiKey,
      address,
    };
    const hashedString = JSON.stringify({ uri, params });
    if (this.hashedData[hashedString]) return this.hashedData[hashedString];
    else
      return axios
        .get(uri, {
          params,
        })
        .then((res) => {
          this.hashedData[hashedString] = res.data.results;
          console.log(res.data);
          return res.data.results;
        })
        .catch((err) => null);
  }

  async getPlaces(fullAddress: string = ""): Promise<GoongAutocompletePlace[]> {
    const uri = `${this.hostName}/Place/AutoComplete`;
    const params = {
      api_key: this.apiKey,
      input: fullAddress,
      limit: 20,
      location: "10.762622,106.660172",
    };
    const hashedString = JSON.stringify({ uri, params });
    if (this.hashedData[hashedString]) return this.hashedData[hashedString];
    else
      return axios
        .get(uri, {
          params,
        })
        .then((res) => {
          this.hashedData[hashedString] = res.data.predictions;
          return res.data.predictions;
        })
        .catch((err) => null);
  }

  async getPlaceDetail(placeId: string = ""): Promise<GoongPlaceDetail> {
    const uri = `${this.hostName}/Place/Detail`;
    const params = {
      api_key: this.apiKey,
      place_id: placeId,
    };
    const hashedString = JSON.stringify({ uri, params });
    if (this.hashedData[hashedString]) return this.hashedData[hashedString];
    else
      return axios
        .get(uri, {
          params,
        })
        .then((res) => {
          this.hashedData[hashedString] = res.data.predictions;
          return res.data.result;
        })
        .catch((err) => null);
  }
  async getPlaceDetailByLatLg(lat: any, lg: any): Promise<GoongPlaceDetail[]> {
    const uri = `${this.hostName}/Geocode`;
    const params = {
      api_key: this.apiKey,
      latlng: `${lat},${lg}`,
    };
    const hashedString = JSON.stringify({ uri, params });
    if (this.hashedData[hashedString]) return this.hashedData[hashedString];
    else
      return axios
        .get(uri, {
          params,
        })
        .then((res) => {
          this.hashedData[hashedString] = res.data.results;
          console.log(res.data);
          return res.data.results;
        })
        .catch((err) => null);
  }
}
