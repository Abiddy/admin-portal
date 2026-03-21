"use client";

import { useState } from "react";

const conversations = [
  { id: 1, name: "Savannah Nguyen", preview: "Hey Dr. How are yo...", time: "1 min ago", starred: false },
  { id: 2, name: "Jane Cooper", preview: "Hey Dr. How are...", time: "20 min ago", starred: true },
  { id: 3, name: "Devon Lane", preview: "Hey Dr. How are...", time: "1 hrs ago", starred: false },
  { id: 4, name: "Jerome Bell", preview: "Hey Dr. How are...", time: "2 hrs ago", starred: false },
  { id: 5, name: "Esther Howard", preview: "Hey Dr. How are...", time: "3 hrs ago", starred: false },
  { id: 6, name: "Cameron Williamson", preview: "Hey Dr. How are...", time: "4 hrs ago", starred: false },
  { id: 7, name: "Wade Warren", preview: "Hey Dr. How are...", time: "1 day ago", starred: false },
  { id: 8, name: "Dianne Russell", preview: "Hey Dr. How are...", time: "1 day ago", starred: false },
  { id: 9, name: "Robert Fox", preview: "Hey Dr. How are...", time: "3 days ago", starred: false },
];

const messages = [
  { id: 1, from: "patient", text: "Hey Dr. I am looking for an appointment of you", time: "11:00 am" },
  { id: 2, from: "doctor", text: "Now worries Mr. Jane, I'm available right now. Tell me about your problem", time: "11:01 am" },
  { id: 3, from: "patient", text: "I'm a businessman. For few days I'm feeling unsecured myself.", time: "11:05 am" },
  { id: 4, from: "doctor", text: "Can you please Explain me?", time: "11:07 am" },
  { id: 5, from: "patient", text: "Can I send you voice message or call right now?", time: "11:08 am" },
  { id: 6, from: "doctor", text: "Sorry, You can send me voice only right now. For call you need to book an appointment.", time: "11:12 am" },
  { id: 7, from: "patient", text: "How can I book your appointment?", time: "11:15 am" },
  { id: 8, from: "doctor", text: "Go to my profile. In the top right you will get a book now button. I'm sending a tutorial video.", time: "11:17 am" },
  { id: 9, from: "doctor", text: "[video]", time: "11:18 am" },
];

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const cls = size === "sm" ? "size-8 text-xs" : "size-10 text-sm";
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-[#E2E6EF] font-medium text-[#5A607F] ${cls}`}>
      {initials}
    </div>
  );
}

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(2);
  const [activeTab, setActiveTab] = useState<"patients" | "doctors">("patients");

  const activeConvo = conversations.find((c) => c.id === activeChat);

  return (
    <div className="flex h-full overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Left: Conversation List */}
      <div className="flex w-[300px] shrink-0 flex-col border-r border-[#EEF0F6]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h2 className="text-lg font-bold text-[#1A1F36]">Messages</h2>
          <button type="button" className="rounded-lg p-1.5 text-[#8F95B2] hover:bg-[#F5F7FA]" aria-label="Search">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="mx-5 mb-4 flex rounded-lg border border-[#E2E6EF]">
          <button
            type="button"
            onClick={() => setActiveTab("patients")}
            className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-colors ${
              activeTab === "patients"
                ? "bg-[#EEF2FF] text-[#4C6FFF]"
                : "text-[#8F95B2] hover:text-[#5A607F]"
            }`}
          >
            Patients
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("doctors")}
            className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-colors ${
              activeTab === "doctors"
                ? "bg-[#EEF2FF] text-[#4C6FFF]"
                : "text-[#8F95B2] hover:text-[#5A607F]"
            }`}
          >
            Doctors
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((convo) => (
            <button
              key={convo.id}
              type="button"
              onClick={() => setActiveChat(convo.id)}
              className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-colors ${
                activeChat === convo.id ? "bg-[#F5F7FA]" : "hover:bg-[#FAFBFC]"
              }`}
            >
              <Avatar name={convo.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1A1F36]">{convo.name}</span>
                  <svg
                    className={`size-4 shrink-0 ${convo.starred ? "fill-[#E2963B] text-[#E2963B]" : "fill-none text-[#D5DAE5]"}`}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="truncate text-[12px] text-[#8F95B2]">{convo.preview}</span>
                  <span className="ml-2 shrink-0 text-[11px] text-[#8F95B2]">{convo.time}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-[#EEF0F6] px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar name={activeConvo?.name || ""} />
            <span className="text-[15px] font-bold text-[#1A1F36]">{activeConvo?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" className="rounded-lg p-2 text-[#8F95B2] hover:bg-[#F5F7FA]" aria-label="Video call">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button type="button" className="rounded-lg p-2 text-[#8F95B2] hover:bg-[#F5F7FA]" aria-label="Phone call">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button type="button" className="rounded-lg p-2 text-[#8F95B2] hover:bg-[#F5F7FA]" aria-label="Search">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button type="button" className="rounded-lg p-2 text-[#8F95B2] hover:bg-[#F5F7FA]" aria-label="More">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            {messages.map((msg) => {
              const isDoctor = msg.from === "doctor";

              if (msg.text === "[video]") {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#8F95B2]">{msg.time}</span>
                        <div className="flex size-40 items-center justify-center rounded-2xl bg-[#E2E6EF]">
                          <div className="flex size-10 items-center justify-center rounded-full bg-[#4C6FFF]/80">
                            <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <Avatar name="SC" size="sm" />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex ${isDoctor ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[70%] items-end gap-2 ${isDoctor ? "flex-row-reverse" : ""}`}>
                    {!isDoctor && <Avatar name={activeConvo?.name || ""} size="sm" />}
                    {isDoctor && <Avatar name="SC" size="sm" />}
                    <div>
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                          isDoctor
                            ? "rounded-br-md bg-[#4C6FFF] text-white"
                            : "rounded-bl-md bg-[#F0F1F5] text-[#1A1F36]"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className={`mt-1 block text-[11px] text-[#8F95B2] ${isDoctor ? "text-right" : ""}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <Avatar name={activeConvo?.name || ""} size="sm" />
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-[#F0F1F5] px-4 py-3">
                  <span className="size-2 animate-bounce rounded-full bg-[#8F95B2] [animation-delay:0ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-[#8F95B2] [animation-delay:150ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-[#8F95B2] [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-[#EEF0F6] px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your message"
              className="flex-1 rounded-xl border border-[#E2E6EF] bg-[#F5F7FA] px-4 py-2.5 text-[13px] text-[#1A1F36] placeholder-[#8F95B2] outline-none focus:border-[#4C6FFF]"
            />
            <button type="button" className="rounded-lg p-2 text-[#8F95B2] hover:bg-[#F5F7FA]" aria-label="Voice message">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button type="button" className="flex items-center gap-2 rounded-xl bg-[#4C6FFF] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#3A5BE0]">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
