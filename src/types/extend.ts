import { IGift, IGiftsSet, IOutlet, IProvince } from "./model";

export type ProvinceDetails = IProvince & {
  outlets: IOutlet[];
};

export type GiftsSetDetails = IGiftsSet & {
  outlet: IOutlet;
  gifts: {
    gift: IGift;
    order: number;
    quantity: number;
    stock: number;
  }[];
};
