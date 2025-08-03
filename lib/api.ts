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
      return localStorage.getItem('auth_token');
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

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        // Add security headers
        mode: 'cors',
        credentials: 'omit', // Don't send cookies for security
      });

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.removeAuthToken();
          return { error: 'Authentication failed. Please login again.' };
        }
        
        let errorText: string;
        try {
          const errorData = await response.json();
          errorText = errorData.message || errorData.error || `HTTP ${response.status}`;
        } catch {
          errorText = await response.text() || `HTTP ${response.status}`;
        }
        
        return { error: errorText };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { error: 'Network connection failed. Please check your connection.' };
      }
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<{ access_token: string; user: User }>> {
    // Input validation
    if (!email || !password) {
      return { error: 'Email and password are required' };
    }
    
    if (!email.includes('@') || email.length < 3) {
      return { error: 'Please enter a valid email address' };
    }
    
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long' };
    }

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
    if (!token) return false;
    
    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < exp;
    } catch {
      // Invalid token format
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
    // Input validation
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return { error: 'All fields are required' };
    }
    
    if (!userData.email.includes('@') || userData.email.length < 3) {
      return { error: 'Please enter a valid email address' };
    }
    
    if (userData.password.length < 8) {
      return { error: 'Password must be at least 8 characters long' };
    }
    
    if (userData.firstName.trim().length < 2) {
      return { error: 'First name must be at least 2 characters long' };
    }
    
    if (userData.lastName.trim().length < 2) {
      return { error: 'Last name must be at least 2 characters long' };
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
    // Input validation
    if (!expenseData.title?.trim()) {
      return { error: 'Expense title is required' };
    }
    
    if (!expenseData.amount || expenseData.amount <= 0) {
      return { error: 'Amount must be greater than 0' };
    }
    
    if (expenseData.amount > 1000000) {
      return { error: 'Amount cannot exceed 1,000,000' };
    }
    
    if (!expenseData.category) {
      return { error: 'Category is required' };
    }
    
    if (!expenseData.childId?.trim()) {
      return { error: 'Child selection is required' };
    }
    
    if (!expenseData.expenseDate) {
      return { error: 'Expense date is required' };
    }

    // Validate date is not in the future
    const expenseDate = new Date(expenseData.expenseDate);
    const today = new Date();
    if (expenseDate > today) {
      return { error: 'Expense date cannot be in the future' };
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
}

export const api = new ApiClient();