"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Send, Loader, MessageSquare, Plus, ArrowLeft, Trash2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Input } from "@/components/ui/input"
import { getChatHistory, getChatMessages, createNewChat, addMessageToChat, deleteChatHistory } from "@/app/actions"

// Definisikan tipe untuk pesan & item riwayat
interface Message {
sender: 'user' | 'ai';
text: string;
}

interface ChatHistoryItem {
id: string;
title: string;
}

export function AskAiView() {
const [messages, setMessages] = useState<Message[]>([]);
const [inputValue, setInputValue] = useState('');
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
    setMessages([
    { sender: 'ai', text: "Halo! Saya adalah HealthSync AI. Ada yang bisa saya bantu?" }
    ]);
}

const handleSelectHistory = async (chatId: string) => {
    setActiveChatId(chatId);
    setMessages([{ sender: 'ai', text: 'Memuat percakapan...'}]);
    
    const { data, error } = await getChatMessages(chatId);
    if (error || !data) {
        setMessages([{ sender: 'ai', text: 'Gagal memuat percakapan.'}]);
        return;
    }
    setMessages(data);
}

const handleDeleteHistory = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    const originalHistory = history;
    setHistory(prevHistory => prevHistory.filter(chat => chat.id !== chatId));
    
    const { error } = await deleteChatHistory(chatId);
    if (error) {
        setHistory(originalHistory);
        alert("Gagal menghapus riwayat chat.");
    }
    
    if (activeChatId === chatId) {
    startNewChat();
    }
}

const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;
    
    const userMessage: Message = { sender: 'user', text: inputValue };
    const isNewChat = activeChatId === null;

    // --- PERBAIKAN UTAMA DI SINI ---
    // Jika ini chat baru, mulai array pesan hanya dengan pesan pengguna.
    // Jika tidak, tambahkan ke pesan yang sudah ada.
    const currentMessages = isNewChat ? [userMessage] : [...messages, userMessage];
    
    setMessages(currentMessages);

    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
    const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
    });
    if (!chatResponse.ok) throw new Error('AI response failed');
    
    const chatData = await chatResponse.json();
    const aiMessage: Message = { sender: 'ai', text: chatData.response };
    
    const finalMessages = [...currentMessages, aiMessage];
    setMessages(finalMessages);

    if (isNewChat) {
        const titleResponse = await fetch('/api/title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstUserMessage: currentInput, firstAiMessage: aiMessage.text }),
        });
        
        const titleData = await titleResponse.json();
        const finalTitle = titleData.title || currentInput.substring(0, 40);
        const messagesToSave = [{ sender: 'ai', text: "Halo! Saya adalah HealthSync AI. Ada yang bisa saya bantu?" }, ...finalMessages];

        const { data: newChatData, error } = await createNewChat(finalTitle, messagesToSave);
        
        if (error || !newChatData) {
            console.error("Supabase error creating chat:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: 'Error: Gagal menyimpan riwayat chat ke database.' }]);
            return;
        }

        const newHistoryItem = { id: newChatData.id, title: finalTitle };
        setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
        setActiveChatId(newChatData.id);

    } else {
        await addMessageToChat(activeChatId, userMessage);
        await addMessageToChat(activeChatId, aiMessage);
    }
    } catch (error) {
    console.error(error);
    setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting.' }]);
    } finally {
    setIsLoading(false);
    }
};

return (
    <div className="flex h-screen w-full bg-gray-100">
    <aside className="w-72 flex-col border-r bg-white hidden md:flex">
        <div className="p-4 border-b"><Button className="w-full" onClick={startNewChat}><Plus className="mr-2 h-4 w-4" />New Chat</Button></div>
        <div className="flex-1 overflow-y-auto p-2">
        <p className="text-xs font-semibold text-gray-500 px-2 pt-2 mb-2">Chat History</p>
        <div className="space-y-1">
            {history.map((chat) => (
            <div key={chat.id} className="relative group">
                <Button variant="ghost" className={cn("w-full justify-start text-left h-10 truncate pr-8", activeChatId === chat.id && "bg-purple-100 text-purple-700")} onClick={() => handleSelectHistory(chat.id)}>
                <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" /><span className="truncate">{chat.title}</span>
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDeleteHistory(e, chat.id)}>
                <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
            </div>
            ))}
        </div>
        </div>
        <div className="p-4 border-t"><Link href="/dashboard" className="w-full"><Button variant="outline" className="w-full"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Button></Link></div>
    </aside>

    <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-6">
            <Link href="/dashboard" className="font-semibold flex items-center gap-2"><Image src="/illustrations/logo.png" alt="HealthSync Logo" width={24} height={24} /><span>HealthSync AI</span></Link>
            <div className="ml-auto flex items-center gap-2"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="relative h-9 w-9 rounded-full"><div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white font-semibold text-sm">JS</div></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel className="font-normal"><div className="flex flex-col space-y-1"><p className="text-sm font-medium">John Smith</p><p className="text-xs text-muted-foreground">john.smith@email.com</p></div></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem><DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-red-600 focus:text-red-600"><LogOut className="mr-2 h-4 w-4" />Sign Out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
        </header>

        <main className="flex-1 flex flex-col overflow-y-hidden p-4 md:p-6">
            <div className="flex-1 space-y-6 overflow-y-auto p-4 rounded-t-lg bg-white shadow-inner">
            {/* --- PERUBAHAN LOGIKA TAMPILAN DI SINI --- */}
            {messages.length === 1 && messages[0].sender === 'ai' && activeChatId === null ? (
                // Tampilan Awal "New Chat"
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                    <div className="flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-[#3FB6F6] to-[#34D399]"><MessageSquare className="size-8 text-white"/></div>
                    <h2 className="mt-4 text-2xl font-semibold text-gray-700">HealthSync AI</h2>
                    <p className="mt-2">Start a new conversation by asking a question below.</p>
                </div>
            ) : (
                // Tampilan Percakapan
                messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white flex-shrink-0"><MessageSquare className="size-4"/></div>}
                    <div className={cn("prose prose-sm max-w-none rounded-2xl px-4 py-2 text-sm", msg.sender === 'user' ? "bg-purple-500 text-white rounded-br-none prose-invert" : "bg-gray-200 text-gray-800 rounded-bl-none")}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    </div>
                ))
            )}
            {isLoading && ( <div className="flex items-start gap-4"><div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white flex-shrink-0"><MessageSquare className="size-4"/></div><div className="bg-white border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm"><Loader className="size-5 text-gray-400 animate-spin" /></div></div> )}
            <div ref={scrollRef} />
            </div>
            <div className="p-4 border-x border-b bg-white rounded-b-lg shadow-sm">
                <div className="relative">
                <Input placeholder="Ask a question about your health..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} disabled={isLoading} className="pr-12 h-11 text-base border-gray-300 focus:ring-purple-500 focus:border-purple-500"/>
                <Button type="submit" size="icon" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-purple-500 hover:bg-purple-600 rounded-md"><Send className="h-4 w-4" /></Button>
                </div>
            </div>
        </main>
    </div>
    </div>
);
}
