"use client";

import { useState, useEffect } from "react";
import { api, Expense, Child, ExpenseStats, User } from "@/lib/api";
import { AuthGuard } from "@/lib/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PieChart,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Car,
  GraduationCap,
  Heart,
  Home,
  Gamepad2,
  Trash2,
  Filter,
  Calendar as CalendarIcon,
} from "lucide-react";
import { ChildSelector } from "@/components/child-selector/child-selector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/sidebar-trigger/sidebar-trigger";
import { Sidebar } from "@/components/sidebar/sidebar";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { getExpenseCategoryLabel } from "@/constants/enums";
import { validateExpenseForm, FormErrors, ExpenseFormData } from "@/types/validations";
import { formatAmount, parseAmount } from "@/utils/currency";
import { useAuth } from "@/lib/auth-context";

// Using Expense interface from API

function ExpensesPageContent() {
  const { user: authUser, isAuthenticated } = useAuth();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state for modal
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    childId: '',
    category: '',
    date: '',
    description: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // API data state
  const [children, setChildren] = useState<Child[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load data on component mount - but only when authenticated
  useEffect(() => {
    if (isAuthenticated && authUser) {
      loadInitialData();
    } else {
    }
  }, [isAuthenticated, authUser]);

  // Load expenses when selected child changes (only after initial load)
  useEffect(() => {
    if (children.length > 0 && selectedChild?.id) {
      loadExpensesForChild(selectedChild.id);
      loadStatsForChild(selectedChild.id);
    }
  }, [selectedChild?.id, children.length]); // Only trigger when child ID changes

  const loadExpensesForChild = async (childId: string) => {
    try {
      const response = await api.getExpenses({ childId });
      if (response.data) {
        setExpenses(response.data);
      } else if (response.error) {
        setErrorMessage(response.error);
      }
    } catch (error) {
      setErrorMessage("Harcamalar yüklenirken bir hata oluştu");
    }
  };

  const loadStatsForChild = async (childId: string) => {
    try {
      const response = await api.getExpenseStats(childId);
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      setErrorMessage("İstatistikler yüklenirken bir sorun oluştu");
    }
  };

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      // Verify we have authentication
      if (!api.isAuthenticated()) {
        console.error('No authentication token available');
        setErrorMessage('Authentication required. Please login again.');
        return;
      }
      
      // Load user profile
      const profileResponse = await api.getProfile();
      if (profileResponse.data) {
        setCurrentUser(profileResponse.data);
      } else {
        console.error('Failed to load profile:', profileResponse.error);
      }

      // Load children
      const childrenResponse = await api.getChildren();
      
      if (childrenResponse.data && childrenResponse.data.length > 0) {
        setChildren(childrenResponse.data);
        if (!selectedChild) {
          setSelectedChild(childrenResponse.data[0]);
          // useEffect will handle loading expenses and stats
        }
      } else {
        setChildren([]);
      }

      if (childrenResponse.error) {
        console.error('Children API error:', childrenResponse.error);
        setErrorMessage('Çocuk bilgileri yüklenirken hata oluştu: ' + childrenResponse.error);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setErrorMessage("Veri yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };


  const expenseCategories = [
    { id: "EDUCATION", name: getExpenseCategoryLabel("EDUCATION"), icon: GraduationCap, color: "bg-blue-500" },
    { id: "HEALTH", name: getExpenseCategoryLabel("HEALTH"), icon: Heart, color: "bg-red-500" },
    { id: "CLOTHING", name: getExpenseCategoryLabel("CLOTHING"), icon: ShoppingCart, color: "bg-green-500" },
    { id: "TRANSPORTATION", name: getExpenseCategoryLabel("TRANSPORTATION"), icon: Car, color: "bg-yellow-500" },
    { id: "FOOD", name: getExpenseCategoryLabel("FOOD"), icon: Home, color: "bg-purple-500" },
    { id: "ENTERTAINMENT", name: getExpenseCategoryLabel("ENTERTAINMENT"), icon: Gamepad2, color: "bg-pink-500" },
    { id: "OTHER", name: getExpenseCategoryLabel("OTHER"), icon: ShoppingCart, color: "bg-gray-500" },
  ];

  const totalStats = {
    events: children.reduce((sum, child) => sum + (child._count?.activities || 0), 0),
    messages: children.reduce((sum, child) => sum + (child._count?.messages || 0), 0),
    expenses: children.reduce((sum, child) => sum + (child._count?.expenses || 0), 0),
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setFormErrors({});

    // Validate form
    const errors = validateExpenseForm(formData as ExpenseFormData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {

      const expenseData = {
        title: formData.title,
        amount: parseAmount(formData.amount),
        category: formData.category as Expense['category'],
        expenseDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : formData.date,
        childId: formData.childId,
        description: formData.description || undefined,
      };

      const response = await api.createExpense(expenseData);
      
      if (response.data) {
        setSuccessMessage("Harcama başarıyla eklendi!");
        setIsAddExpenseOpen(false);
        
        // Reset form
        setFormData({
          title: '',
          amount: '',
          childId: children.length > 0 ? children[0].id : '',
          category: '',
          date: '',
          description: ''
        });
        setSelectedDate(new Date());
        setFormErrors({});
        
        // Reload expenses and stats
        if (selectedChild?.id) {
          await loadExpensesForChild(selectedChild.id);
          await loadStatsForChild(selectedChild.id);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else if (response.error) {
        setErrorMessage(response.error);
      }
    } catch (error) {
      setErrorMessage("Harcama eklenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAmount(e.target.value);
    setFormData(prev => ({ ...prev, amount: formattedValue }));
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const response = await api.deleteExpense(expenseId);
      
      if (response.error) {
        setErrorMessage(response.error);
      } else {
        setSuccessMessage("Harcama başarıyla silindi!");
        // Reload expenses and stats
        if (selectedChild?.id) {
          await loadExpensesForChild(selectedChild.id);
          await loadStatsForChild(selectedChild.id);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Harcama silinirken bir hata oluştu");
    }
  };

  const canDeleteExpense = (expense: Expense) => {
    return expense.createdById === currentUser?.id;
  };

  const filteredExpenses = expenses; // Already filtered by API based on selectedChild

  // Use stats from API
  const displayStats = stats || {
    total: 0,
    thisMonth: 0,
    change: 0,
    averageExpense: 0,
  };

  // Map API children to component format
  const mappedChildren = children.map(child => ({
    id: parseInt(child.id.slice(-6), 16), // Convert to number for component
    name: `${child.firstName} ${child.lastName}`,
    age: Math.floor((new Date().getTime() - new Date(child.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)),
    avatar: child.firstName.charAt(0).toUpperCase(),
    school: 'Okul', // Default value since not in API
  }));

  const mappedSelectedChild = selectedChild ? {
    id: parseInt(selectedChild.id.slice(-6), 16),
    name: `${selectedChild.firstName} ${selectedChild.lastName}`,
    age: Math.floor((new Date().getTime() - new Date(selectedChild.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)),
    avatar: selectedChild.firstName.charAt(0).toUpperCase(),
    school: 'Okul',
  } : mappedChildren[0];

  const handleChildSelectorChange = (mappedChild: { id: number; name: string; age: number; avatar: string; school: string }) => {
    const apiChild = children.find(c => 
      `${c.firstName} ${c.lastName}` === mappedChild.name
    );
    if (apiChild) {
      setSelectedChild(apiChild);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        children={mappedChildren}
        selectedChild={mappedSelectedChild}
        onChildChange={handleChildSelectorChange}
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

              {/* Logo and KidBridge - hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center justify-center">
                  <img
                    src="/kid-bridge-logo1.png"
                    alt="KidBridge Logo"
                    className="w-12 h-12 flex-shrink-0"/>
                </div>
                <span className="text-xl font-bold text-gray-900 whitespace-nowrap">KidBridge</span>
              </div>
              
              {/* Breadcrumb Navigation - hidden on mobile */}
              <div className="hidden md:block">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href="/dashboard" className="flex items-center space-x-1">
                          <Home className="w-4 h-4" />
                          <span>Ana Sayfa</span>
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="flex items-center space-x-1">
                        <PieChart className="w-4 h-4" />
                        <span>Harcamalar</span>
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <ChildSelector
                children={mappedChildren}
                selectedChild={mappedSelectedChild}
                onChildChange={handleChildSelectorChange}
              />

              <Button onClick={() => {
                setIsAddExpenseOpen(true);
                // Set default values when opening modal
                setFormData({
                  title: '',
                  amount: '',
                  childId: selectedChild?.id || '',
                  category: '',
                  date: new Date().toISOString().split('T')[0], // Today's date
                  description: ''
                });
                setSelectedDate(new Date());
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Harcama
              </Button>

              {/* Custom Modal */}
              {isAddExpenseOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 bg-black/50" 
                    onClick={() => setIsAddExpenseOpen(false)}
                  />
                  
                  {/* Modal Content */}
                  <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-lg font-semibold">Yeni Harcama Ekle</h2>
                          <p className="text-sm text-gray-600">Çocuğunuz için yeni bir harcama kaydı oluşturun</p>
                        </div>
                        <button
                          onClick={() => setIsAddExpenseOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleAddExpense}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title" className="block text-sm font-medium mb-1">
                              Başlık
                            </Label>
                            <Input
                              id="title"
                              name="title"
                              className={`w-full ${formErrors.title ? 'border-red-500' : ''}`}
                              value={formData.title}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, title: e.target.value }));
                                if (formErrors.title) {
                                  setFormErrors(prev => ({ ...prev, title: undefined }));
                                }
                              }}
                              required
                            />
                            {formErrors.title && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="amount" className="block text-sm font-medium mb-1">
                              Tutar (₺)
                            </Label>
                            <Input
                              id="amount"
                              name="amount"
                              type="text"
                              className={`w-full ${formErrors.amount ? 'border-red-500' : ''}`}
                              value={formData.amount}
                              onChange={(e) => {
                                handleAmountChange(e);
                                if (formErrors.amount) {
                                  setFormErrors(prev => ({ ...prev, amount: undefined }));
                                }
                              }}
                              placeholder="1.250,00"
                              required
                            />
                            {formErrors.amount && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="childId" className="block text-sm font-medium mb-1">
                              Çocuk
                            </Label>
                            <Select 
                              value={formData.childId} 
                              onValueChange={(value) => {
                                setFormData(prev => ({ ...prev, childId: value }));
                                if (formErrors.childId) {
                                  setFormErrors(prev => ({ ...prev, childId: undefined }));
                                }
                              }}
                              required
                            >
                              <SelectTrigger className={`w-full ${formErrors.childId ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Çocuk seçin">
                                  {formData.childId ? (
                                    (() => {
                                      const child = children.find(c => c.id === formData.childId);
                                      return child ? `${child.firstName} ${child.lastName}` : "Çocuk seçin";
                                    })()
                                  ) : (
                                    "Çocuk seçin"
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {children.map((child) => (
                                  <SelectItem key={child.id} value={child.id}>
                                    {child.firstName} {child.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.childId && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.childId}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="category" className="block text-sm font-medium mb-1">
                              Kategori
                            </Label>
                            <Select 
                              value={formData.category} 
                              onValueChange={(value) => {
                                setFormData(prev => ({ ...prev, category: value }));
                                if (formErrors.category) {
                                  setFormErrors(prev => ({ ...prev, category: undefined }));
                                }
                              }}
                              required
                            >
                              <SelectTrigger className={`w-full ${formErrors.category ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Kategori seçin">
                                  {formData.category ? (
                                    <div className="flex items-center space-x-2">
                                      {(() => {
                                        const category = expenseCategories.find(cat => cat.id === formData.category);
                                        const IconComponent = category?.icon || ShoppingCart;
                                        return (
                                          <>
                                            <IconComponent className="w-4 h-4" />
                                            <span>{category?.name}</span>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  ) : (
                                    "Kategori seçin"
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {expenseCategories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    <div className="flex items-center space-x-2">
                                      <category.icon className="w-4 h-4" />
                                      <span>{category.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.category && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="date" className="block text-sm font-medium mb-1">
                              Tarih
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-start text-left font-normal ${formErrors.date ? 'border-red-500' : ''}`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: tr }) : "Tarih seçin"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={(date) => {
                                    setSelectedDate(date);
                                    if (date) {
                                      setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
                                      if (formErrors.date) {
                                        setFormErrors(prev => ({ ...prev, date: undefined }));
                                      }
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {formErrors.date && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="description" className="block text-sm font-medium mb-1">
                              Açıklama
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              className="w-full"
                              rows={3}
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-6">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsAddExpenseOpen(false)}
                            disabled={isSubmitting}
                          >
                            İptal
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Ekleniyor..." : "Harcama Ekle"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Add Button */}
            <Button 
              size="sm" 
              className="lg:hidden"
              onClick={() => {
                setIsAddExpenseOpen(true);
                // Set default values when opening modal
                setFormData({
                  title: '',
                  amount: '',
                  childId: selectedChild?.id || '',
                  category: '',
                  date: new Date().toISOString().split('T')[0], // Today's date
                  description: ''
                });
                setSelectedDate(new Date());
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
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
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
            Veriler yükleniyor...
          </div>
        )}

        {/* Mobile Child Selector */}
        <div className="lg:hidden mb-4">
          <ChildSelector
            children={mappedChildren}
            selectedChild={mappedSelectedChild}
            onChildChange={handleChildSelectorChange}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Harcama
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₺{displayStats.total.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₺{displayStats.thisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {displayStats.change > 0 ? "+" : ""}
                {displayStats.change.toFixed(1)}% geçen aya göre
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ortalama</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₺{displayStats.averageExpense.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">Harcama başına</p>
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>
                Harcama Listesi
                {selectedChild && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    - {selectedChild.firstName} {selectedChild.lastName}
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrele
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tümü</TabsTrigger>
                <TabsTrigger value="EDUCATION">Eğitim</TabsTrigger>
                <TabsTrigger value="HEALTH">Sağlık</TabsTrigger>
                <TabsTrigger value="other">Diğer</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {filteredExpenses.map((expense) => {
                  const category = expenseCategories.find(
                    (cat) => cat.id === expense.category
                  );
                  const IconComponent = category?.icon || ShoppingCart;

                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-lg ${
                            category?.color || "bg-gray-500"
                          } bg-opacity-10`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{expense.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>
                              {new Date(expense.expenseDate).toLocaleDateString(
                                "tr-TR"
                              )}
                            </span>
                            <span>•</span>
                            <span>{expense.child.firstName} {expense.child.lastName}</span>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              {expense.createdBy.firstName} {expense.createdBy.lastName}
                            </Badge>
                          </div>
                          {expense.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {expense.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="sm:text-right">
                          <div className="font-bold text-lg">
                            ₺{expense.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category?.name}
                          </div>
                        </div>
                        {canDeleteExpense(expense) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              {expenseCategories.slice(0, 3).map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="space-y-4 mt-4"
                >
                  {filteredExpenses
                    .filter((expense) => expense.category === category.id)
                    .map((expense) => {
                      const IconComponent = category.icon;

                      return (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`p-2 rounded-lg ${category.color} bg-opacity-10`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{expense.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>
                                  {new Date(expense.expenseDate).toLocaleDateString(
                                    "tr-TR"
                                  )}
                                </span>
                                <span>•</span>
                                <span>{expense.child.firstName} {expense.child.lastName}</span>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">
                                  {expense.createdBy.firstName} {expense.createdBy.lastName}
                                </Badge>
                              </div>
                              {expense.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {expense.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="sm:text-right">
                              <div className="font-bold text-lg">
                                ₺{expense.amount.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {category.name}
                              </div>
                            </div>
                            {canDeleteExpense(expense) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </TabsContent>
              ))}

              <TabsContent value="other" className="space-y-4 mt-4">
                {filteredExpenses
                  .filter(
                    (expense) =>
                      !["EDUCATION", "HEALTH"].includes(expense.category)
                  )
                  .map((expense) => {
                    const category = expenseCategories.find(
                      (cat) => cat.id === expense.category
                    );
                    const IconComponent = category?.icon || ShoppingCart;

                    return (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-lg ${
                              category?.color || "bg-gray-500"
                            } bg-opacity-10`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{expense.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>
                                {new Date(expense.date).toLocaleDateString(
                                  "tr-TR"
                                )}
                              </span>
                              <span>•</span>
                              <span>{expense.child}</span>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                {expense.responsible}
                              </Badge>
                            </div>
                            {expense.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {expense.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="sm:text-right">
                            <div className="font-bold text-lg">
                              ₺{expense.amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {category?.name}
                            </div>
                          </div>
                          {canDeleteExpense(expense) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  return (
    <AuthGuard>
      <ExpensesPageContent />
    </AuthGuard>
  );
}
