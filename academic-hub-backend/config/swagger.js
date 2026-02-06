const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Academic Hub API',
      version: '1.0.0',
      description: 'API documentation for the Academic Hub Backend',
      contact: {
        name: 'API Support',
        email: 'support@academichub.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // This looks for the @swagger comments in your route files
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;