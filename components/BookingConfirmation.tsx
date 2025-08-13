import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Alert, AlertDescription } from "./ui/alert"
import {
  CheckCircle,
  Car,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  FileText,
  Download,
  Share,
  Home,
  Copy
} from "lucide-react"

interface BookingConfirmationProps {
  bookingId: string
  customerName: string
  customerPhone: string
  vehicleInfo: {
    brand: string
    model: string
    licensePlate: string
    year: number
  }
  bookingDetails: {
    serviceType: "with_driver" | "without_driver"
    startDate: string
    duration: number
    pickupTime: string
    pickupLocation: string
    returnLocation: string
  }
  totalAmount: number
  onNewBooking: () => void
  onBackToHome: () => void
}

export function BookingConfirmation({
  bookingId,
  customerName,
  customerPhone,
  vehicleInfo,
  bookingDetails,
  totalAmount,
  onNewBooking,
  onBackToHome
}: BookingConfirmationProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId)
    alert("ID Booking berhasil disalin!")
  }

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Konfirmasi Booking Rental Mobil',
        text: `Booking ID: ${bookingId}\nKendaraan: ${vehicleInfo.brand} ${vehicleInfo.model}\nTanggal: ${new Date(bookingDetails.startDate).toLocaleDateString('id-ID')}`,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `Booking ID: ${bookingId}\nKendaraan: ${vehicleInfo.brand} ${vehicleInfo.model}\nTanggal: ${new Date(bookingDetails.startDate).toLocaleDateString('id-ID')}`
      navigator.clipboard.writeText(text)
      alert("Detail booking berhasil disalin!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl mb-2 text-gray-900">Pemesanan Berhasil!</h1>
          <p className="text-xl text-gray-600">
            Terima kasih {customerName}, pemesanan Anda telah dikonfirmasi
          </p>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Detail Pemesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ID Booking</p>
                    <p className="text-lg font-mono">{bookingId}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyBookingId}>
                    <Copy className="h-4 w-4 mr-2" />
                    Salin
                  </Button>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Kendaraan</p>
                    <p className="font-medium">{vehicleInfo.brand} {vehicleInfo.model}</p>
                    <p className="text-sm text-gray-500">{vehicleInfo.licensePlate} • {vehicleInfo.year}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Jenis Layanan</p>
                    <Badge variant="secondary">
                      {bookingDetails.serviceType === "with_driver" ? "Dengan Sopir" : "Tanpa Sopir"}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Mulai</p>
                    <p className="font-medium">{new Date(bookingDetails.startDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Durasi & Waktu</p>
                    <p className="font-medium">{bookingDetails.duration} Hari • {bookingDetails.pickupTime}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Lokasi Pengambilan</p>
                    <p className="font-medium">{bookingDetails.pickupLocation}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Lokasi Pengembalian</p>
                    <p className="font-medium">{bookingDetails.returnLocation}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                    <p className="text-2xl font-medium text-green-600">{formatCurrency(totalAmount)}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Menunggu Verifikasi
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Langkah Selanjutnya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Verifikasi WhatsApp</h4>
                      <p className="text-sm text-gray-600">
                        Tim kami akan menghubungi Anda di <strong>{customerPhone}</strong> dalam 15-30 menit untuk verifikasi dokumen.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Persiapkan Dokumen</h4>
                      <p className="text-sm text-gray-600">
                        Siapkan KTP, SIM, dan foto diri untuk proses verifikasi yang cepat.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Konfirmasi Pembayaran</h4>
                      <p className="text-sm text-gray-600">
                        Setelah verifikasi, Anda akan menerima detail pembayaran dan jadwal pengambilan kendaraan.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium text-orange-900">Informasi Penting:</p>
                  <ul className="text-sm text-orange-700 space-y-1 ml-4">
                    <li>• Pastikan nomor WhatsApp Anda aktif dan dapat dihubungi</li>
                    <li>• Siapkan dokumen asli saat pengambilan kendaraan</li>
                    <li>• Deposit akan dikembalikan setelah kendaraan dikembalikan dalam kondisi baik</li>
                    <li>• Hubungi customer service jika ada pertanyaan atau perubahan jadwal</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={shareBooking}>
                  <Share className="h-4 w-4 mr-2" />
                  Bagikan Detail
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Unduh PDF
                </Button>
                
                <Button className="w-full" onClick={onNewBooking}>
                  <Car className="h-4 w-4 mr-2" />
                  Pesan Lagi
                </Button>
                
                <Button variant="outline" className="w-full" onClick={onBackToHome}>
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bantuan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Butuh bantuan atau ada pertanyaan?
                </p>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    (021) 1234-5678
                  </Button>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp Support
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  Customer service tersedia 24/7
                </p>
              </CardContent>
            </Card>

            {/* Booking Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Pemesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Pemesanan Dibuat</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Menunggu Verifikasi</span>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-50">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Pembayaran</span>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-50">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Pengambilan Kendaraan</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Missing import - add AlertTriangle
import { AlertTriangle } from "lucide-react"