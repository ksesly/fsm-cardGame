const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const protected = require('../protected');
const { CardOnTable, Card, Table } = require('../models/models');

router.route('/attack').post(protected, async (req, res) => {
	// returns status 0 if kill, status 1 if not
	try {
		const { attackingCardId, targetCardId, tableId } = req.body;

		const attackingCard = await CardOnTable.findOne({
			where: {
				id: attackingCardId,
				table_id: tableId,
				player_id: req.user.id,
			},
			include: {
				model: Card,
				as: 'Card',
				attributes: ['damage', 'defence'],
			},
		});

		const targetCard = await CardOnTable.findOne({
			where: {
				id: targetCardId,
				table_id: tableId,
				player_id: {
					[Sequelize.Op.not]: req.user.id,
				},
			},
			include: {
				model: Card,
				as: 'Card',
				attributes: ['damage', 'defence'],
			},
		});
		if (!attackingCard || !targetCard) return res.status(404).json({ error: 'Card not found' });
		targetCard.health -= attackingCard.Card.damage;
		if (targetCard.health <= 0) {
			console.log('I am dead');
			await targetCard.destroy();
			return res.status(200).json({ message: 'Target card removed', status: 0 });
		} else {
			await targetCard.save();
			return res.status(200).json({ message: 'Attack successful', status: 1 });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error });
	}
});

router.route('/attack-player').post(protected, async (req, res) => {
	// 0 - player killed, 1 - player damaged
	try {
		const { attackingCardId, tableId } = req.body;

		const table = await Table.findByPk(tableId);
		const attackingCard = await CardOnTable.findOne({
			where: {
				id: attackingCardId,
				table_id: tableId,
				player_id: req.user.id,
			},
			include: {
				model: Card,
				as: 'Card',
				attributes: ['damage', 'defence'],
			},
		});
		if (!table) return res.status(404).json({ error: 'Table not found' });
		let health;
		if (table.player_1 === req.user.id) {
			health = 'health_p2';
		} else {
			health = 'health_p1';
		}
		table[health] -= attackingCard.Card.damage;
		if (table[health] <= 0) {
			await table.save();
			return res.status(200).json({ message: 'Player killed', status: 0 });
		}

		await table.save();
		return res.status(200).json({ message: 'Player damaged', status: 1, enemyHP: table[health] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
