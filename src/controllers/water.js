import {
  addWater,
  updateWater,
  deleteWater,
  getDailyWater,
  getMonthlyWater,
} from '../services/water.js';

// тут юзером додається запис про воду

export const addWaterController = async (req, res, next) => {
  const { volume, date } = req.body;

  // перетворення дати в формат дейт

  const formattedDate = new Date(date);

  const userId = '67a1f599b7ed372da1c632e0';

  const newWater = await addWater(userId, volume, formattedDate);

  res.status(201).json({
    status: 201,
    message: 'Successfully added water record!',
    data: newWater,
  });
};

// редагуванням юзером запису про воду

export const updateWaterController = async (req, res, next) => {
  const { id } = req.params;
  const { volume, date } = req.body;

  const userId = '67a1f599b7ed372da1c632e0';

  const updatedWater = await updateWater(userId, id, volume, date);

  res.json({
    status: 200,
    message: 'Successfully updated water record!',
    data: updatedWater,
  });
};

// видалення юзером запису про воду

export const deleteWaterController = async (req, res, next) => {
  const { id } = req.params;

  const userId = '67a1f599b7ed372da1c632e0';

  await deleteWater(userId, id);

  res.status(204).send();
};

// тут отримуються дані про споживання води за певний конкретний день

export const getDailyWaterController = async (req, res, next) => {

  const { userId = '67a1f599b7ed372da1c632e0', date } = req.query;

  const waterEntries = await getDailyWater(userId, date);

  res.json({
    status: 200,
    message: 'Successfully retrieved daily water records!',
    data: waterEntries,
  });
};

// тут отримуються дані про споживання води за певний конкретний місяць

export const getMonthlyWaterController = async (req, res, next) => {

  const userId = '67a1f599b7ed372da1c632e0';

  const { month } = req.query;

  const waterEntries = await getMonthlyWater(userId, month);

  res.json({
    status: 200,
    message: 'Successfully retrieved monthly water records!',
    data: waterEntries,
  });
};
