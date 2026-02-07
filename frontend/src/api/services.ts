import { http, tokenStore, unwrap } from './client';
import type {
  BookingDto,
  HotelInfoDto,
  HotelPriceDto,
  LoginResponseDto,
  Page,
  UserDto
} from '../types/api';

export const api = {
  signup: (payload: { email: string; password: string; name: string }) =>
    unwrap<UserDto>(http.post('/auth/signup', payload)),

  login: async (payload: { email: string; password: string }) => {
    const data = await unwrap<LoginResponseDto>(http.post('/auth/login', payload));
    tokenStore.set(data.accessToken);
    return data;
  },

  getProfile: () => unwrap<UserDto>(http.get('/users/profile')),

  updateProfile: (payload: Partial<Pick<UserDto, 'name' | 'gender' | 'dateOfBirth'>>) =>
    unwrap<void>(http.patch('/users/profile', payload)),

  getMyBookings: () => unwrap<BookingDto[]>(http.get('/users/myBookings')),

  searchHotels: (payload: {
    city: string;
    startDate: string;
    endDate: string;
    roomsCount: number;
    page?: number;
    size?: number;
  }) => unwrap<Page<HotelPriceDto>>(http.get('/hotels/search', { data: payload })),

  getHotelInfo: (hotelId: string) => unwrap<HotelInfoDto>(http.get(`/hotels/${hotelId}/info`)),

  createBooking: (payload: {
    hotelId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    roomsCount: number;
  }) => unwrap<BookingDto>(http.post('/bookings/init', payload)),

  initiatePayment: (bookingId: number) => unwrap<{ sessionUrl: string }>(http.post(`/bookings/${bookingId}/payments`)),

  getManagerHotels: () => unwrap<any[]>(http.get('/admin/hotels'))
};
