import React from "react";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon class="size-12 animate-spin" />
    </div>
  );
}
