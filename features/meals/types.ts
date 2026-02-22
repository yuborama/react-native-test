export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
};

export type MealsResponse = {
  meals: Meal[] | null;
};

export type IngredientItem = {
  ingredient: string;
  measure: string;
};
