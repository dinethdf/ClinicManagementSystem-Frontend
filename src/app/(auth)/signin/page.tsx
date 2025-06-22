"use client";
import { logoutAndRedirect } from "@/utils/signOut/logoutAndRedirect";

import React, { useState, useEffect } from "react";

import SignInForm from "@/components/auth/SignInForm";

export default function SignIn() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("reason") === "session-expired") {
      logoutAndRedirect();
    }
  }, []);

  return <SignInForm />;
}
