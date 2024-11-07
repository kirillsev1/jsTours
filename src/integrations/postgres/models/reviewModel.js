import baseModel from "./baseModel.js";
import { pool } from '../pool.js';
import dotenv from 'dotenv';
dotenv.config();

class reviewModel extends baseModel {
  constructor() {
    super('"review"');
  }

  async getByPageTourId(page, tour_id){
    const query = `SELECT * FROM ${this.tableName} WHERE tour_id = $1 LIMIT ${process.env.LIMIT} OFFSET $2`;
    const { rows } = await pool.query(query, [tour_id, page * process.env.LIMIT]);
    return rows;
  }
}

export default new reviewModel();
