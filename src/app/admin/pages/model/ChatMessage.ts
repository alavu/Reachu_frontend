export interface ChatMessage {
    id?: number;
    message: string;
    user_id?:number;
    timeStamp?: string | Date;
    partner_id?: number;
}
