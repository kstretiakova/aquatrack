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
          background-color: #121212;
          color: #E0E0E0 !important;
          font-family: 'Inter', sans-serif;
          }
            .swagger-ui .info a {
            font-weight: bold;
            color: #00D1B2;
            transition: color 0.3s ease-in-out;
            }
            .swagger-ui .info a:hover {
            color: #32E6B5;
            }
            .swagger-ui .scheme-container {
          max-width: 1400px;
          margin: 0 auto;
          border-radius: 12px;
          background-color: #1E1E1E !important;
          border: 1px solid #333 !important;
          color: #FFFFFF !important;
          padding: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }
            .swagger-ui .scheme-container select {
          background-color: #252525 !important;
          color: #E0E0E0 !important;
          border: 1px solid #444 !important;
          border-radius: 8px;
          padding: 6px;
          }
            .swagger-ui .json-schema-2020-12-accordion,
            .swagger-ui .json-schema-2020-12-expand-deep-button {
          background-color: transparent !important;
          color: #00D1B2;
          font-weight: bold;
          }
            .swagger-ui .opblock .opblock-section-header {
          background: #1E1E1E;
          border-radius: 10px;
          padding: 10px 15px;
          border-bottom: 1px solid #333;
          }
          .information-container.wrapper {
          padding: 0;
          }
            .information-container.wrapper .block.col-12 {
          background: linear-gradient(to right, #232A34, #1B1F24);
          box-shadow: 0 0 10px 3px rgba(0, 209, 178, 0.2);
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
          border: 1px solid #444;
          padding: 8px;
          background: #252525;
          color: #E0E0E0;
          transition: all 0.3s ease-in-out;
          }
            .swagger-ui input:focus, .swagger-ui textarea:focus {
          border-color: #00D1B2;
          box-shadow: 0 0 8px rgba(0, 209, 178, 0.4);
          }
            .swagger-ui .opblock .opblock-summary-method {
          background: linear-gradient(to right, #00D1B2, #00A896);
          color: #fff !important;
          font-weight: bold;
          padding: 10px 18px;
          border-radius: 8px;
          transition: background 0.3s ease-in-out;
          }
            .swagger-ui .opblock .opblock-summary-method:hover {
          background: linear-gradient(to right, #00A896, #00867D);
          }
            .swagger-ui .authorize {
          border: 1px solid #00D1B2 !important;
          background: transparent !important;
          color: #00D1B2 !important;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: bold;
          transition: all 0.3s ease-in-out;
          }
            .swagger-ui .authorize:hover {
          background: #00D1B2 !important;
          color: #121212 !important;
          }`,
      }),
    ];
  } catch (err) {
    console.log(err);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
