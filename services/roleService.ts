import { getAuth } from 'firebase/auth';
import { getUserData } from './auth';
import app from '../firebase/firebaseConfig';

/**
 * Fetches the role of the currently authenticated user
 * @returns The user role or null if no user is authenticated
 */
export const getCurrentUserRole = async (): Promise<string | null> => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  
  if (!user) {
    return null;
  }
  
  try {
    const userData = await getUserData(user.uid);
    return userData?.role || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

/**
 * Checks if the current user has a specific role
 * @param role The role to check
 * @returns True if the user has the specified role, false otherwise
 */
export const hasRole = async (role: string): Promise<boolean> => {
  const userRole = await getCurrentUserRole();
  return userRole === role;
};

/**
 * Checks if the current user is an admin
 * @returns True if the user is an admin, false otherwise
 */
export const isAdmin = async (): Promise<boolean> => {
  return await hasRole('admin');
};

/**
 * Checks if the current user is a coach
 * @returns True if the user is a coach, false otherwise
 */
export const isCoach = async (): Promise<boolean> => {
  return await hasRole('coach');
};
