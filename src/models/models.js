const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('ucode_web', 'kslipko', 'securepass', {
	host: 'localhost',
	dialect: 'mysql',
});

const User = sequelize.define('User', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	login: {
		type: DataTypes.STRING(100),
		unique: true,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING(150),
		allowNull: false,
		unique: true,
	},
	role: {
		type: DataTypes.STRING(100),
		defaultValue: 'user',
	},
});

const Card = sequelize.define('Card', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	image: {
		type: DataTypes.STRING(200),
		allowNull: false,
	},
	title: {
		type: DataTypes.STRING(50),
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	cost: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	damage: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	defence: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

const Table = sequelize.define('Table', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	player_1: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	player_2: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	health_p1: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 20,
	},
	health_p2: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 20,
	},
	move: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

const CardOnTable = sequelize.define('card_on_table', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	player_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	health: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

const TableCard = sequelize.define('table_card', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
});

User.hasMany(Table, { foreignKey: 'player_1', as: 'Player1' });
User.hasMany(Table, { foreignKey: 'player_2', as: 'Player2' });

Table.belongsTo(User, { foreignKey: 'player_1', as: 'Player1' });
Table.belongsTo(User, { foreignKey: 'player_2', as: 'Player2' });

TableCard.belongsTo(Table, { foreignKey: 'table_id' });
TableCard.belongsTo(CardOnTable, { foreignKey: 'card_id' });

sequelize
	.sync({ alter: false })
	.then(() => {
		console.log('Database and tables synced.');
	})
	.catch((error) => {
		console.error('Error syncing database:', error);
	});

module.exports = {
	User,
	Card,
	Table,
	CardOnTable,
	TableCard,
};
