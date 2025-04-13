import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import type { FoodIdentification } from '~/models/food';
import { cn } from '~/lib/utils';

interface FoodAnalysisResultProps {
    foodData: FoodIdentification;
    className?: string;
}

/**
 * Food Analysis Result Component - Mermaid Sequence Diagram
 * ```mermaid
 * sequenceDiagram
 *     participant Parent
 *     participant Results as FoodAnalysisResult
 *     participant List as ListSection
 *     
 *     Parent->>Results: render(foodData)
 *     Results->>List: render ingredients
 *     Results->>List: render toppings
 *     Results->>List: render garnishes
 *     Results->>Results: render confidence
 *     Results->>Parent: Display UI
 * ```
 */
export function FoodAnalysisResult({ foodData, className }: FoodAnalysisResultProps) {
    const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
        switch (confidence) {
            case 'high':
                return 'text-green-600';
            case 'medium':
                return 'text-amber-600';
            case 'low':
                return 'text-red-600';
            default:
                return 'text-muted-foreground';
        }
    };

    return (
        <Card className={cn('w-full', className)}>
            <CardHeader>
                <CardTitle>{foodData.mainItem}</CardTitle>
                {foodData.cuisineType && (
                    <CardDescription>Cuisine: {foodData.cuisineType}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <ListSection title="Ingredients" items={foodData.ingredients} />

                {foodData.toppings && foodData.toppings.length > 0 && (
                    <ListSection title="Toppings" items={foodData.toppings} />
                )}

                {foodData.garnishes && foodData.garnishes.length > 0 && (
                    <ListSection title="Garnishes" items={foodData.garnishes} />
                )}

                {foodData.allergensWarning && foodData.allergensWarning.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium mb-2 text-destructive">Allergen Warning</h4>
                        <div className="bg-destructive/10 p-3 rounded-md">
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {foodData.allergensWarning.map((allergen, index) => (
                                    <li key={index} className="text-destructive">{allergen}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {foodData.dietaryInfo && (
                    <div>
                        <h4 className="text-sm font-medium mb-2">Dietary Information</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <DietBadge
                                label="Vegetarian"
                                isTrue={foodData.dietaryInfo.vegetarian}
                            />
                            <DietBadge
                                label="Vegan"
                                isTrue={foodData.dietaryInfo.vegan}
                            />
                            <DietBadge
                                label="Gluten Free"
                                isTrue={foodData.dietaryInfo.glutenFree}
                            />
                            <DietBadge
                                label="Dairy Free"
                                isTrue={foodData.dietaryInfo.dairyFree}
                            />
                        </div>
                    </div>
                )}

                {foodData.estimatedCalories && (
                    <div>
                        <h4 className="text-sm font-medium mb-1">Estimated Calories</h4>
                        <p className="text-sm">{foodData.estimatedCalories} kcal</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    Confidence:
                    <span className={cn('ml-1 font-medium', getConfidenceColor(foodData.confidence))}>
                        {foodData.confidence.charAt(0).toUpperCase() + foodData.confidence.slice(1)}
                    </span>
                </p>
            </CardFooter>
        </Card>
    );
}

/* Sub-components */

function ListSection({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <h4 className="text-sm font-medium mb-2">{title}</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

function DietBadge({ label, isTrue }: { label: string; isTrue: boolean }) {
    return (
        <div
            className={cn(
                'px-2 py-1 rounded-md text-xs font-medium flex items-center justify-center',
                isTrue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}
        >
            {label}: {isTrue ? 'Yes' : 'No'}
        </div>
    );
} 