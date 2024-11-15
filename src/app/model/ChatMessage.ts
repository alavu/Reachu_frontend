export interface ChatMessage {
    id?: number;
    message: string;
    user_id: number; // Sender's ID
    partner_id: number; // Receiver's ID
    timeStamp?: string; // ISO string or appropriate format
    message_side?: 'sender' | 'receiver'; // Optional property
}
