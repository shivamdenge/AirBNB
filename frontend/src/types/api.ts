export interface ApiError {
  status: string;
  message: string;
  subErrors?: string[];
}

export interface ApiResponse<T> {
  timeStamp: string;
  data: T;
  error: ApiError | null;
}

export interface UserDto {
  id: number;
  email: string;
  name: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
}

export interface LoginResponseDto {
  accessToken: string;
}

export interface HotelDto {
  id: number;
  name: string;
  city: string;
  photos?: string[];
  amenities?: string[];
  active: boolean;
}

export interface RoomDto {
  id: number;
  type: string;
  basePrice: number;
  totalCount: number;
  capacity: number;
}

export interface HotelInfoDto {
  hotel: HotelDto;
  rooms: RoomDto[];
}

export interface HotelPriceDto {
  hotel: HotelDto;
  price: number;
}

export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface BookingDto {
  id: number;
  roomsCount: number;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  amount: number;
}
