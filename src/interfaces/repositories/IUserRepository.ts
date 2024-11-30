import {User} from "../../entites/User"

export interface IUserRepository{
    create(data: User): Promise<User>;
    findById(email: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    update(id: string, data: any): Promise<User | null>; 
}