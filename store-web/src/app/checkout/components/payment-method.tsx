'use client'

import MastercardIcon from '@/components/icons/mastercard'
import VisaIcon from '@/components/icons/visa'
import Image from '@/components/image'
import InputField from '@/components/input-field'
import Header3 from '@/components/typography/header3'
import useOrderStore from '@/hooks/use-order-store'
import {
  formatCVV,
  formatCreditCardNumber,
  formatExpirationDate
} from '@/utils/credit-cart-format'
import { useState } from 'react'

// ----------------------------------------------------------------------

const CreditCardProvider = {
  VISA: 'VISA',
  MASTERCARD: 'MASTERCARD'
}

type CardInfoTypes = {
  number: string
  name: string
  expiry: string
  cvv: string
  issuer: string
  focused: string
}

const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState(1) // 1. credit/debit 2.linepay
  const [cardProvider, setCardProvider] = useState('')
  const [cardInfo, setCardInfo] = useState<CardInfoTypes>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    issuer: '',
    focused: ''
  })

  const { setPaymentInformation, errors, setErrors } = useOrderStore((state) => state)

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(Number(event.target.value))
  }

  const handleInputFocus = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    const newCardInfo = {
      ...cardInfo,
      focused: target.name
    }
    setCardInfo(newCardInfo)
    setPaymentInformation(newCardInfo)
  }

  const handleCardNumberChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>) => {
    const newCardInfo = { ...cardInfo }
    if (target.name === 'fullname') {
      newCardInfo.name = target.value
    } else if (target.name === 'number') {
      let provider = ''
      if (target.value.startsWith('5')) {
        provider = CreditCardProvider.MASTERCARD
        setCardProvider(CreditCardProvider.MASTERCARD)
      } else if (target.value.startsWith('4')) {
        provider = CreditCardProvider.VISA;
        setCardProvider(CreditCardProvider.VISA)
      } else {
        setCardProvider('')
      }

      target.value = formatCreditCardNumber(target.value)
      newCardInfo.number = target.value
      newCardInfo.issuer = provider
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      newCardInfo.expiry = target.value
    } else if (target.name === 'cvv') {
      target.value = formatCVV(target.value)
      newCardInfo.cvv = target.value
    }

    setCardInfo(newCardInfo)
    setPaymentInformation(newCardInfo)

    // Clear local error on change
    const fieldMap: Record<string, string> = {
      fullname: 'cardName',
      number: 'cardNumber',
      expiry: 'cardExpiry',
      cvv: 'cardCvv'
    }
    const errorKey = fieldMap[target.name]
    if (errorKey && errors[errorKey as keyof typeof errors]) {
      setErrors({
        ...errors,
        [errorKey]: ''
      })
    }
  }

  return (
    <div className="mb-6 border-b border-gray-200 pb-2">
      <Header3>Payment</Header3>

      <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 text-gray-800 font-light mb-6">
        {/* Credit/Debit Card */}
        <div className="w-full p-3 border-b border-gray-200">
          <label
            htmlFor="payment-credit-input"
            className="flex items-center cursor-pointer text-sm font-bold text-gray-900"
          >
            <input
              id="payment-credit-input"
              type="radio"
              name="payment-method"
              value="credit-card"
              className="form-radio h-5 w-5 text-indigo-500 mr-2"
              onChange={handlePaymentMethodChange}
              checked={paymentMethod === 1}
            />
            Credit Card / Debit Card
          </label>

          <div className={paymentMethod === 1 ? 'mt-5' : 'hidden'}>
            <div className="mb-3">
              <InputField
                id={`payment-credit-form-fullname`}
                type="text"
                label="Name on card"
                name="fullname"
                placeholder="John Smith"
                onChange={handleCardNumberChange}
                onFocus={handleInputFocus}
              />
              {errors.cardName && (
                <span
                  id="payment-card-name-error-txt"
                  className="text-[10px] font-light text-red-500 mt-1 block"
                >
                  {errors.cardName}
                </span>
              )}
            </div>

            <div className="mb-3 -mx-2 flex items-center">
              <div className="px-2 w-3/4">
                <InputField
                  id={`payment-credit-form-card-number`}
                  type="text"
                  label="Card number"
                  name="number"
                  placeholder="0000 0000 0000 0000"
                  pattern="[0-9\s]{16,22}"
                  maxLength={19}
                  onChange={handleCardNumberChange}
                  onFocus={handleInputFocus}
                />
                {errors.cardNumber && (
                  <span
                    id="payment-card-number-error-txt"
                    className="text-[10px] font-light text-red-500 mt-1 block"
                  >
                    {errors.cardNumber}
                  </span>
                )}
              </div>
              <div className="px-2 w-1/4">
                <div
                  id={`payment-credit-form-provider`}
                  className="flex items-center gap-2 mt-5"
                >
                  <VisaIcon
                    width={48}
                    height={32}
                    className={
                      cardProvider !== CreditCardProvider.VISA
                        ? 'grayscale'
                        : ''
                    }
                  />
                  <MastercardIcon
                    width={56}
                    height={32}
                    className={
                      cardProvider !== CreditCardProvider.MASTERCARD
                        ? 'grayscale'
                        : ''
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mb-3 -mx-2 flex items-start">
              <div className="px-2 w-1/3">
                <InputField
                  id={`payment-credit-form-expiry`}
                  type="text"
                  label="Expiration date"
                  name="expiry"
                  placeholder="00/00"
                  onChange={handleCardNumberChange}
                  onFocus={handleInputFocus}
                />
                {errors.cardExpiry && (
                  <span
                    id="payment-card-expiry-error-txt"
                    className="text-[10px] font-light text-red-500 mt-1 block"
                  >
                    {errors.cardExpiry}
                  </span>
                )}
              </div>
              <div className="px-2 w-1/3">
                <InputField
                  id={`payment-credit-form-cvv`}
                  type="text"
                  label="Security code"
                  name="cvv"
                  placeholder="000"
                  onChange={handleCardNumberChange}
                  onFocus={handleInputFocus}
                />
                {errors.cardCvv && (
                  <span
                    id="payment-card-cvv-error-txt"
                    className="text-[10px] font-light text-red-500 mt-1 block"
                  >
                    {errors.cardCvv}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Line Pay */}
        {/* Not use for now (if you want to use it: remove disabled attribute on input) */}
        <div className="w-full p-3">
          <label
            htmlFor="payment-linepay"
            className="flex items-center cursor-pointer text-sm font-bold text-gray-900"
          >
            <input
              id="payment-linepay"
              type="radio"
              name="payment-method"
              value="linepay"
              className="form-radio h-5 w-5 text-indigo-500 mr-2"
              onChange={handlePaymentMethodChange}
              checked={paymentMethod === 2}
              disabled
            />
            Line Pay
          </label>
          <div className={paymentMethod === 2 ? 'mt-2' : 'hidden'}>
            <Image
              src="/qr-code-line-pay.png"
              width={290}
              height={300}
              alt="qr code line pay"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethod
