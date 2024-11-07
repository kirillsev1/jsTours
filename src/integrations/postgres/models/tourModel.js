import baseModel from "./baseModel.js";
import { pool } from '../pool.js';
import dotenv from 'dotenv';
dotenv.config();

class tourModel extends baseModel {
  constructor() {
    super('"tour"');
  }
}

export default new tourModel();
