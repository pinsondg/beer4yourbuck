export default interface User {
    username: string;
    email: string;
    type: UserType;
}

export enum UserType {
    PATRON, VENUE
}