'use client';

import { loginUser } from '@/utils/logIn/authService';
import { logoutAndRedirect } from '@/utils/signOut/logoutAndRedirect';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import SignInForm from "@/components/auth/SignInForm";


export default function SignIn() {
  return <SignInForm />;
}
