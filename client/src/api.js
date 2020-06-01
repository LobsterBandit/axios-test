// import axios from 'axios'
import { useAxios } from './hooks/useAxios'

// const apiClient = axios.create({
//   baseURL: `http://0.0.0.0:${process.env.API_PORT}`,
//   withCredentials: true
// })

// export const getItems = async () => {
//   const response = await apiClient.get('/items')
//   return response.data
// }

// export const getItem = async (id) => {
//   const response = await apiClient.get(`/items/${id}`)
//   return response.data
// }

// export const ping = async () => {
//   const response = await apiClient.get('/ping')
//   return response.data
// }

export function useItems() {
  return useAxios('/items')
}

export function useItem(id) {
  return useAxios(`/item/${id}`)
}

export function usePing() {
  return useAxios('/ping')
}
