import React from "react";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div>
      <h1>sidebar</h1>
      <h1>navbar</h1>
      <Outlet />
    </div>
  );
}
