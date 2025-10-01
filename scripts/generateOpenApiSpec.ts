/**
 * OpenAPI Specification Generator Script
 *
 * Generates a static OpenAPI JSON specification file from the application's
 * Swagger configuration for documentation distribution and API client generation.
 *
 * Usage: npm run docs:generate
 */

import fs from 'fs';
import path from 'path';
import { swaggerSpec } from '../src/core/config/swagger';

/**
 * Generate OpenAPI specification file
 *
 * Creates a static openapi.json file in the docs directory that can be
 * used for documentation hosting, API client generation, or CI/CD validation.
 */
const generateOpenApiSpec = (): void => {
    try {
        // Ensure docs directory exists
        const docsDir = path.join(__dirname, '..', 'docs');
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }

        // Generate spec file path
        const specPath = path.join(docsDir, 'openapi.json');

        // Write OpenAPI specification to file
        fs.writeFileSync(specPath, JSON.stringify(swaggerSpec, null, 2), 'utf8');

        console.log('✅ OpenAPI specification generated successfully!');
        console.log(`📄 File location: ${specPath}`);
        console.log(`📊 Endpoints documented: ${Object.keys((swaggerSpec as any).paths || {}).length}`);
        console.log(`🏷️  API version: ${(swaggerSpec as any).info?.version}`);
        console.log(`📝 Description: ${(swaggerSpec as any).info?.title}`);

        // Generate additional useful files
        generateMarkdownDocs(docsDir, swaggerSpec);

    } catch (error) {
        console.error('❌ Failed to generate OpenAPI specification:', error);
        process.exit(1);
    }
};

/**
 * Generate additional markdown documentation
 *
 * Creates human-readable documentation files alongside the OpenAPI spec
 * for better developer experience and documentation distribution.
 */
const generateMarkdownDocs = (docsDir: string, spec: any): void => {
    try {
        const readmePath = path.join(docsDir, 'API_DOCUMENTATION.md');

        const markdownContent = `# ${spec.info?.title || 'API'} Documentation

${spec.info?.description || 'API Documentation'}

## API Information

- **Version:** ${spec.info?.version}
- **Base URL:** ${spec.servers?.[0]?.url || 'http://localhost:8000'}
- **Documentation:** [Swagger UI](/api-docs)

## Available Endpoints

${Object.keys(spec.paths || {}).map(path => {
    const methods = Object.keys(spec.paths[path]);
    return `### ${path}\n${methods.map(method => `- **${method.toUpperCase()}** - ${spec.paths[path][method]?.summary || 'No description'}`).join('\n')}`;
}).join('\n\n')}

## Getting Started

1. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Visit the interactive documentation:
   \`\`\`
   http://localhost:8000/api-docs
   \`\`\`

3. Test endpoints using the "Try it out" feature in Swagger UI

## Educational Resources

This API demonstrates:
- RESTful API design principles
- HTTP method semantics (GET, POST, PUT, PATCH, DELETE)
- Request parameter types (query, path, body, headers)
- Input validation and sanitization
- Standardized response formats
- Error handling patterns
- API documentation with OpenAPI/Swagger

## Contact

For questions about this educational API, please contact the TCSS-460 course staff.
`;

        fs.writeFileSync(readmePath, markdownContent, 'utf8');
        console.log(`📚 Additional documentation generated: ${readmePath}`);

    } catch (error) {
        console.warn('⚠️  Failed to generate markdown documentation:', error);
    }
};

// Run the generator
generateOpenApiSpec();