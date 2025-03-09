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
          background-image: linear-gradient(to right, #e8f1f8, #c9d9e3);
          color: #333 !important;
          }
            .swagger-ui .info a {
            font-weight: bold;
            color: white;
            transition: color 0.3s ease-in-out;
            }
            .swagger-ui .info a:hover {
            color: #b0e57c;
            }
            .swagger-ui .scheme-container {
          max-width: 1460px;
          margin: 0 auto;
          border-radius: 20px;
          background-color: #2A3C44 !important;
          border: 1px solid #555 !important;
          color: #FFFFFF !important;
          padding: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
            .swagger-ui .scheme-container select {
          background-color: #3A4F58 !important;
          color: #FFFFFF !important;
          border: 1px solid #555 !important;
          border-radius: 8px;
          padding: 5px;
          }
            .swagger-ui .json-schema-2020-12-accordion,
            .swagger-ui .json-schema-2020-12-expand-deep-button {
          background-color: transparent !important;
          color: #2A3C44;
          font-weight: bold;
          }
            .swagger-ui .opblock .opblock-section-header {
          background-image: linear-gradient(to right, #e8f1f8, #c9d9e3);
          border-radius: 10px;
          padding: 10px 15px;
          }
          .information-container.wrapper {
          padding: 0;
          }
            .information-container.wrapper .block.col-12 {
          background-image: linear-gradient(to right, #9BE1A0, #5B9160);
          box-shadow: 0 0 10px 3px rgba(87, 210, 141, 0.5);
          padding: 15px;
          margin: 20px 0;
          border-radius: 20px;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          }
            .information-container.wrapper .block.col-12 .info {
          margin: 0;
          }
            .swagger-ui input, .swagger-ui textarea {
          border-radius: 8px;
          border: 1px solid #ccc;
          padding: 6px;
          background: #fff;
          transition: all 0.3s ease-in-out;
          }
            .swagger-ui input:focus, .swagger-ui textarea:focus {
          border-color: #5B9160;
          box-shadow: 0 0 8px rgba(91, 145, 96, 0.3);
          }
            .swagger-ui .opblock .opblock-summary-method {
          background: linear-gradient(to right, #5B9160, #4A7A50);
          color: #fff !important;
          font-weight: bold;
          padding: 8px 15px;
          border-radius: 8px;
          transition: background 0.3s ease-in-out;
          }
            .swagger-ui .opblock .opblock-summary-method:hover {
          background: linear-gradient(to right, #4A7A50, #3B6240);
          }`,
      }),
    ];
  } catch (err) {
    console.log(err);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
