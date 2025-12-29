import { SignIn } from "@clerk/clerk-react";
import React from "react";

export default function LoginPage() {
  return (
    <div className="h-screen flex justify-center items-center">
      LoginPage
      <SignIn />
    </div>
  );
}
