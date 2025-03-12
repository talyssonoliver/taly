export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  image?: string;
  category?: string;
  isActive: boolean;
  salonId: string;
  createdAt: Date;
  updatedAt: Date;
  salon?: {
    id: string;
    name: string;
  };
}

export interface ServiceWithSalon extends Service {
  salon: {
    id: string;
    name: string;
  };
}
