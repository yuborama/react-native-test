import type { IngredientItem, Meal, MealsResponse } from './types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function searchMealsByName(query: string): Promise<Meal[]> {
  const url = `${BASE_URL}/search.php?s=${encodeURIComponent(query.trim())}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error searching meals');
  }

  const data = (await response.json()) as MealsResponse;
  return data.meals ?? [];
}

export async function getMealById(id: string): Promise<Meal | null> {
  const url = `${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error loading meal detail');
  }

  const data = (await response.json()) as MealsResponse;
  return data.meals?.[0] ?? null;
}

export function extractIngredients(meal: Meal): IngredientItem[] {
  const items: IngredientItem[] = [];

  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();

    if (ingredient) {
      items.push({
        ingredient,
        measure: measure ?? '',
      });
    }
  }

  return items;
}
