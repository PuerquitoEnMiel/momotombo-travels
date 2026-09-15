export interface Review {
  id: string;
  userId: string;
  destinationId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface CreateReviewPayload {
  destinationId: string;
  rating: number;
  comment: string;
}
