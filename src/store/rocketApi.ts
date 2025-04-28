// src/store/rocketApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Rocket, RocketFormData } from '../types';

// In-memory storage for our fake backend
let rocketData: Rocket[] = [];
let idCounter = 1;

// Create the API slice
export const rocketApi = createApi({
  reducerPath: 'rocketApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Not used with our fake implementation
  tagTypes: ['Rocket'],
  endpoints: (builder) => ({
    getRockets: builder.query<Rocket[], void>({
      // Simulate fetching rockets from API
      queryFn: () => {
        // Simulate network delay
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: rocketData });
          }, 500);
        });
      },
      providesTags: ['Rocket'],
    }),
    
    addRocket: builder.mutation<Rocket, RocketFormData>({
      // Simulate adding a rocket
      queryFn: (rocketFormData) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              const newRocket: Rocket = {
                ...rocketFormData,
                id: (idCounter++).toString(),
              };
              rocketData = [...rocketData, newRocket];
              resolve({ data: newRocket });
            } catch (error) {
              reject({ error: 'Failed to add rocket' });
            }
          }, 500);
        });
      },
      invalidatesTags: ['Rocket'],
    }),
    
    updateRocket: builder.mutation<Rocket, { id: string; data: RocketFormData }>({
      // Simulate updating a rocket
      queryFn: ({ id, data }) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              const rocketIndex = rocketData.findIndex(rocket => rocket.id === id);
              if (rocketIndex === -1) {
                reject({ error: 'Rocket not found' });
                return;
              }
              
              const updatedRocket: Rocket = { ...data, id };
              rocketData = rocketData.map(rocket => 
                rocket.id === id ? updatedRocket : rocket
              );
              
              resolve({ data: updatedRocket });
            } catch (error) {
              reject({ error: 'Failed to update rocket' });
            }
          }, 500);
        });
      },
      invalidatesTags: ['Rocket'],
    }),
    
    deleteRocket: builder.mutation<void, string>({
      // Simulate deleting a rocket
      queryFn: (id) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              const rocketIndex = rocketData.findIndex(rocket => rocket.id === id);
              if (rocketIndex === -1) {
                reject({ error: 'Rocket not found' });
                return;
              }
              
              rocketData = rocketData.filter(rocket => rocket.id !== id);
              resolve({ data: undefined });
            } catch (error) {
              reject({ error: 'Failed to delete rocket' });
            }
          }, 500);
        });
      },
      invalidatesTags: ['Rocket'],
    }),
  }),
});

// Export hooks for using the API
export const {
  useGetRocketsQuery,
  useAddRocketMutation,
  useUpdateRocketMutation,
  useDeleteRocketMutation,
} = rocketApi;
