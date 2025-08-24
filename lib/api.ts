import { translateErrorMessage } from '@/constants/error-messages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: string;
  profileImageUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parents: User[];
  _count?: {
    messages: number;
    expenses: number;
    activities: number;
    documents: number;
    milestones: number;
  };
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: 'EDUCATION' | 'HEALTH' | 'CLOTHING' | 'FOOD' | 'ENTERTAINMENT' | 'TRANSPORTATION' | 'OTHER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  receiptUrl?: string;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  childId: string;
  child: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ExpenseStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  change: number;
  categoryStats: Record<string, { total: number; count: number }>;
  totalExpenses: number;
  averageExpense: number;
}

export interface CreateExpenseData {
  title: string;
  description?: string;
  amount: number;
  category: Expense['category'];
  expenseDate: string;
  childId: string;
  receiptUrl?: string;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const token = localStorage.getItem('auth_token');
      return token;
    } catch (error) {
      console.error('Failed to get auth token from localStorage:', error);
      return null;
    }
  }

  private setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to set auth token in localStorage:', error);
    }
  }

  private removeAuthToken(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to remove auth token from localStorage:', error);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        let errorText: string;
        try {
          const errorData = await response.json();
          errorText = errorData.message || errorData.error || `HTTP ${response.status}`;
        } catch {
          errorText = await response.text() || `HTTP ${response.status}`;
        }
        
        // 401 error handling - sadece auth endpoint'leri dışında token'ı temizle
        if (response.status === 401) {
          // Login endpoint'inde 401 = yanlış şifre, token temizlemeye gerek yok
          if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
            // Diğer endpoint'lerde 401 = token expired/invalid
            this.removeAuthToken();
            return { error: translateErrorMessage('Authentication failed. Please login again.') };
          }
          // Login endpoint'inde 401 ise gerçek error mesajını çevir
          return { error: translateErrorMessage(errorText) };
        }
        
        // Diğer HTTP hataları için error mesajını çevir
        return { error: translateErrorMessage(errorText) };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { error: translateErrorMessage('Network connection failed. Please check your connection.') };
      }
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { error: translateErrorMessage(errorMessage) };
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<{ access_token: string; user: User }>> {
    // Input validation - SADECE boş alan kontrolü
    if (!email || !password) {
      return { error: translateErrorMessage('Email and password are required') };
    }
    
    if (!email.includes('@') || email.length < 3) {
      return { error: translateErrorMessage('Please enter a valid email address') };
    }
    
    // ❌ Şifre uzunluk kontrolünü kaldırıyoruz - kullanıcı zaten şifresini biliyor

    const response = await this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
    });

    // Store token securely if login successful
    if (response.data?.access_token) {
      this.setAuthToken(response.data.access_token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.removeAuthToken();
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (!token) {
      return false;
    }
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.removeAuthToken();
        return false;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000;
      const isValid = Date.now() < exp;
      
      if (!isValid) {
        this.removeAuthToken();
      }
      
      return isValid;
    } catch (error) {
      this.removeAuthToken();
      return false;
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<User>> {
    // Input validation - Kayıt işleminde GEREKLI
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return { error: translateErrorMessage('All fields are required') };
    }
    
    if (!userData.email.includes('@') || userData.email.length < 3) {
      return { error: translateErrorMessage('Please enter a valid email address') };
    }
    
    // ✅ Register'da şifre uzunluk kontrolü OLMALI
    if (userData.password.length < 8) {
      return { error: translateErrorMessage('Password must be at least 8 characters long') };
    }
    
    if (userData.firstName.trim().length < 2) {
      return { error: translateErrorMessage('First name must be at least 2 characters long') };
    }
    
    if (userData.lastName.trim().length < 2) {
      return { error: translateErrorMessage('Last name must be at least 2 characters long') };
    }

    // Sanitize input data
    const sanitizedData = {
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
    };

    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request('/auth/profile');
  }

  // Children methods
  async getChildren(): Promise<ApiResponse<Child[]>> {
    return this.request('/children');
  }

  async getChild(id: string): Promise<ApiResponse<Child>> {
    return this.request(`/children/${id}`);
  }

  async createChild(childData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender?: string;
    notes?: string;
    profileImageUrl?: string;
  }): Promise<ApiResponse<Child>> {
    return this.request('/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  }

  async updateChild(id: string, childData: Partial<Child>): Promise<ApiResponse<Child>> {
    return this.request(`/children/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(childData),
    });
  }

  async deleteChild(id: string): Promise<ApiResponse<void>> {
    return this.request(`/children/${id}`, {
      method: 'DELETE',
    });
  }

  // Expenses methods
  async getExpenses(params?: {
    childId?: string;
    category?: Expense['category'];
    status?: Expense['status'];
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Expense[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/expenses?${queryString}` : '/expenses';
    
    return this.request(endpoint);
  }

  async getExpense(id: string): Promise<ApiResponse<Expense>> {
    return this.request(`/expenses/${id}`);
  }

  async createExpense(expenseData: CreateExpenseData): Promise<ApiResponse<Expense>> {
    // Input validation - Türkçe mesajlarla
    if (!expenseData.title?.trim()) {
      return { error: 'Harcama başlığı zorunludur' };
    }
    
    if (!expenseData.amount || expenseData.amount <= 0) {
      return { error: 'Tutar 0\'dan büyük olmalıdır' };
    }
    
    if (expenseData.amount > 1000000) {
      return { error: 'Tutar 1.000.000\'dan fazla olamaz' };
    }
    
    if (!expenseData.category) {
      return { error: 'Kategori seçimi zorunludur' };
    }
    
    if (!expenseData.childId?.trim()) {
      return { error: 'Çocuk seçimi zorunludur' };
    }
    
    if (!expenseData.expenseDate) {
      return { error: 'Harcama tarihi zorunludur' };
    }

    // Validate date is not in the future
    const expenseDate = new Date(expenseData.expenseDate);
    const today = new Date();
    if (expenseDate > today) {
      return { error: 'Harcama tarihi gelecekte olamaz' };
    }

    // Sanitize input data
    const sanitizedData = {
      ...expenseData,
      title: expenseData.title.trim(),
      description: expenseData.description?.trim(),
      amount: Number(expenseData.amount.toFixed(2)), // Round to 2 decimal places
    };

    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async updateExpense(id: string, expenseData: UpdateExpenseData): Promise<ApiResponse<Expense>> {
    return this.request(`/expenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(expenseData),
    });
  }

  async deleteExpense(id: string): Promise<ApiResponse<void>> {
    return this.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getExpenseStats(childId?: string): Promise<ApiResponse<ExpenseStats>> {
    const endpoint = childId ? `/expenses/stats?childId=${childId}` : '/expenses/stats';
    return this.request(endpoint);
  }

  // Connections methods
  async inviteCoParent(data: { receiverEmail: string; message?: string }): Promise<ApiResponse<any>> {
    if (!data.receiverEmail?.trim()) {
      return { error: 'Email adresi zorunludur' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.receiverEmail.trim())) {
      return { error: 'Geçerli bir email adresi giriniz' };
    }

    const sanitizedData = {
      receiverEmail: data.receiverEmail.toLowerCase().trim(),
      message: data.message?.trim(),
    };

    return this.request('/connections/invite', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async getPendingConnections(): Promise<ApiResponse<any[]>> {
    return this.request('/connections/pending');
  }

  async getSentInvitations(): Promise<ApiResponse<any[]>> {
    return this.request('/connections/sent');
  }

  async acceptConnection(connectionId: string): Promise<ApiResponse<any>> {
    return this.request(`/connections/${connectionId}/accept`, {
      method: 'PATCH',
    });
  }

  async rejectConnection(connectionId: string): Promise<ApiResponse<any>> {
    return this.request(`/connections/${connectionId}/reject`, {
      method: 'PATCH',
    });
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<any>> {
    return this.request('/notifications');
  }

  async getUnreadNotificationCount(): Promise<ApiResponse<any>> {
    return this.request('/notifications/unread-count');
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<any>> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
    return this.request('/notifications/mark-all-read', {
      method: 'PATCH',
    });
  }

  async deleteAllNotifications(): Promise<ApiResponse<any>> {
    return this.request('/notifications/all', {
      method: 'DELETE',
    });
  }
  async acceptConnectionFromNotification(notificationId: string): Promise<ApiResponse<any>> {
    return this.request(`/notifications/${notificationId}/accept-connection`, {
      method: 'POST',
    });
  }
  async rejectConnectionFromNotification(notificationId: string): Promise<ApiResponse<any>> {
    return this.request(`/notifications/${notificationId}/reject-connection`, {
      method: 'POST',
    });
  }

  // New connection methods
  async getConnectionStatus(): Promise<ApiResponse<any>> {
    return this.request('/connections/status');
  }

  async removeConnection(connectionId: string): Promise<ApiResponse<any>> {
    return this.request(`/connections/${connectionId}`, {
      method: 'DELETE',
    });
  }
  async cancelInvitation(connectionId: string): Promise<ApiResponse<any>> {
    return this.request(`/connections/sent/${connectionId}`, {
      method: 'DELETE',
    });
  }

  // Account management
  async deleteAccount(emailConfirmation: string): Promise<ApiResponse<any>> {
    return this.request('/auth/account', {
      method: 'DELETE',
      body: JSON.stringify({ emailConfirmation }),
    });
  }
}

export const api = new ApiClient();