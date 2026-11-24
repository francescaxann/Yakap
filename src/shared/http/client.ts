import axios from 'axios'
import { z } from '@/shared/validation'

export const http = axios.create({ timeout: 15_000 })

const errorSchema = z.object({ error: z.string() })

export function requestStatus(error: unknown) {
  return axios.isAxiosError(error) ? error.response?.status : undefined
}

export function requestMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback
  return errorSchema.safeParse(error.response?.data).data?.error ?? fallback
}
