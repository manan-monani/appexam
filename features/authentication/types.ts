
export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
