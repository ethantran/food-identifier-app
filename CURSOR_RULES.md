# AI Cursor Rules for Food Identifier App

## Code Quality Guidelines
- Use functional programming paradigms (pure functions, immutability)
- Use Pure functions with primitive parameters when feasible
- Define interfaces before implementation
- Implement service or repository architecture for business logic
- Maintain clear separation of data access and business logic layers
- Use Command pattern - Encapsulating operations as objects - when feasible
- Use Factory pattern - generating straightforward creation logic - when feasible
- Use the plugin registry pattern for extensibility
- Leverage decorators for cross-cutting concerns
- Write TypeScript interfaces/types for all data structures
- Use Remix's built-in patterns for data fetching and form handling
- Avoid Complex decorator chains - Multiple layers of decorators - when feasible
- Avoid dependency injection when feasible
- Avoid advanced generics when feasible
- Avoid reactive programming - Complex streams and event handling - when feasible

## Documentation Requirements
- Create Mermaid sequence diagrams for each module before implementation
- Document all services with clear input/output specifications
- Keep code comments minimal but descriptive for complex logic
- Use JSDoc for functions with non-obvious behaviors

## UI/UX Standards
- Implement responsive design for cross-device compatibility
- Use Shadcn UI components consistently
- Maintain a clean, minimal interface
- Use loading states for async operations
- Implement proper error handling and user feedback

## API Integration
- Use environment variables for API keys
- Implement proper error handling for API calls
- Add response validation
- Optimize API usage to minimize costs

## Performance Considerations
- Optimize image uploads (compression if needed)
- Implement caching where appropriate
- Minimize client-side JavaScript

## Development Workflow
- Follow 80/20 rule (80% code quality, 20% speed to market)
- Prioritize core functionality first
- Document technical decisions
- Ensure accessibility compliance 