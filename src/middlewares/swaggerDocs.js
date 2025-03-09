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
          background-color: #F9FAFB;
          color: #333 !important;
          font-family: 'Inter', sans-serif;
          }
            .swagger-ui .info a {
            font-weight: 600;
            color: #2563EB;
            transition: color 0.2s ease-in-out;
            }
            .swagger-ui .info a:hover {
            color: #1E40AF;
            }
            .swagger-ui .scheme-container {
          max-width: 1350px;
          margin: 20px auto;
          border-radius: 14px;
          background-color: #FFFFFF !important;
          border: 1px solid #E0E4E8 !important;
          color: #333 !important;
          padding: 14px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          }
            .swagger-ui .scheme-container select {
          background-color: #F3F4F6 !important;
          color: #333 !important;
          border: 1px solid #D1D5DB !important;
          border-radius: 10px;
          padding: 8px;
          font-size: 14px;
          }
            .swagger-ui .json-schema-2020-12-accordion,
            .swagger-ui .json-schema-2020-12-expand-deep-button {
          background-color: transparent !important;
          color: #2563EB;
          font-weight: 600;
          }
            .swagger-ui .opblock .opblock-section-header {
          background: #EFF6FF;
          border-radius: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid #D1D5DB;
          font-weight: bold;
          font-size: 16px;
          }
          .information-container.wrapper {
          padding: 0;
          }
            .information-container.wrapper .block.col-12 {
          background: linear-gradient(to right, #FFFFFF, #F3F4F6);
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.15);
          padding: 20px;
          margin: 24px 0;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          }
            .information-container.wrapper .block.col-12 .info {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          }
            .swagger-ui input, .swagger-ui textarea {
          border-radius: 10px;
          border: 1px solid #D1D5DB;
          padding: 10px;
          background: #FFFFFF;
          color: #333;
          font-size: 14px;
          transition: all 0.2s ease-in-out;
          }
            .swagger-ui input:focus, .swagger-ui textarea:focus {
          border-color: #2563EB;
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.25);
          }
            .swagger-ui .opblock .opblock-summary-method {
          background: linear-gradient(to right, #3B82F6, #2563EB);
          color: #fff !important;
          font-weight: bold;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          transition: background 0.2s ease-in-out;
          }
            .swagger-ui .opblock .opblock-summary-method:hover {
          background: linear-gradient(to right, #2563EB, #1E40AF);
          }
            .swagger-ui .authorize {
          border: 1px solid #3B82F6 !important;
          background: #FFFFFF !important;
          color: #3B82F6 !important;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: bold;
          transition: all 0.2s ease-in-out;
          }
            .swagger-ui .authorize:hover {
          background: #3B82F6 !important;
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
