import { pool } from '../pool.js';

const LIMIT = 5;

class baseModel {
    constructor(tableName) {
      this.tableName = tableName;
    }

    async getAll() {
      const query = `SELECT * FROM ${this.tableName} ORDER BY id`;
      const { rows } = await pool.query(query);
      return rows;
    }

    async getById(id) {
      const query = `SELECT * FROM ${this.tableName} WHERE id = ${id}`;
      const { rows } = await pool.query(query);
      return rows[0];
    }

    async create(data) {
      const keys = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders}) RETURNING *`;

      const { rows } = await pool.query(query, values);
      return rows[0];
    }

    async update(id, data) {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      const query = `UPDATE ${this.tableName} SET ${setQuery} WHERE id = ${id} RETURNING *`;
      const { rows } = await pool.query(query, [...values]);
      return rows[0];
    }

    async delete(id, user_id) {
      const query = `DELETE FROM ${this.tableName} WHERE id = ${id} AND user_id = ${user_id} RETURNING *`;
      const { rows } = await pool.query(query);
      return rows[0];
    }

    async restDelete(id) {
      const query = `DELETE FROM ${this.tableName} WHERE id = ${id} RETURNING id`;
      const { rows } = await pool.query(query);
      return rows[0];
    }


    async getByPage(page){
      const query = `SELECT * FROM ${this.tableName} LIMIT ${LIMIT} OFFSET ${page * LIMIT}`;
      const { rows } = await pool.query(query);
      return rows;
    }

    async getByPageUId(page, user_id){
      const query = `SELECT * FROM ${this.tableName} WHERE user_id = ${user_id} LIMIT ${LIMIT} OFFSET ${page * LIMIT}`;
      const { rows } = await pool.query(query);
      return rows;
    }
  }
  
  export default baseModel;