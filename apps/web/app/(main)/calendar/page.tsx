"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Edit,
  Trash2,
  GraduationCap,
  Heart,
  UsersIcon,
  FileText,
} from "lucide-react";
import { ChildSelector } from "@/components/child-selector/child-selector";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SidebarTrigger } from "@/components/sidebar-trigger/sidebar-trigger";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "okul" | "sağlık" | "sosyal" | "diğer";
  child: string;
  description?: string;
  reminder?: boolean;
}

export default function CalendarPage() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const children = [
    { id: 1, name: "Elif", age: 8, avatar: "E", school: "Atatürk İlkokulu" },
    { id: 2, name: "Can", age: 12, avatar: "C", school: "Gazi Ortaokulu" },
    { id: 3, name: "Zeynep", age: 6, avatar: "Z", school: "Anaokulu" },
  ];

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Veli Toplantısı",
      date: "2024-01-25",
      time: "14:00",
      location: "Okul Konferans Salonu",
      type: "okul",
      child: "Elif",
      description: "Dönem sonu değerlendirme toplantısı",
      reminder: true,
    },
    {
      id: 2,
      title: "Diş Hekimi Randevusu",
      date: "2024-01-28",
      time: "10:30",
      location: "Dr. Ahmet Klinik",
      type: "sağlık",
      child: "Elif",
      description: "6 aylık kontrol muayenesi",
      reminder: true,
    },
    {
      id: 3,
      title: "Doğum Günü Partisi",
      date: "2024-01-30",
      time: "15:00",
      location: "Arkadaş Evi",
      type: "sosyal",
      child: "Elif",
      description: "Sınıf arkadaşının doğum günü",
      reminder: false,
    },
  ]);

  const eventTypes = [
    {
      id: "okul",
      name: "Okul",
      icon: GraduationCap,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    },
    {
      id: "sağlık",
      name: "Sağlık",
      icon: Heart,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
    },
    {
      id: "sosyal",
      name: "Sosyal",
      icon: UsersIcon,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    },
    {
      id: "diğer",
      name: "Diğer",
      icon: FileText,
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
    },
  ];

  const totalStats = {
    events: children.reduce((sum) => sum + 2, 0),
    messages: children.reduce((sum) => sum + 1, 0),
    expenses: children.reduce((sum) => sum + 800, 0),
  };

  const handleAddEvent = async (formData: FormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newEvent: Event = {
      id: events.length + 1,
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as Event["type"],
      child: formData.get("child") as string,
      description: formData.get("description") as string,
      reminder: formData.get("reminder") === "on",
    };

    setEvents([...events, newEvent]);
    setIsAddEventOpen(false);
    setIsSubmitting(false);
    setSuccessMessage("Etkinlik başarıyla eklendi!");

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((e) => e.id !== eventId));
    setIsEventDetailOpen(false);
    setSuccessMessage("Etkinlik silindi!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const filteredEvents = selectedChild
    ? events.filter((event) => event.child === selectedChild.name)
    : events;

  const upcomingEvents = filteredEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const todayEvents = filteredEvents.filter((event) => {
    const today = new Date().toISOString().split("T")[0];
    return event.date === today;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        children={children}
        selectedChild={selectedChild || children[0]}
        onChildChange={setSelectedChild}
        totalStats={totalStats}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Sidebar Trigger */}
              <SidebarTrigger
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                totalStats={totalStats}
              />

              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Takvim</h1>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <ChildSelector
                children={children}
                selectedChild={selectedChild || children[0]}
                onChildChange={setSelectedChild}
              />

              <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Etkinlik
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleAddEvent(formData);
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
                      <DialogDescription>
                        Çocuğunuz için yeni bir etkinlik planlayın
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Başlık
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="child" className="text-right">
                          Çocuk
                        </Label>
                        <Select name="child" required>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Çocuk seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {children.map((child) => (
                              <SelectItem key={child.id} value={child.name}>
                                {child.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Tür
                        </Label>
                        <Select name="type" required>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Etkinlik türü seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                <div className="flex items-center space-x-2">
                                  <type.icon className="w-4 h-4" />
                                  <span>{type.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Tarih
                        </Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Saat
                        </Label>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                          Konum
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Açıklama
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reminder" className="text-right">
                          Hatırlatma
                        </Label>
                        <div className="col-span-3">
                          <input
                            type="checkbox"
                            id="reminder"
                            name="reminder"
                            className="mr-2"
                          />
                          <Label htmlFor="reminder" className="text-sm">
                            Etkinlik öncesi hatırlat
                          </Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Ekleniyor..." : "Etkinlik Ekle"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile Add Button */}
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="lg:hidden">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Mobile Child Selector */}
        <div className="lg:hidden mb-4">
          <ChildSelector
            children={children}
            selectedChild={selectedChild || children[0]}
            onChildChange={setSelectedChild}
          />
        </div>

        {/* Today's Events */}
        {todayEvents.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Bugünün Etkinlikleri</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayEvents.map((event) => {
                  const eventType = eventTypes.find(
                    (type) => type.id === event.type
                  );
                  const IconComponent = eventType?.icon || FileText;

                  return (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border cursor-pointer ${eventType?.bgColor} ${eventType?.borderColor}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent
                            className={`w-5 h-5 ${eventType?.textColor}`}
                          />
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                              {event.location && (
                                <>
                                  <span>•</span>
                                  <MapPin className="w-4 h-4" />
                                  <span>{event.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs ${eventType?.bgColor} ${eventType?.textColor}`}
                          >
                            {eventType?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>
                  Yaklaşan Etkinlikler
                  {selectedChild && (
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      - {selectedChild.name}
                    </span>
                  )}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const eventType = eventTypes.find(
                  (type) => type.id === event.type
                );
                const IconComponent = eventType?.icon || FileText;

                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${eventType?.bgColor}`}>
                        <IconComponent
                          className={`w-5 h-5 ${eventType?.textColor}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>
                            {new Date(event.date).toLocaleDateString("tr-TR")}
                          </span>
                          <span>•</span>
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                          <span>•</span>
                          <span>{event.child}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${eventType?.bgColor} ${eventType?.textColor}`}
                      >
                        {eventType?.name}
                      </span>
                      {event.reminder && (
                        <Badge variant="secondary" className="text-xs">
                          Hatırlatma
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* All Events */}
        <Card>
          <CardHeader>
            <CardTitle>Tüm Etkinlikler</CardTitle>
            <CardDescription>Geçmiş ve gelecek tüm etkinlikler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((event) => {
                  const eventType = eventTypes.find(
                    (type) => type.id === event.type
                  );
                  const IconComponent = eventType?.icon || FileText;
                  const isPast = new Date(event.date) < new Date();

                  return (
                    <div
                      key={event.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        isPast ? "opacity-60" : ""
                      }`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${eventType?.bgColor}`}>
                          <IconComponent
                            className={`w-5 h-5 ${eventType?.textColor}`}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>
                              {new Date(event.date).toLocaleDateString("tr-TR")}
                            </span>
                            <span>•</span>
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                            <span>•</span>
                            <span>{event.child}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${eventType?.bgColor} ${eventType?.textColor}`}
                        >
                          {eventType?.name}
                        </span>
                        {event.reminder && (
                          <Badge variant="secondary" className="text-xs">
                            Hatırlatma
                          </Badge>
                        )}
                        {isPast && (
                          <Badge variant="outline" className="text-xs">
                            Geçmiş
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
        <DialogContent className="sm:max-w-[500px] z-[60]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {(() => {
                    const eventType = eventTypes.find(
                      (type) => type.id === selectedEvent.type
                    );
                    const IconComponent = eventType?.icon || FileText;
                    return <IconComponent className="w-5 h-5" />;
                  })()}
                  <span>{selectedEvent.title}</span>
                </DialogTitle>
                <DialogDescription>Etkinlik Detayları</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600">
                      Tarih
                    </Label>
                    <p className="text-sm">
                      {new Date(selectedEvent.date).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600">
                      Saat
                    </Label>
                    <p className="text-sm">{selectedEvent.time}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600">
                      Çocuk
                    </Label>
                    <p className="text-sm">{selectedEvent.child}</p>
                  </div>
                </div>
                {selectedEvent.location && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600">
                      Konum
                    </Label>
                    <p className="text-sm flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedEvent.location}</span>
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">
                    Tür
                  </Label>
                  <p className="text-sm">
                    {
                      eventTypes.find((type) => type.id === selectedEvent.type)
                        ?.name
                    }
                  </p>
                </div>
                {selectedEvent.description && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600">
                      Açıklama
                    </Label>
                    <p className="text-sm text-gray-700">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
                {selectedEvent.reminder && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      Hatırlatma Aktif
                    </Badge>
                  </div>
                )}
              </div>
              <DialogFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sil
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
