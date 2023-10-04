const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const protected = require('../protected');
const { CardOnTable, Card } = require('../models/models');

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

module.exports = router;
