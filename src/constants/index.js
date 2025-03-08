import path from 'node:path';

export const GENDER_TYPES = ['male', 'female', 'none'];
export const THIRTY_MINUTES = 30 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

/*

1. Session

2. User
name string min 2 max 12 default ''
email String +
passwoord + (hash)
gender [woman, man] default woman
weight кг. default  0
dailySportTime default 0 h
dailyNorm default 1500мл | 500 - 15000 зберігати в мл
avatarUrl default https://cloudinary.com/default-image.jpg

3. Water

volume 50 - 5000
date - String  YYYY-MM-DDThh:mm
userId

прошарок middlewares




*/
