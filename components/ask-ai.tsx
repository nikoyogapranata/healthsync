//components\ask-ai.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header"; // Menggunakan Header reusable
import {
  User,
  LogOut,
  Settings,
  Send,
  Loader,
  MessageSquare,
  Plus,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import {
  getChatHistory,
  getChatMessages,
  createNewChat,
  addMessageToChat,
  deleteChatHistory,
} from "@/app/actions";
import { motion } from "framer-motion";
// --- TAMBAHAN UNTUK MEMPERBAIKI ERROR ---
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Definisikan tipe untuk pesan & item riwayat
interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatHistoryItem {
  id: string;
  title: string;
}

export function AskAiView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Memuat riwayat dari DATABASE saat komponen pertama kali render
  useEffect(() => {
    const loadHistory = async () => {
      const { data, error } = await getChatHistory();
      if (error) {
        console.error("Failed to load history:", error);
        return;
      }
      if (data) {
        setHistory(data);
      }
    };
    loadHistory();
    startNewChat();
  }, []);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]); // Mulai dengan array kosong untuk menampilkan layar sambutan
  };

  const handleSelectHistory = async (chatId: string) => {
    setActiveChatId(chatId);
    setMessages([{ sender: "ai", text: "Loading conversation..." }]);

    const { data, error } = await getChatMessages(chatId);
    if (error || !data) {
      setMessages([{ sender: "ai", text: "Failed to load conversation." }]);
      return;
    }
    setMessages(data);
  };

  const handleDeleteHistory = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    const originalHistory = history;
    setHistory((prevHistory) =>
      prevHistory.filter((chat) => chat.id !== chatId)
    );

    const { error } = await deleteChatHistory(chatId);
    if (error) {
      setHistory(originalHistory);
      alert("Failed to delete chat history.");
    }

    if (activeChatId === chatId) {
      startNewChat();
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const userMessage: Message = { sender: "user", text: inputValue };
    const isNewChat = activeChatId === null;

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);

    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });
      if (!chatResponse.ok) throw new Error("AI response failed");

      const chatData = await chatResponse.json();
      const aiMessage: Message = { sender: "ai", text: chatData.response };

      const finalMessages = [...currentMessages, aiMessage];
      setMessages(finalMessages);

      if (isNewChat) {
        const titleResponse = await fetch("/api/title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstUserMessage: currentInput,
            firstAiMessage: aiMessage.text,
          }),
        });

        const titleData = await titleResponse.json();
        const finalTitle = titleData.title || currentInput.substring(0, 40);

        const { data: newChatData, error } = await createNewChat(
          finalTitle,
          finalMessages
        );

        if (error || !newChatData) {
          console.error("Supabase error creating chat:", error);
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              text: "Error: EFailed to save chat history to the database.",
            },
          ]);
          return;
        }

        const newHistoryItem = { id: newChatData.id, title: finalTitle };
        setHistory((prevHistory) => [newHistoryItem, ...prevHistory]);
        setActiveChatId(newChatData.id);
      } else {
        await addMessageToChat(activeChatId, userMessage);
        await addMessageToChat(activeChatId, aiMessage);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I am having trouble connecting." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // --- PERUBAHAN UTAMA DI SINI ---
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-100">
        <aside className="w-72 flex-col border-r bg-white hidden md:flex">
          <div className="p-4 border-t">
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="pt-2 px-4 pb-4 border-b">
            <Button className="w-full" onClick={startNewChat}>
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-xs font-semibold text-gray-500 px-2 pt-2 mb-2">
              Chat History
            </p>
            <div className="space-y-1">
              {history.map((chat) => (
                <div key={chat.id} className="relative group">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left h-10 truncate pr-8",
                      activeChatId === chat.id &&
                        "bg-purple-100 text-purple-700"
                    )}
                    onClick={() => handleSelectHistory(chat.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteHistory(e, chat.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <SidebarInset className="flex flex-1 flex-col">
          <Header pageTitle="Ask AI" />
          <main className="flex-1 flex flex-col overflow-y-hidden p-4 md:p-6">
            <div className="flex-1 space-y-6 overflow-y-auto p-4 rounded-t-lg bg-white shadow-inner">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      msg.sender === "user" ? "justify-end" : ""
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white flex-shrink-0">
                        <MessageSquare className="size-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "prose prose-sm max-w-none rounded-2xl px-4 py-2 text-sm",
                        msg.sender === "user"
                          ? "bg-purple-500 text-white rounded-br-none prose-invert"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      )}
                    >
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white flex-shrink-0">
                    <MessageSquare className="size-4" />
                  </div>
                  <div
                    className={cn(
                      "prose prose-sm max-w-none rounded-2xl px-4 py-2 text-sm",
                      "bg-gray-200 text-gray-800 rounded-bl-none"
                    )}
                  >
                    <ReactMarkdown>
                      {
                        "Hello! 👋 Welcome to HealthSync.\n\nI'm your Virtual Health Assistant, ready to help 24/7.\n\nYou can ask questions about medical records, check-up schedules, and general health advice.\n\n Just type in your question, and I'll help you as much as I can. 😊\n\nYour data is safe and secure here."
                      }
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white flex-shrink-0">
                    <MessageSquare className="size-4" />
                  </div>
                  <div className="bg-white border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <Loader className="size-5 text-gray-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
            <div className="p-4 border-x border-b bg-white rounded-b-lg shadow-sm">
              <div className="relative">
                <Input
                  placeholder="Ask a question about your health..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="pr-12 h-11 text-base border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                />
                <Button
                  type="submit"
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-purple-500 hover:bg-purple-600 rounded-md"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
