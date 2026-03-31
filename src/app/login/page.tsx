import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { LoginInvitedNotice } from "./LoginInvitedNotice";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F7FA] px-4 sm:px-6">
      <div
        className="bg-grid-radial-fade absolute inset-0"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/60 bg-white/40 p-8 shadow-[0_8px_40px_rgba(26,31,54,0.1),0_1px_0_rgba(255,255,255,0.8)_inset] ring-1 ring-white/30 backdrop-blur-xl backdrop-saturate-150">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-[#1A1F36]">BDL+</span>
        </div>

        <h1 className="mb-2 text-center text-xl font-semibold text-[#1A1F36]">Welcome back</h1>
        <p className="mb-6 text-center text-sm text-[#8F95B2]">Sign in to the BDL Doctors Portal</p>
        <Suspense fallback={null}>
          <LoginInvitedNotice />
        </Suspense>
        <p className="mb-4 rounded-lg border border-white/40 bg-white/35 px-3 py-2 text-center text-[11px] text-[#5A607F] backdrop-blur-sm">
          Demo: <span className="font-mono">doctor@demo.com</span> / <span className="font-mono">demo1234</span>
          {" · "}
          <span className="font-mono">lab@bdl.com</span> — same password (lab)
        </p>

        <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-white/30 backdrop-blur-sm" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
