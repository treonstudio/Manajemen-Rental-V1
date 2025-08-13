import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Alert, AlertDescription } from "./ui/alert"
import { Checkbox } from "./ui/checkbox"
import {
  ArrowLeft,
  Car,
  Users,
  Fuel,
  Settings,
  Star,
  Shield,
  Clock,
  CheckCircle,
  FileText,
  Phone,
  MessageSquare,
  Calendar,
  MapPin,
  CreditCard,
  AlertTriangle,
  Camera,
  Gauge,
  Snowflake,
  Radio,
  Navigation,
  Bluetooth
} from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

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
  gallery_images?: string[]
  status: string
  features: string[]
  rating?: number
  total_reviews?: number
  engine_capacity?: string
  fuel_consumption?: string
  max_speed?: string
  color?: string
  insurance_type?: string
  last_maintenance?: string
}

interface VehicleDetailProps {
  vehicle: Vehicle
  serviceType: "with_driver" | "without_driver"
  searchCriteria: {
    location: string
    startDate: string
    duration: number
    pickupTime: string
  }
  onBack: () => void
  onCheckout: () => void
}

export function VehicleDetail({ 
  vehicle, 
  serviceType, 
  searchCriteria, 
  onBack, 
  onCheckout 
}: VehicleDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Add null checks for all vehicle and searchCriteria properties
  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg mb-2">Data kendaraan tidak tersedia</h3>
              <Button onClick={onBack}>Kembali ke Pencarian</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getVehiclePrice = () => {
    if (serviceType === "with_driver" && vehicle?.with_driver_rate) {
      return vehicle.with_driver_rate
    }
    return vehicle?.daily_rate || 0
  }

  const getTotalPrice = () => {
    return getVehiclePrice() * (searchCriteria?.duration || 1)
  }

  const vehicleImages = vehicle?.gallery_images || [vehicle?.image_url].filter(Boolean)

  const policies = [
    {
      icon: CheckCircle,
      title: "Verifikasi Mudah",
      description: "Proses verifikasi dokumen yang cepat dan mudah, hanya butuh KTP dan SIM"
    },
    {
      icon: Clock,
      title: "Penggunaan 24 Jam",
      description: "Kendaraan dapat digunakan 24 jam penuh sesuai durasi sewa"
    },
    {
      icon: Shield,
      title: "Asuransi Lengkap",
      description: "Dilindungi asuransi comprehensive untuk keamanan perjalanan Anda"
    },
    {
      icon: Phone,
      title: "Support 24/7",
      description: "Tim support siap membantu Anda 24 jam sehari, 7 hari seminggu"
    },
    {
      icon: MapPin,
      title: "Antar Jemput Gratis",
      description: "Layanan antar jemput gratis di area tertentu untuk kemudahan Anda"
    },
    {
      icon: CreditCard,
      title: "Pembayaran Fleksibel",
      description: "Berbagai metode pembayaran: tunai, transfer, atau kartu kredit"
    }
  ]

  const specifications = [
    { label: "Merek", value: vehicle?.brand || "-", icon: Car },
    { label: "Model", value: vehicle?.model || "-", icon: Car },
    { label: "Tahun", value: vehicle?.year ? vehicle.year.toString() : "-", icon: Calendar },
    { label: "Tipe", value: vehicle?.type || "-", icon: Car },
    { label: "Kapasitas", value: vehicle?.capacity ? `${vehicle.capacity} Penumpang` : "-", icon: Users },
    { label: "Bahan Bakar", value: vehicle?.fuel_type || "-", icon: Fuel },
    { label: "Transmisi", value: vehicle?.transmission || "-", icon: Settings },
    { label: "Kapasitas Mesin", value: vehicle?.engine_capacity || "1500cc", icon: Gauge },
    { label: "Konsumsi BBM", value: vehicle?.fuel_consumption || "12 km/liter", icon: Fuel },
    { label: "Kecepatan Max", value: vehicle?.max_speed || "180 km/jam", icon: Gauge },
    { label: "Warna", value: vehicle?.color || "Putih", icon: Car },
    { label: "Plat Nomor", value: vehicle?.license_plate || "-", icon: Car }
  ]

  const advancedFeatures = [
    { name: "Air Conditioning", icon: Snowflake, available: true },
    { name: "Audio System", icon: Radio, available: true },
    { name: "GPS Navigation", icon: Navigation, available: true },
    { name: "Bluetooth", icon: Bluetooth, available: true },
    { name: "Backup Camera", icon: Camera, available: false },
    { name: "Cruise Control", icon: Settings, available: false }
  ]

  const rentalTerms = [
    "Penyewa harus berusia minimal 21 tahun dan memiliki SIM yang masih berlaku",
    "Wajib menyerahkan deposit sesuai ketentuan yang berlaku",
    "Kendaraan harus dikembalikan dalam kondisi yang sama seperti saat diserahkan",
    "Dilarang menggunakan kendaraan untuk kegiatan illegal atau berbahaya",
    "Keterlambatan pengembalian akan dikenakan denda sesuai tarif yang berlaku",
    "Kerusakan atau kehilangan menjadi tanggung jawab penyewa",
    "Wajib melaporkan kecelakaan atau masalah teknis segera kepada pihak rental",
    "Tidak diperbolehkan menyewakan ulang kendaraan kepada pihak ketiga"
  ]

  const handleCheckout = () => {
    if (!termsAccepted) {
      alert("Mohon setujui syarat dan ketentuan sebelum melanjutkan")
      return
    }
    onCheckout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Pencarian
            </Button>
            <div className="flex-1">
              <h1 className="text-xl">{vehicle?.brand || "Unknown"} {vehicle?.model || "Vehicle"}</h1>
              <p className="text-sm text-gray-600">{vehicle?.license_plate || "N/A"} • {vehicle?.year || "N/A"}</p>
            </div>
            <Badge className="bg-green-600">Tersedia</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video relative bg-gray-200 rounded-t-lg overflow-hidden">
                  {vehicleImages.length > 0 ? (
                    <ImageWithFallback
                      src={vehicleImages[selectedImageIndex] || `https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80`}
                      alt={`${vehicle?.brand || "Vehicle"} ${vehicle?.model || ""}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {vehicle?.rating && (
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{vehicle.rating}</span>
                      <span className="text-sm">({vehicle?.total_reviews || 0})</span>
                    </div>
                  )}
                </div>
                
                {vehicleImages.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {vehicleImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                            selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                          }`}
                        >
                          <ImageWithFallback
                            src={image || `https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&q=80`}
                            alt={`${vehicle?.brand || "Vehicle"} ${vehicle?.model || ""} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="specifications">Spesifikasi</TabsTrigger>
                <TabsTrigger value="features">Fitur</TabsTrigger>
                <TabsTrigger value="policies">Kebijakan</TabsTrigger>
                <TabsTrigger value="terms">Syarat & Ketentuan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Spesifikasi Kendaraan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specifications.map((spec, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                          <spec.icon className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">{spec.label}</p>
                            <p className="font-medium">{spec.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Fitur & Fasilitas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Fitur Standar</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(vehicle?.features || []).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3">Fitur Lanjutan</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {advancedFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                            <feature.icon className={`h-5 w-5 ${
                              feature.available ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <span className={feature.available ? '' : 'text-gray-500'}>
                              {feature.name}
                            </span>
                            {feature.available && (
                              <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="policies">
                <Card>
                  <CardHeader>
                    <CardTitle>Kebijakan Rental</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {policies.map((policy, index) => (
                        <div key={index} className="p-4 rounded-lg border bg-blue-50/50">
                          <div className="flex items-start gap-3">
                            <policy.icon className="h-6 w-6 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900">{policy.title}</h4>
                              <p className="text-sm text-blue-700 mt-1">{policy.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="terms">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Syarat & Ketentuan Rental
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-6">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Penting:</strong> Mohon baca dan pahami semua syarat dan ketentuan sebelum melanjutkan pemesanan.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                      {rentalTerms.map((term, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center justify-center">
                            {index + 1}
                          </span>
                          <p className="text-sm">{term}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Jenis Layanan:</span>
                    <Badge variant="secondary">
                      {serviceType === "with_driver" ? "Dengan Sopir" : "Tanpa Sopir"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Lokasi:</span>
                    <span className="text-right">{searchCriteria?.location || "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tanggal Mulai:</span>
                    <span>{searchCriteria?.startDate ? new Date(searchCriteria.startDate).toLocaleDateString('id-ID') : "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Durasi:</span>
                    <span>{searchCriteria?.duration || 1} Hari</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Waktu Jemput:</span>
                    <span>{searchCriteria?.pickupTime || "N/A"}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Harga per hari:</span>
                    <span>{formatCurrency(getVehiclePrice())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Durasi ({searchCriteria?.duration || 1} hari):</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-medium">
                    <span>Subtotal:</span>
                    <span className="text-green-600">{formatCurrency(getTotalPrice())}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    *Harga final akan ditampilkan di halaman checkout termasuk biaya tambahan dan pajak
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm leading-tight">
                      Saya telah membaca dan menyetujui{" "}
                      <Button variant="link" className="p-0 h-auto text-blue-600 underline">
                        syarat dan ketentuan
                      </Button>{" "}
                      rental kendaraan
                    </label>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    disabled={!termsAccepted}
                    onClick={handleCheckout}
                  >
                    Lanjutkan ke Checkout
                  </Button>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">Butuh bantuan?</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Telepon
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mengapa Memilih Kami?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Terpercaya</p>
                    <p className="text-xs text-gray-600">Ribuan pelanggan puas</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Respon Cepat</p>
                    <p className="text-xs text-gray-600">Support 24/7 siap membantu</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Kendaraan Terawat</p>
                    <p className="text-xs text-gray-600">Maintenance rutin & berkualitas</p>
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