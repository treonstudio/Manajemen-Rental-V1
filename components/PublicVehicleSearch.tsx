import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Calendar, Clock, MapPin, Users, Car, Fuel, Settings, Star, Briefcase, Cog, Navigation } from "lucide-react"
import { apiClient } from "../utils/api-client"
import { VehicleDetail } from "./VehicleDetail"
import { BookingCheckout } from "./BookingCheckout"
import { BookingConfirmation } from "./BookingConfirmation"
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

interface SearchCriteria {
  serviceType: "with_driver" | "without_driver" | ""
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

type ViewState = "search" | "detail" | "checkout" | "confirmation"

export function PublicVehicleSearch() {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    serviceType: "",
    location: "",
    startDate: "",
    duration: 1,
    pickupTime: "09:00"
  })
  const [searchResults, setSearchResults] = useState<Vehicle[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [currentView, setCurrentView] = useState<ViewState>("search")
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null)

  const handleSearch = async () => {
    if (!searchCriteria.serviceType || !searchCriteria.location || !searchCriteria.startDate) {
      alert("Mohon lengkapi semua field yang diperlukan")
      return
    }

    setIsSearching(true)
    try {
      const vehicles = await apiClient.getVehicles()
      console.log("Vehicles data received:", vehicles)
      
      // Ensure vehicles is an array
      const vehiclesArray = Array.isArray(vehicles) ? vehicles : []
      
      // Filter available vehicles
      const availableVehicles = vehiclesArray.filter(vehicle => 
        vehicle.status === "available" || vehicle.status === "ready"
      )
      setSearchResults(availableVehicles)
      setHasSearched(true)
    } catch (error) {
      console.error("Error searching vehicles:", error)
      // Use mock data if API fails
      const mockVehicles: Vehicle[] = [
        {
          id: "1",
          license_plate: "B 1234 ABC",
          brand: "Daihatsu",
          model: "Sigra Facelift",
          year: 2022,
          type: "MPV",
          category: "ekonomi",
          capacity: 7,
          fuel_type: "bensin",
          transmission: "automatic",
          daily_rate: 296000,
          with_driver_rate: 450000,
          status: "available",
          features: ["AC", "Audio System", "Power Steering", "Electric Windows"],
          rating: 4.5,
          total_reviews: 128,
          engine_capacity: "1200cc",
          fuel_consumption: "14 km/liter",
          max_speed: "180 km/jam",
          color: "Putih",
          image_url: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&q=80",
          gallery_images: [
            "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
          ]
        },
        {
          id: "2",
          license_plate: "B 5678 DEF",
          brand: "Toyota",
          model: "Agya",
          year: 2021,
          type: "City Car",
          category: "ekonomi",
          capacity: 5,
          fuel_type: "bensin",
          transmission: "automatic",
          daily_rate: 299000,
          with_driver_rate: 600000,
          status: "available",
          features: ["AC", "Audio System", "Power Steering", "Leather Seats"],
          rating: 4.8,
          total_reviews: 89,
          engine_capacity: "1000cc",
          fuel_consumption: "16 km/liter",
          max_speed: "160 km/jam",
          color: "Silver",
          image_url: "https://images.unsplash.com/photo-1580414155951-82c4ac5fb29c?w=400&q=80",
          gallery_images: [
            "https://images.unsplash.com/photo-1580414155951-82c4ac5fb29c?w=800&q=80",
            "https://images.unsplash.com/photo-1619976215249-f927565c3db7?w=800&q=80"
          ]
        },
        {
          id: "3",
          license_plate: "B 9012 GHI",
          brand: "Daihatsu",
          model: "All New Ayla 2023",
          year: 2023,
          type: "City Car",
          category: "ekonomi",
          capacity: 5,
          fuel_type: "bensin",
          transmission: "manual",
          daily_rate: 300000,
          with_driver_rate: 500000,
          status: "available",
          features: ["AC", "Audio System", "Power Steering", "USB Charging"],
          rating: 4.3,
          total_reviews: 76,
          engine_capacity: "1000cc",
          fuel_consumption: "18 km/liter",
          max_speed: "160 km/jam",
          color: "Merah",
          image_url: "https://images.unsplash.com/photo-1589018256083-1c7c4cf1c5ac?w=400&q=80"
        },
        {
          id: "4",
          license_plate: "B 3456 JKL",
          brand: "Daihatsu",
          model: "Ayla",
          year: 2022,
          type: "City Car",
          category: "ekonomi",
          capacity: 5,
          fuel_type: "bensin",
          transmission: "automatic",
          daily_rate: 300000,
          with_driver_rate: 470000,
          status: "available",
          features: ["AC", "Audio System", "Power Steering", "USB Charging"],
          rating: 4.2,
          total_reviews: 95,
          engine_capacity: "1000cc",
          fuel_consumption: "17 km/liter",
          max_speed: "160 km/jam",
          color: "Orange",
          image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80"
        }
      ]
      setSearchResults(mockVehicles)
      setHasSearched(true)
    } finally {
      setIsSearching(false)
    }
  }

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setCurrentView("detail")
  }

  const handleBackToSearch = () => {
    setCurrentView("search")
    setSelectedVehicle(null)
  }

  const handleCheckout = () => {
    setCurrentView("checkout")
  }

  const handleBackToDetail = () => {
    setCurrentView("detail")
  }

  const handleBookingComplete = (bookingId: string, customerData: CustomerData, totalAmount: number) => {
    // Create booking confirmation data
    const confirmation = {
      bookingId,
      customerName: customerData.fullName,
      customerPhone: customerData.phone,
      vehicleInfo: {
        brand: selectedVehicle!.brand,
        model: selectedVehicle!.model,
        licensePlate: selectedVehicle!.license_plate,
        year: selectedVehicle!.year
      },
      bookingDetails: {
        serviceType: searchCriteria.serviceType as "with_driver" | "without_driver",
        startDate: searchCriteria.startDate,
        duration: searchCriteria.duration,
        pickupTime: searchCriteria.pickupTime,
        pickupLocation: "Akan dikonfirmasi", // This will be updated from checkout form
        returnLocation: "Akan dikonfirmasi" // This will be updated from checkout form
      },
      totalAmount
    }
    
    setBookingConfirmation(confirmation)
    setCurrentView("confirmation")
    
    console.log('Booking completed and integrated with admin system:', {
      bookingId,
      customerData,
      vehicleId: selectedVehicle!.id,
      totalAmount
    })
  }

  const handleNewBooking = () => {
    setCurrentView("search")
    setSelectedVehicle(null)
    setBookingConfirmation(null)
    setHasSearched(false)
    setSearchResults([])
    setSearchCriteria({
      serviceType: "",
      location: "",
      startDate: "",
      duration: 1,
      pickupTime: "09:00"
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getVehiclePrice = (vehicle: Vehicle) => {
    if (searchCriteria.serviceType === "with_driver" && vehicle.with_driver_rate) {
      return vehicle.with_driver_rate
    }
    return vehicle.daily_rate
  }

  const getTotalPrice = (vehicle: Vehicle) => {
    return getVehiclePrice(vehicle) * searchCriteria.duration
  }

  const getProviderCount = (vehicle: Vehicle) => {
    // Mock data for providers available - could be dynamic based on vehicle popularity
    const counts = [2, 3, 5, 8]
    return counts[Math.floor(Math.random() * counts.length)]
  }

  const getServiceTypeLabel = () => {
    return searchCriteria.serviceType === "with_driver" ? "Dengan Sopir" : "Tanpa Sopir"
  }

  // Render different views based on current state
  if (currentView === "detail" && selectedVehicle) {
    return (
      <VehicleDetail
        vehicle={selectedVehicle}
        serviceType={searchCriteria.serviceType as "with_driver" | "without_driver"}
        searchCriteria={searchCriteria}
        onBack={handleBackToSearch}
        onCheckout={handleCheckout}
      />
    )
  }

  if (currentView === "checkout" && selectedVehicle) {
    return (
      <BookingCheckout
        vehicle={selectedVehicle}
        bookingData={{
          serviceType: searchCriteria.serviceType as "with_driver" | "without_driver",
          location: searchCriteria.location,
          startDate: searchCriteria.startDate,
          duration: searchCriteria.duration,
          pickupTime: searchCriteria.pickupTime
        }}
        onBack={handleBackToDetail}
        onComplete={handleBookingComplete}
      />
    )
  }

  if (currentView === "confirmation" && bookingConfirmation) {
    return (
      <BookingConfirmation
        bookingId={bookingConfirmation.bookingId}
        customerName={bookingConfirmation.customerName}
        customerPhone={bookingConfirmation.customerPhone}
        vehicleInfo={bookingConfirmation.vehicleInfo}
        bookingDetails={bookingConfirmation.bookingDetails}
        totalAmount={bookingConfirmation.totalAmount}
        onNewBooking={handleNewBooking}
        onBackToHome={handleNewBooking}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4 text-gray-900">Rental Mobil Terpercaya</h1>
          <p className="text-xl text-gray-600">
            Temukan kendaraan yang tepat untuk perjalanan Anda
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Cari Kendaraan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Service Type */}
              <div className="lg:col-span-3">
                <Label className="text-base mb-3 block">Jenis Layanan</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={searchCriteria.serviceType === "without_driver" ? "default" : "outline"}
                    className="h-16 flex-col gap-2"
                    onClick={() => setSearchCriteria(prev => ({ ...prev, serviceType: "without_driver" }))}
                  >
                    <Car className="h-6 w-6" />
                    <span>Tanpa Sopir</span>
                  </Button>
                  <Button
                    variant={searchCriteria.serviceType === "with_driver" ? "default" : "outline"}
                    className="h-16 flex-col gap-2"
                    onClick={() => setSearchCriteria(prev => ({ ...prev, serviceType: "with_driver" }))}
                  >
                    <Users className="h-6 w-6" />
                    <span>Dengan Sopir</span>
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-base mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Lokasi Penjemputan
                </Label>
                <Input
                  id="location"
                  placeholder="Masukkan alamat atau area"
                  value={searchCriteria.location}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="startDate" className="text-base mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Tanggal Mulai
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={searchCriteria.startDate}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration" className="text-base mb-2 block">
                  Durasi (Hari)
                </Label>
                <Select
                  value={searchCriteria.duration.toString()}
                  onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, duration: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 14, 21, 30].map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {day} Hari
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pickup Time */}
              <div className="lg:col-span-2">
                <Label htmlFor="pickupTime" className="text-base mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Waktu Penjemputan
                </Label>
                <Input
                  id="pickupTime"
                  type="time"
                  value={searchCriteria.pickupTime}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, pickupTime: e.target.value }))}
                />
              </div>

              {/* Search Button */}
              <div className="lg:col-span-1 flex items-end">
                <Button 
                  className="w-full h-12"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? "Mencari..." : "Cari Kendaraan"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">
                Kendaraan Tersedia ({searchResults.length})
              </h2>
              {searchCriteria.serviceType && (
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {getServiceTypeLabel()}
                </Badge>
              )}
            </div>

            {searchResults.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl mb-2">Tidak Ada Kendaraan Tersedia</h3>
                  <p className="text-gray-600">
                    Maaf, tidak ada kendaraan yang tersedia untuk kriteria pencarian Anda.
                    Silakan coba dengan tanggal atau lokasi yang berbeda.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {searchResults.map((vehicle, index) => (
                  <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row relative min-h-[140px]">
                        {/* Promotional Badge */}
                        <div className="absolute top-3 right-3 z-10 flex flex-col items-end">
                          <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs px-2 py-1 mb-1">
                            Pesta Diskon 17-an
                          </Badge>
                          <div className="text-right text-xs text-gray-500">
                            <div>+{index + 5}</div>
                            <div>Dari</div>
                          </div>
                        </div>

                        {/* Vehicle Image */}
                        <div className="w-full sm:w-40 h-32 sm:h-auto bg-gray-200 flex-shrink-0">
                          <ImageWithFallback
                            src={vehicle.image_url || vehicle.gallery_images?.[0] || `https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&q=80`}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Vehicle Details */}
                        <div className="flex-1 p-4 pr-16 sm:pr-4">
                          <div className="flex flex-col sm:flex-row justify-between h-full">
                            <div className="flex-1 mb-4 sm:mb-0">
                              {/* Vehicle Name */}
                              <h3 className="text-lg mb-2 pr-8 sm:pr-0">
                                {vehicle.brand} {vehicle.model}
                              </h3>

                              {/* Specifications Row */}
                              <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-600">
                                {/* Transmission */}
                                <div className="flex items-center gap-1">
                                  <Cog className="h-4 w-4 text-gray-500" />
                                  <span className="uppercase">{vehicle.transmission}</span>
                                </div>

                                {/* Luggage Capacity */}
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4 text-blue-500" />
                                  <span>2 bagasi</span>
                                </div>

                                {/* Seat Capacity */}
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-blue-500" />
                                  <span>{vehicle.capacity} kursi</span>
                                </div>
                              </div>

                              {/* Service Type & Provider Count */}
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span>{getServiceTypeLabel()}</span>
                                <span className="text-blue-600 underline cursor-pointer">
                                  {getProviderCount(vehicle)} penyedia tersedia
                                </span>
                              </div>
                            </div>

                            {/* Price & Button */}
                            <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-end text-right sm:ml-4 gap-4">
                              <div>
                                <div className="text-xl text-orange-600 mb-1">
                                  {formatCurrency(getVehiclePrice(vehicle))}
                                </div>
                                <span className="text-sm text-gray-500">/hari</span>
                                {searchCriteria.duration > 1 && (
                                  <div className="text-sm text-gray-500 mt-1">
                                    Total: {formatCurrency(getTotalPrice(vehicle))}
                                  </div>
                                )}
                              </div>
                              <Button 
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 whitespace-nowrap"
                                onClick={() => handleVehicleSelect(vehicle)}
                              >
                                Lanjutkan
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        {!hasSearched && (
          <Card className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl mb-4">Siap Memulai Perjalanan Anda?</h2>
              <p className="text-xl mb-6 text-blue-100">
                Dapatkan kendaraan berkualitas dengan harga terbaik
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <Car className="h-12 w-12 mx-auto mb-3 text-blue-200" />
                  <h3 className="text-lg mb-2">Kendaraan Terawat</h3>
                  <p className="text-blue-100">Fleet kendaraan yang selalu dalam kondisi prima</p>
                </div>
                <div>
                  <Users className="h-12 w-12 mx-auto mb-3 text-blue-200" />
                  <h3 className="text-lg mb-2">Sopir Berpengalaman</h3>
                  <p className="text-blue-100">Sopir profesional dan berpengalaman</p>
                </div>
                <div>
                  <Star className="h-12 w-12 mx-auto mb-3 text-blue-200" />
                  <h3 className="text-lg mb-2">Pelayanan Terbaik</h3>
                  <p className="text-blue-100">Kepuasan pelanggan adalah prioritas utama</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}