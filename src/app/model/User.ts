export interface User {
    id: number;
    name: string;
    imageUrl?: string; // Optional, if users have profile images
    status?: string; // Optional, for user status
    service?: string; // Optional, if applicable
}
