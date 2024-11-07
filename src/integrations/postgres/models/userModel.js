import baseModel from "./baseModel.js";
import { pool } from '../pool.js';

class userModel extends baseModel {
  constructor() {
    super('"user"');
  }

  async getByCreds(username, password) {
    const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE username = $1 AND password = $2`, [username, password]);
    return result.rows;
  }
}

export default new userModel();
