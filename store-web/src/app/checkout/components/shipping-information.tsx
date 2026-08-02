'use client'

import ShippingDropdownList from '@/app/checkout/components/shipping-dropdown-list'
import InputField from '@/components/input-field'
import Header3 from '@/components/typography/header3'
import React, { useState } from 'react'

import DISTRICT_LIST from '@/assets/data/api_district.json'
import PROVINCE_LIST from '@/assets/data/api_province.json'
import SUB_DISTRICT_LIST from '@/assets/data/api_sub_district.json'
import useOrderStore from '@/hooks/use-order-store'

// ----------------------------------------------------------------------

export type ProvinceType = {
  id: number
  name_th: string
  name_en: string
  geography_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type DistrictType = {
  id: number
  name_th: string
  name_en: string
  province_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type SubDistrictType = {
  id: number
  zip_code: number
  name_th: string
  name_en: string
  amphure_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

const ShippingInformation = () => {
  const { setShippingInformation, errors, setErrors } = useOrderStore((state) => state)

  const [provinceList] = useState<ProvinceType[]>(PROVINCE_LIST)
  const [districtList, setDistrictList] = useState<DistrictType[]>([])
  const [subDistrictList, setSubDistrictList] = useState<SubDistrictType[]>([])
  const [addressInfo, setAddressInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    mobileNumber: '',
    provinceId: 0,
    provinceName: '',
    districtId: 0,
    districtName: '',
    subDistrictId: 0,
    subDistrictName: '',
    zipCode: 0,
    focused: ''
  })

  const handleInputFocus = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    const newAddressInfo = {
      ...addressInfo,
      focused: target.name
    }
    setAddressInfo(newAddressInfo)

    // Save Shipping Information on Checkout Store
    setShippingInformation(newAddressInfo)
  }

  const handleAddressInputChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>) => {
    const newAddressInfo = { ...addressInfo }
    if (target.name === 'firstName') {
      newAddressInfo.firstName = target.value
    } else if (target.name === 'lastName') {
      newAddressInfo.lastName = target.value
    } else if (target.name === 'address') {
      newAddressInfo.address = target.value
    } else if (target.name === 'mobileNumber') {
      newAddressInfo.mobileNumber = target.value
    }

    setAddressInfo(newAddressInfo)
    setShippingInformation(newAddressInfo)

    // Clear error locally on type
    if (errors[target.name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [target.name]: ''
      })
    }
  }

  const handleAddressSelectChange = (selected: {
    id: number
    field: string
  }) => {
    if (selected.field === 'province') {
      const province = PROVINCE_LIST.filter((p: any) =>
        p.id === selected.id ? p : null
      )

      const newProvinceInformation = {
        ...addressInfo,
        provinceId: selected.id,
        provinceName: province[0].name_th
      }

      setAddressInfo(newProvinceInformation)
      setShippingInformation(newProvinceInformation)

      getDistrictList(selected.id)
    } else if (selected.field === 'district') {
      const district = DISTRICT_LIST.filter((d: any) =>
        d.id === selected.id ? d : null
      )

      const newDistrictInformation = {
        ...addressInfo,
        districtId: selected.id,
        districtName: district[0].name_th,
        zipCode: 0
      }

      setAddressInfo(newDistrictInformation)
      setShippingInformation(newDistrictInformation)

      getSubDistrictList(selected.id)
    } else if (selected.field === 'subDistrict') {
      const subDistrict = SUB_DISTRICT_LIST.filter((d: any) =>
        d.id === selected.id ? d : null
      )

      const newSubDistrictInformation = {
        ...addressInfo,
        subDistrictId: selected.id,
        subDistrictName: subDistrict[0].name_th,
        zipCode: subDistrict[0].zip_code
      }

      setAddressInfo(newSubDistrictInformation)
      setShippingInformation(newSubDistrictInformation)
    }
  }

  const getDistrictList = (provinceId: number) => {
    const district = DISTRICT_LIST.filter((d: DistrictType) =>
      d.province_id === provinceId ? d : null
    )
    setDistrictList(district)
  }

  const getSubDistrictList = (districtId: number) => {
    const subDistrict = SUB_DISTRICT_LIST.filter((d: any) =>
      d.amphure_id === districtId ? d : null
    )
    setSubDistrictList(subDistrict)
  }

  return (
    <div className="mb-6 border-b border-gray-200 pb-6">
      <Header3>Shipping information</Header3>

      <div className="grid gap-6 mb-2 md:grid-cols-2">
        <div>
          <InputField
            id="shipping-form-first-name"
            label="First name"
            type="text"
            name="firstName"
            placeholder="first name"
            required
            onChange={handleAddressInputChange}
            onFocus={handleInputFocus}
          />
          {errors.firstName && (
            <span
              id="shipping-first-name-error-txt"
              className="text-[10px] font-light text-red-500 mt-1 block"
            >
              {errors.firstName}
            </span>
          )}
        </div>

        <div>
          <InputField
            id="shipping-form-last-name"
            label="Last name"
            type="text"
            name="lastName"
            placeholder="last name"
            required
            onChange={handleAddressInputChange}
            onFocus={handleInputFocus}
          />
          {errors.lastName && (
            <span
              id="shipping-last-name-error-txt"
              className="text-[10px] font-light text-red-500 mt-1 block"
            >
              {errors.lastName}
            </span>
          )}
        </div>
      </div>

      <div className="mb-2">
        <InputField
          id="shipping-form-address"
          label="Address (Building, Street, etc.)"
          type="text"
          name="address"
          placeholder="address"
          required
          maxLength={150}
          onChange={handleAddressInputChange}
          onFocus={handleInputFocus}
        />
        {errors.address && (
          <span
            id="shipping-address-error-txt"
            className="text-[10px] font-light text-red-500 mt-1 block"
          >
            {errors.address}
          </span>
        )}
      </div>

      <ShippingDropdownList
        id="shipping-form-province"
        label="Province: "
        list={provinceList}
        name="province"
        setSelected={handleAddressSelectChange}
      />

      <ShippingDropdownList
        id="shipping-form-district"
        label="District: "
        list={districtList}
        name="district"
        setSelected={handleAddressSelectChange}
      />

      <ShippingDropdownList
        id="shipping-form-sub-district"
        label="Sub-district: "
        list={subDistrictList}
        name="subDistrict"
        setSelected={handleAddressSelectChange}
      />

      <InputField
        id="shipping-form-zipcode"
        label="Zipcode"
        type="text"
        name="zipCode"
        placeholder="zipcode"
        maxLength={5}
        value={addressInfo.zipCode ? addressInfo.zipCode.toString() : ''}
        readOnly
        disabled
      />

      <div className="mt-2">
        <InputField
          id="shipping-form-mobile"
          label="Mobile number (For Contact)"
          type="tel"
          name="mobileNumber"
          placeholder="0923456789"
          maxLength={10}
          onChange={handleAddressInputChange}
          onFocus={handleInputFocus}
          required
        />
        {errors.mobileNumber && (
          <span
            id="shipping-mobile-error-txt"
            className="text-[10px] font-light text-red-500 mt-1 block"
          >
            {errors.mobileNumber}
          </span>
        )}
      </div>
    </div>
  )
}

export default ShippingInformation
