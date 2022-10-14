export interface IFeatures {
  id?: number;
  description?: string | null;
  route?: string | null;
}

export class Features implements IFeatures {
  constructor(
    public id?: number,
    public description?: string | null,
    public route?: string | null
  ) {}
}

export function getFeaturesIdentifier(features: IFeatures): number | undefined {
  return features.id;
}
