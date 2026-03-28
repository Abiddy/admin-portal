"use client";

import { useActionState } from "react";
import { postOrderMessageAction, type FormState } from "../actions";

export function OrderMessageForm({ orderId, messageCount }: { orderId: string; messageCount: number }) {
  const [state, formAction, pending] = useActionState(postOrderMessageAction, null as FormState);

  return (
    <form key={messageCount} action={formAction} className="space-y-3">
      <input type="hidden" name="orderId" value={orderId} />
      {state?.error ? (
        <p className="rounded-lg bg-[#FFF0ED] px-3 py-2 text-sm text-[#E2613B]" role="alert">
          {state.error}
        </p>
      ) : null}
      <label htmlFor="thread-body" className="sr-only">
        Message
      </label>
      <textarea
        id="thread-body"
        name="body"
        rows={3}
        required
        placeholder="Ask the lab a question or leave an internal note for your team…"
        className="w-full resize-y rounded-lg border border-[#E2E6EF] bg-white px-3 py-2 text-[13px] text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1A1F36] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2A2F46] disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post message"}
      </button>
    </form>
  );
}
