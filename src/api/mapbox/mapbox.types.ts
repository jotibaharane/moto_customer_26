export interface MapboxFeature {
  place_name: string;
  context: {
    id: string;
    text: string;
  }[];
}

export interface MapboxResponse {
  features: MapboxFeature[];
}
