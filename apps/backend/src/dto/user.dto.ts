interface Subscription {
    planName: 'free' | 'pro' | 'enterprise';
  }
  
  interface User {
    id: number;
    email: string;
    name: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
    subscription?: Subscription;
  }
  
  export class UserDTO {
    id: number;
    email: string;
    avatar: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    plan: 'free' | 'pro' | 'enterprise';
  
    constructor(user: User) {

      this.id = user.id;
      this.email = user.email;
      this.createdAt = user.createdAt;
      this.updatedAt = user.updatedAt;
      this.name = user.name;
      this.avatar = user.avatar;
      this.plan = user.subscription?.planName || 'free';
    }
  }
  