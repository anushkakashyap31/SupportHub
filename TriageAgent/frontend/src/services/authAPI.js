/**
 * Authentication API Service
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { auth } from '../utils/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';

/**
 * Register new user (direct API)
 */
export const register = async (email, password, fullName) => {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
    email,
    password,
    full_name: fullName,
  });
  return response.data;
};

/**
 * Login with email and password (direct API)
 */
export const loginWithEmail = async (email, password) => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN_EMAIL, {
    email,
    password,
  });
  return response.data;
};

/**
 * Login with Firebase (for frontend)
 */
export const loginWithFirebase = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
    id_token: idToken,
  });
  
  return response.data;
};

/**
 * Register with Firebase (for frontend)
 */
export const registerWithFirebase = async (email, password, fullName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
    id_token: idToken,
  });
  
  return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  const response = await api.get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

/**
 * Sign out
 */
export const signOut = async () => {
  await firebaseSignOut(auth);
  localStorage.removeItem('accessToken');
};