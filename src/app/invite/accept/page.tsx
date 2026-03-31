import { Suspense } from "react";
import { InviteAcceptForm } from "./InviteAcceptForm";

export default function InviteAcceptPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F7FA] px-4 sm:px-6">
      <div className="bg-grid-radial-fade absolute inset-0" aria-hidden />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/60 bg-white/40 p-8 shadow-[0_8px_40px_rgba(26,31,54,0.1),0_1px_0_rgba(255,255,255,0.8)_inset] ring-1 ring-white/30 backdrop-blur-xl backdrop-saturate-150">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-[#1A1F36]">BDL+</span>
        </div>
        <h1 className="mb-2 text-center text-xl font-semibold text-[#1A1F36]">Activate your account</h1>
        <p className="mb-6 text-center text-sm text-[#8F95B2]">Choose a password to finish setup. You&apos;ll use this email and password to sign in.</p>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-white/30" />}>
          <InviteAcceptForm />
        </Suspense>
      </div>
    </div>
  );
}
