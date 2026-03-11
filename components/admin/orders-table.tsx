'use client'

import { useState } from 'react'
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatPrice, formatDate } from '@/lib/utils'

interface Order {
  _id: string
  userEmail: string
  userName: string
  pubgPlayerId: string
  pubgPlayerName: string
  whatsappNumber: string
  packageName: string
  packagePopularity: number
  price: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: string
}

interface OrdersTableProps {
  orders: Order[]
  onUpdate: () => void
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, variant: 'pending' as const },
  processing: { label: 'Processing', icon: Package, variant: 'processing' as const },
  completed: { label: 'Completed', icon: CheckCircle, variant: 'completed' as const },
  cancelled: { label: 'Cancelled', icon: XCircle, variant: 'cancelled' as const },
}

export default function OrdersTable({ orders, onUpdate }: OrdersTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      onUpdate()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <Card className="border-pubg-gray bg-pubg-gray/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">All Orders</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onUpdate}
          className="border-pubg-gray text-gray-400 hover:text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>PUBG ID</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const status = statusConfig[order.status]
                const StatusIcon = status.icon

                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs">
                      {order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{order.userName}</p>
                        <p className="text-xs text-gray-500">{order.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{order.pubgPlayerId}</p>
                        <p className="text-xs text-gray-500">{order.pubgPlayerName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{order.packageName}</p>
                        <p className="text-xs text-gray-500">
                          {order.packagePopularity.toLocaleString()} popularity
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-pubg-yellow">
                      {formatPrice(order.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      {updatingId === order._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="flex gap-1">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(order._id, 'processing')}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Process
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(order._id, 'completed')}
                              className="text-green-400 hover:text-green-300"
                            >
                              Complete
                            </Button>
                          )}
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(order._id, 'cancelled')}
                              className="text-red-400 hover:text-red-300"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
