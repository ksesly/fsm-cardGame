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

const TableCardDeck = sequelize.define('table_card_deck', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	player_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	card_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	table_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});
const PlayerHand = sequelize.define('player_hand', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	player_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	card_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	table_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});
User.hasMany(Table, { foreignKey: 'player_1', as: 'Player1' });
User.hasMany(Table, { foreignKey: 'player_2', as: 'Player2' });

Table.belongsTo(User, { foreignKey: 'player_1', as: 'Player1' });
Table.belongsTo(User, { foreignKey: 'player_2', as: 'Player2' });

TableCardDeck.belongsTo(Table, { foreignKey: 'table_id' });
TableCardDeck.belongsTo(Card, { foreignKey: 'card_id' });

PlayerHand.belongsTo(Card, { foreignKey: 'card_id' });
PlayerHand.belongsTo(TableCardDeck, { foreignKey: 'table_id' });

const starWarsCards = [
	{
		image: 'https://facts.net/wp-content/uploads/2023/07/darth-vader-with-red-light-saber.jpg',
		title: 'Darth Vader',
		description: 'Sith Lord',
		cost: 5,
		damage: 8,
		defence: 6,
	},
	{
		image: 'https://static.tvtropes.org/pmwiki/pub/images/luke_the_hero_small.png',
		title: 'Luke Skywalker',
		description: 'Jedi Knight',
		cost: 4,
		damage: 7,
		defence: 5,
	},
	{
		image: 'https://i0.wp.com/beverlyhillsfilmfestival.com/wp-content/uploads/gun.jpeg?fit=672%2C1000&ssl=1',
		title: 'Princess Leia',
		description: 'Rebel Leader',
		cost: 3,
		damage: 6,
		defence: 4,
	},
];
async function addStarWarsCards() {
	try {
		await Card.bulkCreate(starWarsCards);
		console.log('Star Wars cards added to the database.');
	} catch (error) {
		console.error('Error adding Star Wars cards:', error);
	}
}

// sequelize
// 	.sync({ alter: true })
// 	.then(() => {
// 		console.log('Database and tables synced.');
// 		// addStarWarsCards();
// 	})
// 	.catch((error) => {
// 		console.error('Error syncing database:', error);
// 	});

module.exports = {
	User,
	Card,
	Table,
	CardOnTable,
	TableCardDeck,
	PlayerHand,
};
