import { User } from "../interface/user.interface";

interface Subscription {
    planName: 'free' | 'pro' | 'enterprise';
  }
  
  type UserT = User & { subscription?: Subscription };
  
  export class UserDTO {
    id: number;
    email: string;
    avatar: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    plan: 'free' | 'pro' | 'enterprise';
  
    constructor(user: UserT) {

      this.id = user.id;
      this.email = user.email;
      this.createdAt = user.createdAt;
      this.updatedAt = user.updatedAt;
      this.name = user.name;
      this.avatar = user.avatar;
      this.plan = user.subscription?.planName || 'free';
    }
  }
  