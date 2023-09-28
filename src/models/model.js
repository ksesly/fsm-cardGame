const pool = require('../db');

class Model {
	constructor(args) {
		// this.argAmount = 0;
		// this.tableName = args.tableName || 'heroes';
		const keys = Object.keys(args);
		const values = Object.values(args);
		for (let i = 0; i < keys.length; i++) this[keys[i]] = `${values[i]}`;
	}
	async find(id) {
		try {
			const rows = await pool.execute(`SELECT * FROM ${this.tableName} WHERE id=${id}`);
			if (rows.length > 0) {
				// for (const [k, v] of Object.entries(rows[0][0])) {
				// 	this.k = v;
				// }
				const keys = Object.keys(rows[0][0]);
				const values = Object.values(rows[0][0]);
				for (let i = 0; i < keys.length; i++) this[keys[i]] = `${values[i]}`;
				return true;
			}
		} catch (e) {
			throw e;
		}
	}
	async delete() {
		try {
			if (this.id && this.find(this.id)) {
				await pool.execute(`DELETE FROM ${this.tableName} WHERE id=${this.id}`);
				return true;
			}
		} catch (error) {
			throw error;
		}
		return false;
	}
	async save() {
		let updateList = Object.assign({}, this);

		delete updateList.tableName;
		const columns = Object.keys(updateList).join(', ');
		const values = Object.values(updateList).map((val) => `'${val}'`);
		if (this.id && this.find(this.id)) {
			await pool.execute(`UPDATE ${this.tableName} SET ${updateList} WHERE id=${this.id}`);
		} else {
			console.log('Insering');
			const id = await pool.execute(`INSERT INTO ${this.tableName} (${columns}) VALUES (${values})`);
			this.id = id[0].insertId;
		}
		return true;
	}
}

module.exports = Model;
