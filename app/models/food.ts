/**
 * Represents the structure of food identification results
 */
export interface FoodIdentification {
    mainItem: string;
    ingredients: string[];
    toppings?: string[];
    garnishes?: string[];
    cuisineType?: string;
    confidence: 'high' | 'medium' | 'low';
    estimatedCalories?: number;
    allergensWarning?: string[];
    dietaryInfo?: {
        vegan: boolean;
        vegetarian: boolean;
        glutenFree: boolean;
        dairyFree: boolean;
    };
}

/**
 * Food analysis service response
 */
export interface FoodAnalysisResponse {
    success: boolean;
    data?: FoodIdentification;
    error?: string;
    processingTimeMs?: number;
}

/**
 * Food analysis request
 */
export interface FoodAnalysisRequest {
    imageBase64: string;
    includeNutrition?: boolean;
    includeDietaryInfo?: boolean;
} 