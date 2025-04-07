import { UserRole } from "@/enums/model";

export type Timestamps = {
  created_utc: string;
  updated_utc: string;
};

export interface IEmpRegister extends Timestamps {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  avatar_url: string;
  is_approved: boolean;
}

export interface IUser extends Timestamps {
  _id: string;
  username: string;
  fullname: string;
  role: UserRole;
}

export interface IProvince extends Timestamps {
  _id: string;
  name: string;
}

export interface IOutlet extends Timestamps {
  _id: string;
  name: string;
  address: string;
  gps: { lat: number; lng: number; radius: number };
}

export interface IGift extends Timestamps {
  _id: string;
  code: string;
  label: string;
  image_url: string;
}

export interface IGiftsSet extends Timestamps {
  _id: string;
  order: number;
}

export interface IGameSession {
  id: string;
  nickname: string;
  mode: string;
  status: string;
  result: string;
  billImageUrl: string;
  createdUtc: number;
  updatedUtc: number;
  hunter: {
    id: string;
    name: string;
    phone: string;
    createdUtc: number;
    updatedUtc: number;
  };
  outlet: {
    id: string;
    name: string;
    address: string;
    gps: {
      lat: number;
      lng: number;
      radius: number;
    };
    province: {
      id: string;
      name: string;
      createdUtc: number;
      updatedUtc: number;
    };
    createdUtc: number;
    updatedUtc: number;
  };
  purchases: {
    packageType: string;
    beerType: string;
    quantity: number;
  }[];
  collected: {
    name: string;
    count: number;
  }[];
  rewardGift: {
    id?: string;
    code?: string;
    label?: string;
    imgUrl?: string;
    createdUtc?: number;
    updatedUtc?: number;
  } | null;
}

export interface IPaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export interface IOutlet {
  id: string;
  name: string;
  address: string;
  province: {
    name: string;
  };
  boothType: string;
}

export interface BaseResponse<T> {
  message: string;
  status: number;
  data: T;
}


