import { UserRepository } from '../repositories/user.repository';
import { UserWithoutPassword } from '../types/user.types';


const userRepository = new UserRepository();

export class UserService {
    async getProfile(userId: number): Promise<UserWithoutPassword | null> {
        const user = await userRepository.findById(userId);
        if (!user) return null;
        
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as UserWithoutPassword;
    }
}