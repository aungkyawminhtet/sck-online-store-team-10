'use client'

import Text from '@/components/typography/text'
import { convertCurrency } from '@/utils/format'

// ----------------------------------------------------------------------

type SubTotalProps = {
  total: number
  points?: number
}

const SubTotal = ({ total, points }: SubTotalProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-base font-medium text-gray-900">
        <Text id="shopping-cart-subtotal-label">Subtotal</Text>
        <Text id="shopping-cart-subtotal-price">
          {convertCurrency(total, 'THB')}
        </Text>
      </div>
      {points !== undefined && (
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <Text id="shopping-cart-points-label">Receive Points</Text>
          <Text id="shopping-cart-points-value">
            {points} Points
          </Text>
        </div>
      )}
    </div>
  )
}

export default SubTotal
