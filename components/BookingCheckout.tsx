import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { Checkbox } from "./ui/checkbox"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import {
  ArrowLeft,
  Car,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  FileText,
  Calculator,
  Shield,
  Info
} from "lucide-react"
import { apiClient } from "../utils/api-client"

interface Vehicle {
  id: string
  license_plate: string
  brand: string
  model: string
  year: number
  type: string
  category: string
  capacity: number
  fuel_type: string
  transmission: string
  daily_rate: number
  with_driver_rate?: number
  image_url?: string
  status: string
  features: string[]
  rating?: number
  total_reviews?: number
}

interface BookingData {
  serviceType: "with_driver" | "without_driver"
  location: string
  startDate: string
  duration: number
  pickupTime: string
}

interface CustomerData {
  fullName: string
  email: string
  phone: string
  idNumber: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  notes: string
}

interface BookingCheckoutProps {
  vehicle: Vehicle
  bookingData: BookingData
  onBack: () => void
  onComplete: (bookingId: string, customerData: CustomerData, totalAmount: number) => void
}

export function BookingCheckout({ vehicle, bookingData, onBack, onComplete }: BookingCheckoutProps) {
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: ""
  })
  
  const [pickupLocation, setPickupLocation] = useState<"office" | "custom">("office")
  const [returnLocation, setReturnLocation] = useState<"office" | "custom">("office")
  const [customPickupLocation, setCustomPickupLocation] = useState("")
  const [customReturnLocation, setCustomReturnLocation] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToVerification, setAgreedToVerification] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculatePricing = () => {
    const baseRate = bookingData.serviceType === "with_driver" && vehicle.with_driver_rate 
      ? vehicle.with_driver_rate 
      : vehicle.daily_rate
    
    const subtotal = baseRate * bookingData.duration
    
    // Additional fees
    const deliveryFee = pickupLocation === "custom" ? 50000 : 0
    const returnFee = returnLocation === "custom" ? 50000 : 0
    const driverFee = bookingData.serviceType === "with_driver" ? 100000 * bookingData.duration : 0
    const insuranceFee = Math.round(subtotal * 0.05) // 5% insurance
    const serviceFee = 25000
    
    const totalBeforeTax = subtotal + deliveryFee + returnFee + driverFee + insuranceFee + serviceFee
    const tax = Math.round(totalBeforeTax * 0.11) // 11% PPN
    const total = totalBeforeTax + tax
    
    return {
      baseRate,
      subtotal,
      deliveryFee,
      returnFee,
      driverFee,
      insuranceFee,
      serviceFee,
      totalBeforeTax,
      tax,
      total
    }
  }

  const pricing = calculatePricing()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms || !agreedToVerification) {
      alert("Mohon setujui semua persyaratan sebelum melanjutkan")
      return
    }

    // Validate required fields
    const requiredFields = [
      customerData.fullName,
      customerData.email,
      customerData.phone,
      customerData.idNumber,
      customerData.address
    ]
    
    if (requiredFields.some(field => !field.trim())) {
      alert("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    if (pickupLocation === "custom" && !customPickupLocation.trim()) {
      alert("Mohon masukkan alamat pengambilan")
      return
    }

    if (returnLocation === "custom" && !customReturnLocation.trim()) {
      alert("Mohon masukkan alamat pengembalian")
      return
    }

    setIsSubmitting(true)
    
    try {
      const bookingId = `BK${Date.now()}`
      
      // Prepare booking data for backend
      const publicBookingData = {
        bookingId,
        vehicleId: vehicle.id,
        customerData,
        bookingDetails: bookingData,
        locationDetails: {
          pickupLocation: pickupLocation === "office" ? "Kantor Rental - Jl. Sudirman No. 123, Jakarta Pusat" : customPickupLocation,
          returnLocation: returnLocation === "office" ? "Kantor Rental - Jl. Sudirman No. 123, Jakarta Pusat" : customReturnLocation,
          pickupType: pickupLocation,
          returnType: returnLocation
        },
        pricing,
        status: "pending_verification",
        source: "public_portal",
        createdAt: new Date().toISOString()
      }
      
      console.log('Submitting booking to backend:', publicBookingData)
      
      // Send to backend
      const response = await apiClient.createPublicBooking(publicBookingData)
      
      if (response.success) {
        console.log('Booking created successfully:', response)
        onComplete(bookingId, customerData, pricing.total)
      } else {
        throw new Error(response.message || 'Failed to create booking')
      }
      
    } catch (error) {
      console.error("Error creating booking:", error)
      alert(`Terjadi kesalahan saat memproses pemesanan: ${error.message}. Silakan coba lagi.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div className="flex-1">
              <h1 className="text-xl">Checkout Pemesanan</h1>
              <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model} • {bookingData.duration} Hari</p>
            </div>
            <Badge variant="secondary">Step 3 of 3</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Penyewa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nama Lengkap *</Label>
                      <Input
                        id="fullName"
                        value={customerData.fullName}
                        onChange={(e) => setCustomerData(prev => ({...prev, fullName: e.target.value}))}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData(prev => ({...prev, email: e.target.value}))}
                        placeholder="contoh@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor HP *</Label>
                      <Input
                        id="phone"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData(prev => ({...prev, phone: e.target.value}))}
                        placeholder="08123456789"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="idNumber">Nomor KTP *</Label>
                      <Input
                        id="idNumber"
                        value={customerData.idNumber}
                        onChange={(e) => setCustomerData(prev => ({...prev, idNumber: e.target.value}))}
                        placeholder="1234567890123456"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Alamat Lengkap *</Label>
                    <Textarea
                      id="address"
                      value={customerData.address}
                      onChange={(e) => setCustomerData(prev => ({...prev, address: e.target.value}))}
                      placeholder="Masukkan alamat lengkap"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact">Kontak Darurat</Label>
                      <Input
                        id="emergencyContact"
                        value={customerData.emergencyContact}
                        onChange={(e) => setCustomerData(prev => ({...prev, emergencyContact: e.target.value}))}
                        placeholder="Nama kontak darurat"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Nomor Kontak Darurat</Label>
                      <Input
                        id="emergencyPhone"
                        value={customerData.emergencyPhone}
                        onChange={(e) => setCustomerData(prev => ({...prev, emergencyPhone: e.target.value}))}
                        placeholder="08123456789"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Catatan Tambahan</Label>
                    <Textarea
                      id="notes"
                      value={customerData.notes}
                      onChange={(e) => setCustomerData(prev => ({...prev, notes: e.target.value}))}
                      placeholder="Keperluan khusus, permintaan, atau catatan lainnya"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pickup & Return Locations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Lokasi Pengambilan & Pengembalian
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pickup Location */}
                  <div>
                    <Label className="text-base mb-3 block">Lokasi Pengambilan</Label>
                    <RadioGroup value={pickupLocation} onValueChange={(value) => setPickupLocation(value as "office" | "custom")}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="office" id="pickup-office" />
                        <Label htmlFor="pickup-office" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">Kantor Rental</p>
                            <p className="text-sm text-gray-600">Jl. Sudirman No. 123, Jakarta Pusat</p>
                            <p className="text-sm text-green-600">Gratis</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="custom" id="pickup-custom" />
                        <Label htmlFor="pickup-custom" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">Lokasi Lainnya</p>
                            <p className="text-sm text-gray-600">Antar ke alamat yang Anda tentukan</p>
                            <p className="text-sm text-orange-600">+{formatCurrency(50000)}</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {pickupLocation === "custom" && (
                      <div className="mt-3">
                        <Input
                          value={customPickupLocation}
                          onChange={(e) => setCustomPickupLocation(e.target.value)}
                          placeholder="Masukkan alamat lengkap untuk pengambilan"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Return Location */}
                  <div>
                    <Label className="text-base mb-3 block">Lokasi Pengembalian</Label>
                    <RadioGroup value={returnLocation} onValueChange={(value) => setReturnLocation(value as "office" | "custom")}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="office" id="return-office" />
                        <Label htmlFor="return-office" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">Kantor Rental</p>
                            <p className="text-sm text-gray-600">Jl. Sudirman No. 123, Jakarta Pusat</p>
                            <p className="text-sm text-green-600">Gratis</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="custom" id="return-custom" />
                        <Label htmlFor="return-custom" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">Lokasi Lainnya</p>
                            <p className="text-sm text-gray-600">Jemput di alamat yang Anda tentukan</p>
                            <p className="text-sm text-orange-600">+{formatCurrency(50000)}</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {returnLocation === "custom" && (
                      <div className="mt-3">
                        <Input
                          value={customReturnLocation}
                          onChange={(e) => setCustomReturnLocation(e.target.value)}
                          placeholder="Masukkan alamat lengkap untuk pengembalian"
                          required
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Verification Notice */}
              <Alert className="border-blue-200 bg-blue-50">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium text-blue-900">Verifikasi Dokumen via WhatsApp</p>
                    <p className="text-blue-700">
                      Setelah pemesanan dikonfirmasi, tim kami akan menghubungi Anda melalui WhatsApp untuk:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1 ml-4">
                      <li>• Verifikasi dokumen KTP dan SIM</li>
                      <li>• Konfirmasi detail pemesanan</li>
                      <li>• Koordinasi jadwal pengambilan</li>
                      <li>• Informasi pembayaran dan deposit</li>
                    </ul>
                    <p className="text-sm text-blue-600 font-medium">
                      Pastikan nomor WhatsApp Anda aktif dan dapat dihubungi.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Terms & Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Persetujuan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-tight">
                      Saya telah membaca dan menyetujui{" "}
                      <Button variant="link" className="p-0 h-auto text-blue-600 underline">
                        syarat dan ketentuan
                      </Button>{" "}
                      rental kendaraan, termasuk kebijakan pembayaran, deposit, dan tanggung jawab atas kerusakan.
                    </Label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="verification"
                      checked={agreedToVerification}
                      onCheckedChange={(checked) => setAgreedToVerification(checked as boolean)}
                    />
                    <Label htmlFor="verification" className="text-sm leading-tight">
                      Saya menyetujui untuk dihubungi melalui WhatsApp untuk proses verifikasi dokumen dan koordinasi pemesanan.
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Ringkasan Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vehicle Info */}
                  <div className="flex gap-3">
                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Car className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-sm text-gray-600">{vehicle.license_plate} • {vehicle.year}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Jenis Layanan:</span>
                      <Badge variant="secondary">
                        {bookingData.serviceType === "with_driver" ? "Dengan Sopir" : "Tanpa Sopir"}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tanggal:</span>
                      <span>{new Date(bookingData.startDate).toLocaleDateString('id-ID')}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Durasi:</span>
                      <span>{bookingData.duration} Hari</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Waktu Jemput:</span>
                      <span>{bookingData.pickupTime}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Lokasi Jemput:</span>
                      <span className="text-right">
                        {pickupLocation === "office" ? "Kantor Rental" : "Alamat Lain"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Lokasi Kembali:</span>
                      <span className="text-right">
                        {returnLocation === "office" ? "Kantor Rental" : "Alamat Lain"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Rincian Biaya
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sewa Kendaraan ({bookingData.duration} hari)</span>
                      <span>{formatCurrency(pricing.subtotal)}</span>
                    </div>
                    
                    {pricing.driverFee > 0 && (
                      <div className="flex justify-between">
                        <span>Biaya Sopir ({bookingData.duration} hari)</span>
                        <span>{formatCurrency(pricing.driverFee)}</span>
                      </div>
                    )}
                    
                    {pricing.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Biaya Antar</span>
                        <span>{formatCurrency(pricing.deliveryFee)}</span>
                      </div>
                    )}
                    
                    {pricing.returnFee > 0 && (
                      <div className="flex justify-between">
                        <span>Biaya Jemput</span>
                        <span>{formatCurrency(pricing.returnFee)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Asuransi (5%)</span>
                      <span>{formatCurrency(pricing.insuranceFee)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Biaya Layanan</span>
                      <span>{formatCurrency(pricing.serviceFee)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(pricing.totalBeforeTax)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>PPN (11%)</span>
                      <span>{formatCurrency(pricing.tax)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span className="text-green-600">{formatCurrency(pricing.total)}</span>
                    </div>
                  </div>
                  
                  <Alert className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Pembayaran dapat dilakukan secara tunai, transfer bank, atau kartu kredit saat pengambilan kendaraan.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                size="lg"
                disabled={!agreedToTerms || !agreedToVerification || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Konfirmasi Pemesanan
                  </>
                )}
              </Button>

              {/* Support Contact */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <p className="text-sm">Butuh bantuan?</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}