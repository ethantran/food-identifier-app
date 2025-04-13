import OpenAI from 'openai';
import { logMethod } from '~/lib/utils';
import type { FoodAnalysisRequest, FoodAnalysisResponse, FoodIdentification } from '~/models/food';

/**
 * Food Analyzer Service - Mermaid Sequence Diagram
 * ```mermaid
 * sequenceDiagram
 *     participant Client
 *     participant FAS as FoodAnalyzerService
 *     participant OpenAI
 *     
 *     Client->>FAS: analyzeFood(imageBase64)
 *     FAS->>OpenAI: createChatCompletion(image + prompt)
 *     OpenAI->>FAS: Return AI Analysis
 *     FAS->>FAS: Parse AI Response
 *     FAS->>Client: Return Structured Food Data
 * ```
 */
export class FoodAnalyzerService {
    private openai: OpenAI;
    private static instance: FoodAnalyzerService;

    private constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    /**
     * Get singleton instance of FoodAnalyzerService
     */
    public static getInstance(): FoodAnalyzerService {
        if (!FoodAnalyzerService.instance) {
            FoodAnalyzerService.instance = new FoodAnalyzerService();
        }
        return FoodAnalyzerService.instance;
    }

    /**
     * Analyze food image and return structured data
     */
    public async analyzeFood(request: FoodAnalysisRequest): Promise<FoodAnalysisResponse> {
        console.log(`Calling analyzeFood with args:`, request);
        const startTime = Date.now();

        try {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OpenAI API key is not configured');
            }

            // Create prompt with instructions
            const instructions = `
        Analyze this food image and provide detailed identification in JSON format. Include:
        - mainItem: The primary food item shown
        - ingredients: Array of ingredients you can identify
        - toppings: Array of visible toppings (if applicable)
        - garnishes: Array of garnishes (if applicable)
        - cuisineType: The type of cuisine (if identifiable)
        - confidence: Your confidence level (high, medium, or low)
        ${request.includeNutrition ? '- estimatedCalories: Approximate calories' : ''}
        ${request.includeDietaryInfo ? `- dietaryInfo: {
          vegan: boolean,
          vegetarian: boolean,
          glutenFree: boolean,
          dairyFree: boolean
        }` : ''}
        ${request.includeDietaryInfo ? '- allergensWarning: Array of potential allergens' : ''}
        
        Respond with ONLY valid JSON matching the FoodIdentification type.
      `;

            // Make request to OpenAI
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: instructions },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${request.imageBase64}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 1000,
            });

            // Parse the AI response
            const content = response.choices[0]?.message?.content || '';

            // Extract JSON from the response
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
                content.match(/{[\s\S]*}/) ||
                [null, content];

            const jsonString = jsonMatch[1] || content;

            // Parse the JSON
            const foodData = JSON.parse(jsonString) as FoodIdentification;

            const result = {
                success: true,
                data: foodData,
                processingTimeMs: Date.now() - startTime,
            };

            console.log(`analyzeFood returned:`, result);
            return result;
        } catch (error) {
            console.error('Error analyzing food image:', error);
            const errorResult = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                processingTimeMs: Date.now() - startTime,
            };
            console.log(`analyzeFood returned error:`, errorResult);
            return errorResult;
        }
    }
} 