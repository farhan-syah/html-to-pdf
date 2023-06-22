import swaggerJsdoc from "swagger-jsdoc";
import yaml from 'js-yaml';

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HTML to PDF API",
      version: "1.0.0",
    },
  },
  apis: ["./src/index.ts"], // path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);
// Convert JSON to YAML
export const yamlData = yaml.dump(specs);

// Generate Swagger UI HTML
export const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Docs</title>
  <link rel="stylesheet" type="text/css" href="https://petstore.swagger.io/swagger-ui.css" >
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://petstore.swagger.io/swagger-ui-bundle.js"> </script>
  <script src="https://petstore.swagger.io/swagger-ui-standalone-preset.js"> </script>
  <script>
  window.onload = function() {
    // Begin Swagger UI call region
    const ui = SwaggerUIBundle({
      spec: ${JSON.stringify(specs)},
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    })
    // End Swagger UI call region
    window.ui = ui
  }
  </script>
</body>
</html>
`;

