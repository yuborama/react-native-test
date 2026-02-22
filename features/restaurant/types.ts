export type Restaurant = {
  id: number;
  name: string;
  city: string;
  estimated_cost: number;
  user_rating: {
    average_rating: number;
    votes: number;
  };
};

export type RestaurantsResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Restaurant[];
};
