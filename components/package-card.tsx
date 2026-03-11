'use client'

import Link from 'next/link'
import { TrendingUp, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface Package {
  _id: string
  name: string
  popularityAmount: number
  price: number
  description?: string
}

interface PackageCardProps {
  package: Package
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <Card className="group relative overflow-hidden border-pubg-gray bg-gradient-to-b from-pubg-gray/80 to-pubg-dark transition-all duration-300 hover:border-pubg-yellow/50 hover:shadow-lg hover:shadow-pubg-yellow/10">
      <div className="absolute inset-0 bg-gradient-to-br from-pubg-yellow/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <CardHeader className="relative">
        <div className="absolute -right-4 -top-4 flex h-20 w-20 items-center justify-center rounded-full bg-pubg-yellow/10">
          <Zap className="h-10 w-10 text-pubg-yellow" />
        </div>
        <CardTitle className="text-xl">{pkg.name}</CardTitle>
        <CardDescription>{pkg.description || `${pkg.popularityAmount.toLocaleString()} Popularity Points`}</CardDescription>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-pubg-yellow" />
          <span className="text-2xl font-bold text-white">
            {pkg.popularityAmount.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400">popularity</span>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-pubg-yellow">
            {formatPrice(pkg.price)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="relative">
        <Link href={`/order?package=${pkg._id}`} className="w-full">
          <Button className="w-full bg-pubg-yellow text-pubg-dark hover:bg-pubg-orange">
            Buy Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
