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

	moves_left: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 2,
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
	table_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	player_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	health: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	card_id: {
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
// PlayerHand.belongsTo(TableCardDeck, { foreignKey: 'table_id' });
CardOnTable.belongsTo(Card, { foreignKey: 'card_id' });

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
	{
		image: 'https://i.etsystatic.com/17372453/r/il/a237f9/1791611739/il_1080xN.1791611739_5uom.jpg',
		title: 'Captain Rex',
		description: 'Clone Commander',
		cost: 4,
		damage: 6,
		defence: 8,
	},
	{
		image: 'https://upload.wikimedia.org/wikipedia/en/d/d7/Ahsoka_Tano.png',
		title: 'Ahsoka Tano',
		description: 'Jedi Padawan',
		cost: 3,
		damage: 7,
		defence: 5,
	},
	{
		image: 'https://upload.wikimedia.org/wikipedia/en/b/bb/MaulStarWars.jpg',
		title: 'Darth Maul',
		description: 'Sith Lord',
		cost: 5,
		damage: 9,
		defence: 6,
	},
	{
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6WzoVu0OQYF1Vde7giRaxu2oCUobRYPL6xcyem8EgO-xCEGwhUL3FsSQI0RQ5SKzjkn4&usqp=CAU',
		title: 'Obi-Wan Kenobi',
		description: 'Jedi Master',
		cost: 4,
		damage: 7,
		defence: 7,
	},
	{
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbffkmG3poyeZb-N4c1A4bLH_8d9t7yqhDCurpgH8Vkw&s',
		title: 'Princess Amidala',
		description: 'Galactic Senator',
		cost: 3,
		damage: 5,
		defence: 5,
	},
	{
		image: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png/revision/latest?cb=20150206140125',
		title: 'Yoda',
		description: 'Grand Master',
		cost: 6,
		damage: 8,
		defence: 9,
	},

	{
		image: 'https://upload.wikimedia.org/wikipedia/en/3/3e/FettbobaJB.png',
		title: 'Boba Fett',
		description: 'Bounty Hunter',
		cost: 4,
		damage: 7,
		defence: 8,
	},
	{
		image: 'https://static.wikia.nocookie.net/starwars/images/e/ec/ChewbaccaCSWE.jpg/revision/latest?cb=20230615051524',
		title: 'Chewbacca',
		description: 'Wookiee Warrior',
		cost: 3,
		damage: 6,
		defence: 9,
	},
	{
		image: 'https://upload.wikimedia.org/wikipedia/en/b/be/Han_Solo_depicted_in_promotional_image_for_Star_Wars_%281977%29.jpg',
		title: 'Han Solo',
		description: 'Smuggler',
		cost: 4,
		damage: 7,
		defence: 6,
	},
	{
		image: 'https://lumiere-a.akamaihd.net/v1/images/Asajj-Ventress_d5ca9413.jpeg?region=267%2C6%2C562%2C563',
		title: 'Asajj Ventress',
		description: 'Sith Assassin',
		cost: 4,
		damage: 7,
		defence: 6,
	},
	{
		image: 'https://static.wikia.nocookie.net/starwars/images/b/b0/Bailrogueone.jpg/revision/latest?cb=20170924232338',
		title: 'Bail Organa',
		description: 'Alderaan Senator',
		cost: 3,
		damage: 5,
		defence: 7,
	},
	{
		image: 'https://m.media-amazon.com/images/I/91+5a2Dr+5L._AC_UF1000,1000_QL80_.jpg',
		title: 'The Mandalorian',
		description: 'Bounty Hunter',
		cost: 5,
		damage: 8,
		defence: 7,
	},
	{
		image: 'https://upload.wikimedia.org/wikipedia/en/5/54/General_Grievous.png',
		title: 'General Grievous',
		description: 'Cyborg General',
		cost: 4,
		damage: 9,
		defence: 5,
	},
	{
		image: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/Mace_Windu.png/220px-Mace_Windu.png',
		title: 'Mace Windu',
		description: 'Jedi Master',
		cost: 5,
		damage: 8,
		defence: 8,
	},
	{
		image: 'https://media.allure.com/photos/5f8f3d745611fc41904f9aee/16:9/w_2560%2Cc_limit/baby%2520yoda.jpg',
		title: 'Baby Yoda',
		description: 'foundling',
		cost: 3,
		damage: 6,
		defence: 6,
	},
	{
		image: 'https://lumiere-a.akamaihd.net/v1/images/Count-Dooku_4f552149.jpeg?region=115%2C0%2C1076%2C808',
		title: 'Count Dooku',
		description: 'Sith Lord',
		cost: 4,
		damage: 7,
		defence: 6,
	},
	{
		image: 'https://static.wikia.nocookie.net/starwars/images/4/4d/Aayla_Secura_SWE.png/revision/latest?cb=20211226192019',
		title: 'Aayla Secura',
		description: 'Twilek Jedi Knight',
		cost: 3,
		damage: 6,
		defence: 5,
	},
];
async function addStarWarsCards() {
	try {
		const existingCards = await Card.findAll();
		if (existingCards.length === 0) {
			await Card.bulkCreate(starWarsCards);
			console.log('Star Wars cards added to the database.');
		} else console.log('Star Wars cards already exist in the database.');
	} catch (error) {
		console.error('Error adding Star Wars cards:', error);
	}
}
// MAKE TRUE!!!!!!!!!!!!
sequelize
	.sync({ alter: true })
	.then(() => {
		console.log('Database and tables synced.');

		addStarWarsCards();
	})
	.catch((error) => {
		console.error('Error syncing database:', error);
	});

module.exports = {
	User,
	Card,
	Table,
	CardOnTable,
	TableCardDeck,
	PlayerHand,
};
