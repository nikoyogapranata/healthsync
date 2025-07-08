"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface Message {
sender: 'user' | 'ai';
text: string;
}

export async function getChatHistory() {
const cookieStore = cookies();
const supabase = createClient(cookieStore);

const { data: { user } } = await supabase.auth.getUser();

if (!user) {
    console.error("getChatHistory: User not authenticated");
    return { error: "User not authenticated" };
}

const { data, error } = await supabase
    .from('chat_history')
    .select('id, title')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

if (error) {
    console.error("Error fetching history:", error);
    return { error: error.message };
}
return { data };
}

export async function getChatMessages(historyId: string) {
const cookieStore = cookies();
const supabase = createClient(cookieStore);

const { data, error } = await supabase
    .from('chat_messages')
    .select('sender, content')
    .eq('history_id', historyId)
    .order('created_at', { ascending: true });

if (error) {
    console.error("Error fetching messages:", error);
    return { error: error.message };
}

return { data: data.map(msg => ({ sender: msg.sender as 'user' | 'ai', text: msg.content })) };
}

export async function createNewChat(title: string, messages: Message[]) {
const cookieStore = cookies();
const supabase = createClient(cookieStore);

const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    console.error("createNewChat: User not authenticated");
    return { error: "User not authenticated" };
}

const { data: historyData, error: historyError } = await supabase
    .from('chat_history')
    .insert({ user_id: user.id, title: title })
    .select('id')
    .single();

if (historyError) {
    console.error("Error creating chat history:", historyError);
    return { error: historyError.message };
}

const messagesToInsert = messages.map(msg => ({
    history_id: historyData.id,
    sender: msg.sender,
    content: msg.text
}));

const { error: messagesError } = await supabase
    .from('chat_messages')
    .insert(messagesToInsert);

if (messagesError) {
    console.error("Error inserting chat messages:", messagesError);
    return { error: messagesError.message };
}

return { data: historyData };
}

export async function addMessageToChat(historyId: string, message: Message) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
        .from('chat_messages')
        .insert({
            history_id: historyId,
            sender: message.sender,
            content: message.text
        });
    if (error) {
        console.error("Error adding message:", error);
        return { error: error.message };
    }
    return { data: "Message added" };
}

export async function deleteChatHistory(historyId: string) {
const cookieStore = cookies();
const supabase = createClient(cookieStore);

const { error } = await supabase
    .from('chat_history')
    .delete()
    .eq('id', historyId);

if (error) {
    console.error("Error deleting history:", error);
    return { error: error.message };
}
return { data: "Deleted successfully" };
}