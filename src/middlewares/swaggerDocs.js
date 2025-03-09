import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [
      ...swaggerUI.serve,
      swaggerUI.setup(swaggerDoc, {
        customCss: `body, .swagger-ui {
          background-color: #F5F7FA;
          color: #333 !important;
          font-family: 'Inter', sans-serif;
          }
            .swagger-ui .info a {
            font-weight: bold;
            color: #007BFF;
            transition: color 0.3s ease-in-out;
            }
            .swagger-ui .info a:hover {
            color: #0056b3;
            }
            .swagger-ui .scheme-container {
          max-width: 1400px;
          margin: 0 auto;
          border-radius: 12px;
          background-color: #FFFFFF !important;
          border: 1px solid #DDDDDD !important;
          color: #333 !important;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
            .swagger-ui .scheme-container select {
          background-color: #F0F3F7 !important;
          color: #333 !important;
          border: 1px solid #CCCCCC !important;
          border-radius: 8px;
          padding: 6px;
          }
            .swagger-ui .json-schema-2020-12-accordion,
            .swagger-ui .json-schema-2020-12-expand-deep-button {
          background-color: transparent !important;
          color: #007BFF;
          font-weight: bold;
          }
            .swagger-ui .opblock .opblock-section-header {
          background: #E8F0FE;
          border-radius: 10px;
          padding: 12px 18px;
          border-bottom: 1px solid #CCCCCC;
          font-weight: bold;
          }
          .information-container.wrapper {
          padding: 0;
          }
            .information-container.wrapper .block.col-12 {
          background: linear-gradient(to right, #FFFFFF, #F0F3F7);
          box-shadow: 0 0 12px 2px rgba(0, 123, 255, 0.15);
          padding: 18px;
          margin: 20px 0;
          border-radius: 15px;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          }
            .information-container.wrapper .block.col-12 .info {
          margin: 0;
          }
            .swagger-ui input, .swagger-ui textarea {
          border-radius: 8px;
          border: 1px solid #CCCCCC;
          padding: 8px;
          background: #FFFFFF;
          color: #333;
          transition: all 0.3s ease-in-out;
          }
            .swagger-ui input:focus, .swagger-ui textarea:focus {
          border-color: #007BFF;
          box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
          }
            .swagger-ui .opblock .opblock-summary-method {
          background: linear-gradient(to right, #007BFF, #0056b3);
          color: #fff !important;
          font-weight: bold;
          padding: 10px 18px;
          border-radius: 8px;
          transition: background 0.3s ease-in-out;
          }
            .swagger-ui .opblock .opblock-summary-method:hover {
          background: linear-gradient(to right, #0056b3, #004096);
          }
            .swagger-ui .authorize {
          border: 1px solid #007BFF !important;
          background: #FFFFFF !important;
          color: #007BFF !important;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: bold;
          transition: all 0.3s ease-in-out;
          }
            .swagger-ui .authorize:hover {
          background: #007BFF !important;
          color: #FFFFFF !important;
          }`,
      }),
    ];
  } catch (err) {
    console.log(err);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
