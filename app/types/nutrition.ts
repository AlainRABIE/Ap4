export type MealType = 'Petit-déjeuner' | 'Déjeuner' | 'Dîner' | 'Collation';

export interface CalorieStats {
  caloriesTotales: number;
  caloriesRestantes: number;
  caloriesBrulees: number;
}

export interface MealData {
  id: string;
  calories: number;
  type: MealType;
}
