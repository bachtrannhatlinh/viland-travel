'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { useAuth } from '@/hooks/useAuth'
import { User, Mail, Phone, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
    type: 'success' as 'success' | 'error'
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          country: user.address?.country || '',
          zipCode: user.address?.zipCode || ''
        }
      })
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <Typography variant="p" className="mt-4 text-gray-600">
            Đang tải...
          </Typography>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSave = async () => {
    try {
      if (!user) return

      console.log('Starting profile update...')
      const { authService } = await import('@/lib/auth')

      console.log('Calling updateProfile with data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address
      })

      const success = await authService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address
      })

      if (success) {
        setIsEditing(false)
        // Show success dialog
        setDialogContent({
          title: 'Thành công!',
          description: 'Thông tin cá nhân đã được cập nhật thành công.',
          type: 'success'
        })
        setDialogOpen(true)

        // Refresh user data after successful update
        setTimeout(() => {
          refreshUser()
        }, 1000)
      } else {
        console.error('Update profile returned false')
        // Show error dialog
        setDialogContent({
          title: 'Lỗi!',
          description: 'Cập nhật thông tin thất bại. Vui lòng thử lại.',
          type: 'error'
        })
        setDialogOpen(true)
      }
    } catch (error) {
      console.error('Update profile error:', error)

      // Check if it's an authentication error
      if (error instanceof Error && error.message.includes('401')) {
        setDialogContent({
          title: 'Phiên đăng nhập hết hạn!',
          description: 'Vui lòng đăng nhập lại để tiếp tục.',
          type: 'error'
        })
      } else {
        setDialogContent({
          title: 'Lỗi!',
          description: `Có lỗi xảy ra: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error'
        })
      }
      setDialogOpen(true)
    }
  }

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          country: user.address?.country || '',
          zipCode: user.address?.zipCode || ''
        }
      })
    }
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Typography variant="h1" className="text-3xl font-bold text-gray-900 mb-2">
              Thông tin cá nhân
            </Typography>
            <Typography variant="p" className="text-gray-600">
              Quản lý thông tin tài khoản và cài đặt cá nhân của bạn
            </Typography>
          </div>

          {/* Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-xl font-medium">
                    {getInitials(user.firstName || user.first_name, user.lastName || user.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {user.email}
                  </CardDescription>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cá nhân của bạn
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Hủy
                    </Button>
                    <Button onClick={handleSave}>
                      Lưu
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="pl-10 bg-gray-50 cursor-not-allowed"
                      title="Email không thể thay đổi"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <div className="relative">
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={(value: string) =>
                      setFormData(prev => ({
                        ...prev,
                        dateOfBirth: value
                      }))
                    }
                    placeholder="Chọn ngày sinh"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <Typography variant="h3" className="text-lg font-semibold">
                    Địa chỉ
                  </Typography>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.street">Địa chỉ</Label>
                  <Input
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Số nhà, tên đường"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address.city">Thành phố</Label>
                    <Input
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address.state">Tỉnh/Thành phố</Label>
                    <Input
                      id="address.state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address.country">Quốc gia</Label>
                    <Input
                      id="address.country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address.zipCode">Mã bưu điện</Label>
                    <Input
                      id="address.zipCode"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Dialog for notifications */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {dialogContent.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span>{dialogContent.title}</span>
            </DialogTitle>
            <DialogDescription>
              {dialogContent.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setDialogOpen(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
