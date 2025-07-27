"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChildSelector } from "@/components/child-selector/child-selector";
import { MilestoneTracker } from "@/components/milestone-tracker/milestone-tracker";
import { DevelopmentInsights } from "@/components/development-insights/development-insights";
import { DevelopmentPDFReport } from "@/components/development-pdf-report/development-pdf-report";
import {
  TrendingUp,
  ArrowLeft,
  Brain,
  Heart,
  Users,
  Zap,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function DevelopmentPage() {
  const children = [
    {
      id: 1,
      name: "Elif",
      age: 8,
      avatar: "E",
      school: "Atatürk İlkokulu",
      ageGroup: "school-age",
    },
    {
      id: 2,
      name: "Can",
      age: 12,
      avatar: "C",
      school: "Gazi Ortaokulu",
      ageGroup: "pre-teen",
    },
    {
      id: 3,
      name: "Zeynep",
      age: 6,
      avatar: "Z",
      school: "Minik Adımlar Anaokulu",
      ageGroup: "preschool",
    },
  ];

  const [selectedChild, setSelectedChild] = useState(children[0]);

  // Basitleştirilmiş gelişim alanları
  const getDevelopmentAreas = (ageGroup: string) => {
    const areas = {
      preschool: [
        { id: "physical", name: "Fiziksel", icon: Zap, color: "bg-red-500" },
        {
          id: "cognitive",
          name: "Bilişsel",
          icon: Brain,
          color: "bg-blue-500",
        },
        { id: "social", name: "Sosyal", icon: Users, color: "bg-green-500" },
        {
          id: "emotional",
          name: "Duygusal",
          icon: Heart,
          color: "bg-purple-500",
        },
      ],
      "school-age": [
        { id: "academic", name: "Akademik", icon: Brain, color: "bg-blue-500" },
        { id: "physical", name: "Fiziksel", icon: Zap, color: "bg-red-500" },
        { id: "social", name: "Sosyal", icon: Users, color: "bg-green-500" },
        {
          id: "emotional",
          name: "Duygusal",
          icon: Heart,
          color: "bg-purple-500",
        },
      ],
      "pre-teen": [
        { id: "academic", name: "Akademik", icon: Brain, color: "bg-blue-500" },
        { id: "physical", name: "Fiziksel", icon: Zap, color: "bg-red-500" },
        { id: "social", name: "Sosyal", icon: Users, color: "bg-green-500" },
        {
          id: "emotional",
          name: "Duygusal",
          icon: Heart,
          color: "bg-purple-500",
        },
      ],
    };
    return areas[ageGroup as keyof typeof areas] || areas["school-age"];
  };

  // Basitleştirilmiş gelişim verileri
  const getDevelopmentData = (childId: number) => {
    const data = {
      1: {
        academic: { current: 75, target: 80, trend: "+5" },
        physical: { current: 85, target: 85, trend: "+3" },
        social: { current: 70, target: 75, trend: "+8" },
        emotional: { current: 80, target: 85, trend: "+2" },
      },
      2: {
        academic: { current: 88, target: 90, trend: "+7" },
        physical: { current: 92, target: 95, trend: "+4" },
        social: { current: 85, target: 88, trend: "+6" },
        emotional: { current: 78, target: 85, trend: "+3" },
      },
      3: {
        physical: { current: 90, target: 90, trend: "+5" },
        cognitive: { current: 82, target: 85, trend: "+8" },
        social: { current: 95, target: 95, trend: "+2" },
        emotional: { current: 88, target: 90, trend: "+4" },
      },
    };
    return data[childId as keyof typeof data] || data[1];
  };

  const developmentAreas = getDevelopmentAreas(selectedChild.ageGroup);
  const developmentData = getDevelopmentData(selectedChild.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  Gelişim Takibi
                </h1>
              </div>
              <ChildSelector
                children={children}
                selectedChild={selectedChild}
                onChildChange={setSelectedChild}
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Gözlem Ekle
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Child Info Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-2xl bg-indigo-600 text-white">
                {selectedChild.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedChild.name}
              </h1>
              <p className="text-gray-600">
                {selectedChild.age} yaşında • {selectedChild.school}
              </p>
            </div>
          </div>

          {/* Development Overview Cards - Sadece Progress Bar'lar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {developmentAreas.map((area) => {
              const data =
                developmentData[area.id as keyof typeof developmentData];
              const IconComponent = area.icon;

              return (
                <Card key={area.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${area.color} rounded-lg flex items-center justify-center`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {area.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress
                            value={data?.current || 0}
                            className="flex-1 h-2"
                          />
                          <span className="text-sm font-bold">
                            {data?.current || 0}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            Hedef: {data?.target || 0}%
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {data?.trend || "+0"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* MVP Tab Yapısı - Sadece 3 Tab */}
        <Tabs defaultValue="milestones" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="milestones">Kilometre Taşları</TabsTrigger>
            <TabsTrigger value="insights">Basit Öngörüler</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones">
            <MilestoneTracker
              child={selectedChild}
              ageGroup={selectedChild.ageGroup}
            />
          </TabsContent>

          <TabsContent value="insights">
            <DevelopmentInsights
              child={selectedChild}
              developmentData={developmentData}
              ageGroup={selectedChild.ageGroup}
            />
          </TabsContent>

          <TabsContent value="reports">
            <DevelopmentPDFReport
              child={selectedChild}
              developmentData={developmentData}
              reportMonth="Ocak"
              reportYear="2024"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
