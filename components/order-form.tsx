'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Gamepad2, User, Phone, CreditCard, Loader2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'

interface Package {
  _id: string
  name: string
  popularityAmount: number
  price: number
}

interface OrderFormProps {
  selectedPackage: Package
}

export default function OrderForm({ selectedPackage }: OrderFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    pubgPlayerId: '',
    pubgPlayerName: '',
    whatsappNumber: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          packageId: selectedPackage._id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      setIsSuccess(true)
      setTimeout(() => {
        router.push('/order/success')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSuccess) {
    return (
      <Card className="border-pubg-gray bg-pubg-gray/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Order Placed!</h3>
          <p className="text-gray-400 text-center">
            Redirecting to confirmation page...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-pubg-gray bg-gradient-to-b from-pubg-gray/80 to-pubg-dark">
      <CardHeader>
        <CardTitle>Complete Your Order</CardTitle>
        <CardDescription>
          Enter your PUBG details to receive {selectedPackage.popularityAmount.toLocaleString()} popularity
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 p-4 rounded-lg bg-pubg-dark border border-pubg-yellow/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Selected Package</p>
              <p className="text-lg font-semibold text-white">{selectedPackage.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Price</p>
              <p className="text-xl font-bold text-pubg-yellow">{formatPrice(selectedPackage.price)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-pubg-yellow" />
              PUBG Player ID
            </label>
            <Input
              name="pubgPlayerId"
              placeholder="Enter your PUBG Player ID (8-20 characters)"
              value={formData.pubgPlayerId}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={20}
              pattern="[a-zA-Z0-9]+"
              className="uppercase"
            />
            <p className="text-xs text-gray-500">Alphanumeric characters only</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User className="h-4 w-4 text-pubg-yellow" />
              PUBG Player Name
            </label>
            <Input
              name="pubgPlayerName"
              placeholder="Enter your PUBG Player Name"
              value={formData.pubgPlayerName}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={30}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Phone className="h-4 w-4 text-pubg-yellow" />
              WhatsApp Number
            </label>
            <Input
              name="whatsappNumber"
              type="tel"
              placeholder="Enter your WhatsApp number"
              value={formData.whatsappNumber}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500">For payment confirmation and updates</p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-900/50 border border-red-600 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-pubg-yellow text-pubg-dark hover:bg-pubg-orange"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Place Order - {formatPrice(selectedPackage.price)}
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500">
            Admin will contact you on WhatsApp for payment confirmation
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
