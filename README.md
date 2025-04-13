# Food Identifier App

A web application that enables users to upload photographs of food and receive AI-generated ingredient identification through OpenAI's GPT-4o API.

## Features

- Upload food images via a web interface
- AI-powered food ingredient identification
- Display of main items, ingredients, toppings, and garnishes
- Optional nutritional and dietary information
- Responsive design for cross-device compatibility

## Tech Stack

- **Framework**: [Remix](https://remix.run)
- **UI Library**: [Shadcn UI](https://ui.shadcn.com/) with Tailwind CSS
- **API Integration**: OpenAI GPT-4o API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/food-identifier-app.git
   cd food-identifier-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `app/components/ui`: Shadcn UI components
- `app/components/custom`: Custom application components
- `app/lib`: Utility functions
- `app/models`: Type definitions
- `app/routes`: Remix routes
- `app/services`: Business logic services

## Architecture

The application follows a clean architecture approach with:
- Functional programming principles
- Service-oriented architecture
- Plugin registry for extensibility
- Decorator pattern for cross-cutting concerns

## Deployment

This application can be deployed to any hosting service that supports Remix applications, such as Vercel, Netlify, or Fly.io.

## License

MIT
