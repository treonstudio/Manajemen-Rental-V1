import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { CheckSquare, Camera, Upload, Plus, Eye } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface ConditionCheck {
  id: string
  vehicleId: string
  vehicleName: string
  plateNumber: string
  type: "checkin" | "checkout"
  date: string
  odometer: number
  fuelLevel: number
  checklist: {
    exteriorCondition: boolean
    interiorCondition: boolean
    engineCondition: boolean
    tiresCondition: boolean
    lightsWorking: boolean
    documentsComplete: boolean
  }
  photos: string[]
  notes: string
  inspector: string
}

const mockConditionChecks: ConditionCheck[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleName: "Toyota Avanza",
    plateNumber: "B 1234 ABC",
    type: "checkout",
    date: "2024-08-10 14:30",
    odometer: 45230,
    fuelLevel: 85,
    checklist: {
      exteriorCondition: true,
      interiorCondition: true,
      engineCondition: true,
      tiresCondition: true,
      lightsWorking: true,
      documentsComplete: true
    },
    photos: ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=200&fit=crop"],
    notes: "Kondisi kendaraan sangat baik, siap untuk disewakan",
    inspector: "Ahmad Rizki"
  },
  {
    id: "2",
    vehicleId: "2",
    vehicleName: "Honda Brio", 
    plateNumber: "B 5678 DEF",
    type: "checkin",
    date: "2024-08-09 16:45",
    odometer: 32150,
    fuelLevel: 45,
    checklist: {
      exteriorCondition: true,
      interiorCondition: false,
      engineCondition: true,
      tiresCondition: true,
      lightsWorking: true,
      documentsComplete: true
    },
    photos: ["https://images.unsplash.com/photo-1549399504-8c8e2c88e2ae?w=300&h=200&fit=crop"],
    notes: "Interior perlu dibersihkan, ada bekas makanan di kursi belakang",
    inspector: "Siti Nurhaliza"
  }
]

const checklistItems = [
  { key: "exteriorCondition", label: "Kondisi Eksterior" },
  { key: "interiorCondition", label: "Kondisi Interior" },
  { key: "engineCondition", label: "Kondisi Mesin" },
  { key: "tiresCondition", label: "Kondisi Ban" },
  { key: "lightsWorking", label: "Lampu Berfungsi" },
  { key: "documentsComplete", label: "Dokumen Lengkap" }
]

export function UnitCondition() {
  const [conditionChecks, setConditionChecks] = useState<ConditionCheck[]>(mockConditionChecks)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [newCheck, setNewCheck] = useState({
    vehicleId: "",
    type: "checkin" as "checkin" | "checkout",
    odometer: "",
    fuelLevel: "",
    notes: "",
    checklist: {
      exteriorCondition: false,
      interiorCondition: false,
      engineCondition: false,
      tiresCondition: false,
      lightsWorking: false,
      documentsComplete: false
    }
  })

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setSelectedPhotos(Array.from(files))
    }
  }

  const handleChecklistChange = (key: string, checked: boolean) => {
    setNewCheck(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [key]: checked
      }
    }))
  }

  const getTypeBadge = (type: string) => {
    return type === "checkin" ? 
      <Badge variant="secondary">Check In</Badge> : 
      <Badge variant="default">Check Out</Badge>
  }

  const getConditionScore = (checklist: any) => {
    const passed = Object.values(checklist).filter(Boolean).length
    const total = Object.values(checklist).length
    return Math.round((passed / total) * 100)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Kondisi Unit Kendaraan
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pemeriksaan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Pemeriksaan Kondisi Kendaraan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicle">Kendaraan</Label>
                      <Select value={newCheck.vehicleId} onValueChange={(value) => setNewCheck(prev => ({ ...prev, vehicleId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kendaraan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Toyota Avanza - B 1234 ABC</SelectItem>
                          <SelectItem value="2">Honda Brio - B 5678 DEF</SelectItem>
                          <SelectItem value="3">Mitsubishi Pajero - B 9012 GHI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Jenis Pemeriksaan</Label>
                      <Select value={newCheck.type} onValueChange={(value: "checkin" | "checkout") => setNewCheck(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkin">Check In</SelectItem>
                          <SelectItem value="checkout">Check Out</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="odometer">Odometer (KM)</Label>
                      <Input 
                        id="odometer" 
                        type="number" 
                        placeholder="45230"
                        value={newCheck.odometer}
                        onChange={(e) => setNewCheck(prev => ({ ...prev, odometer: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fuel">Level BBM (%)</Label>
                      <Input 
                        id="fuel" 
                        type="number" 
                        placeholder="85"
                        value={newCheck.fuelLevel}
                        onChange={(e) => setNewCheck(prev => ({ ...prev, fuelLevel: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Checklist Pemeriksaan</Label>
                    <div className="space-y-2 mt-2">
                      {checklistItems.map((item) => (
                        <div key={item.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.key}
                            checked={newCheck.checklist[item.key as keyof typeof newCheck.checklist]}
                            onCheckedChange={(checked) => handleChecklistChange(item.key, checked as boolean)}
                          />
                          <Label htmlFor={item.key}>{item.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="photos">Upload Foto</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <label htmlFor="photos" className="cursor-pointer">
                        <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Klik untuk upload foto</p>
                      </label>
                    </div>
                    {selectedPhotos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm">{selectedPhotos.length} foto dipilih</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Catatan</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Catatan tambahan tentang kondisi kendaraan..."
                      value={newCheck.notes}
                      onChange={(e) => setNewCheck(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setIsAddDialogOpen(false)}>Simpan</Button>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conditionChecks.map((check) => (
              <Card key={check.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{check.vehicleName}</h3>
                      <p className="text-sm text-muted-foreground">{check.plateNumber}</p>
                      <p className="text-sm text-muted-foreground">{check.date}</p>
                    </div>
                    <div className="flex gap-2">
                      {getTypeBadge(check.type)}
                      <Badge variant="outline">
                        {getConditionScore(check.checklist)}% OK
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Odometer</p>
                      <p className="font-medium">{check.odometer.toLocaleString()} KM</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">BBM</p>
                      <p className="font-medium">{check.fuelLevel}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pemeriksa</p>
                      <p className="font-medium">{check.inspector}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </div>
                  </div>

                  {check.photos.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-2">Foto Dokumentasi</p>
                      <div className="flex gap-2">
                        {check.photos.map((photo, index) => (
                          <ImageWithFallback
                            key={index}
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {check.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Catatan</p>
                      <p className="text-sm">{check.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}