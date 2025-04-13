import { useState } from 'react';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, Form, useNavigation } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { FoodAnalysisResult } from '~/components/custom/food-analysis-result';
import { ImageUpload } from '~/components/custom/image-upload';
import { FoodAnalyzerService } from '~/services/openai/food-analyzer.service';
import type { FoodAnalysisResponse, FoodIdentification } from '~/models/food';

/**
 * Main Route - Mermaid Sequence Diagram
 * ```mermaid
 * sequenceDiagram
 *     participant User
 *     participant Client
 *     participant Server
 *     participant OpenAI
 *     
 *     User->>Client: Upload Image
 *     Client->>Server: POST with Base64 Image
 *     Server->>OpenAI: Send Image for Analysis
 *     OpenAI->>Server: Return Analysis
 *     Server->>Client: Return Structured Food Data
 *     Client->>User: Display Results
 * ```
 */

export const meta: MetaFunction = () => {
  return [
    { title: "Food Identifier App" },
    { name: "description", content: "Identify ingredients in your food with AI" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const imageBase64 = formData.get('imageBase64') as string;
  const includeNutrition = formData.get('includeNutrition') === 'true';
  const includeDietaryInfo = formData.get('includeDietaryInfo') === 'true';

  if (!imageBase64) {
    return json({ success: false, error: 'No image provided' });
  }

  try {
    const foodAnalyzer = FoodAnalyzerService.getInstance();
    const result = await foodAnalyzer.analyzeFood({
      imageBase64,
      includeNutrition,
      includeDietaryInfo,
    });

    return json(result);
  } catch (error) {
    console.error('Error in action function:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}

export default function Index() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [includeNutrition, setIncludeNutrition] = useState(true);
  const [includeDietaryInfo, setIncludeDietaryInfo] = useState(true);

  const actionData = useActionData<FoodAnalysisResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const handleImageSelect = (base64: string | null) => {
    setImageBase64(base64);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Food Identifier</h1>
        <p className="text-muted-foreground">
          Upload a food image and get AI-powered ingredient identification
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Food Image</CardTitle>
              <CardDescription>
                Take a clear photo of your food for best results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-5">
                <input
                  type="hidden"
                  name="imageBase64"
                  value={imageBase64 || ''}
                />
                <input
                  type="hidden"
                  name="includeNutrition"
                  value={includeNutrition.toString()}
                />
                <input
                  type="hidden"
                  name="includeDietaryInfo"
                  value={includeDietaryInfo.toString()}
                />

                <ImageUpload
                  onImageSelect={handleImageSelect}
                  disabled={isSubmitting}
                />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeNutrition"
                      checked={includeNutrition}
                      onCheckedChange={(checked) => setIncludeNutrition(checked === true)}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="includeNutrition"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include estimated calories
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeDietaryInfo"
                      checked={includeDietaryInfo}
                      onCheckedChange={(checked) => setIncludeDietaryInfo(checked === true)}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="includeDietaryInfo"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include dietary information
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!imageBase64 || isSubmitting}
                >
                  {isSubmitting ? 'Analyzing...' : 'Identify Food'}
                </Button>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          {actionData?.success && actionData.data ? (
            <FoodAnalysisResult foodData={actionData.data as FoodIdentification} />
          ) : actionData?.error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{actionData.error}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center bg-muted/20">
              <CardContent className="text-center p-8">
                <p className="text-muted-foreground">
                  Upload an image to see the analysis results here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Powered by OpenAI API and Remix</p>
      </footer>
    </div>
  );
}
