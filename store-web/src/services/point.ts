import axiosShoppingMallApi from '@/utils/axios'
import { handleServiceError } from '@/utils/helper'

// ------------------------------------------------

export type GetPointServiceResponse = {
  data?: {
    point: number
    pending_point: number
    approved_point: number
  }
  message?: string
}

const getPointService = async (): Promise<GetPointServiceResponse> => {
  try {
    const { data } = await axiosShoppingMallApi.get(`/api/v1/point`)
    return {
      data: data
    }
  } catch (error) {
    return handleServiceError(error)
  }
}

export default getPointService
