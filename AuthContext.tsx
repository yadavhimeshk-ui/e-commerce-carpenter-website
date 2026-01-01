import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: any;
  userType: 'owner' | 'customer' | null;
  loading: boolean;
  signInAsOwner: (email: string, password: string) => Promise<boolean>;
  signInAsCustomer: (emailOrMobile: string, name?: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'owner' | 'customer' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('shree_hardware_user');
    const storedUserType = localStorage.getItem('shree_hardware_user_type');

    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType as 'owner' | 'customer');
    }

    setLoading(false);
  }, []);

  const signInAsOwner = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('owner')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error || !data) {
        return false;
      }

      if (data.password_hash === password) {
        setUser(data);
        setUserType('owner');
        localStorage.setItem('shree_hardware_user', JSON.stringify(data));
        localStorage.setItem('shree_hardware_user_type', 'owner');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Owner sign in error:', error);
      return false;
    }
  };

  const signInAsCustomer = async (emailOrMobile: string, name?: string): Promise<boolean> => {
    try {
      const isEmail = emailOrMobile.includes('@');

      let { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq(isEmail ? 'email' : 'mobile', emailOrMobile)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking customer:', error);
        return false;
      }

      if (!data) {
        const newCustomer = isEmail
          ? { email: emailOrMobile, name: name || '' }
          : { mobile: emailOrMobile, name: name || '' };

        const { data: insertData, error: insertError } = await supabase
          .from('customers')
          .insert([newCustomer])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating customer:', insertError);
          return false;
        }

        data = insertData;
      }

      setUser(data);
      setUserType('customer');
      localStorage.setItem('shree_hardware_user', JSON.stringify(data));
      localStorage.setItem('shree_hardware_user_type', 'customer');
      return true;
    } catch (error) {
      console.error('Customer sign in error:', error);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('shree_hardware_user');
    localStorage.removeItem('shree_hardware_user_type');
  };

  return (
    <AuthContext.Provider value={{ user, userType, loading, signInAsOwner, signInAsCustomer, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
