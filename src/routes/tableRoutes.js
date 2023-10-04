const express = require('express');

const { TableCardDeck, Card, PlayerHand } = require('../db');
const router = express.Router();

router
	.route('/getHandCard/:playerId/:tableId')
	.get(async (req, res) => {
		try {
			const cards = await PlayerHand.findAll({
				where: {
					table_id: req.params.tableId,
					player_id: req.params.playerId,
				},
				include: {
					model: Card,
					attributes: ['id', 'image', 'title', 'description', 'cost', 'damage', 'defence'],
				},
				attributes: [],
			});
			const extractedCards = cards.map((item) => item.Card);

			res.status(200).json(extractedCards);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	})
	.post(async (req, res) => {
		try {
			const tableId = req.params.tableId;
			const playerId = req.params.playerId;
			const { numberOfCardsToAdd } = req.body;

			const cardsToAdd = await TableCardDeck.findAll({
				where: {
					table_id: tableId,
					player_id: playerId,
				},
				limit: numberOfCardsToAdd,
			});

			if (cardsToAdd.length === 0) return res.status(400).json({ error: 'No more cards in the deck.' });

			await Promise.all(
				cardsToAdd.map(async (card) => {
					await PlayerHand.create({
						table_id: tableId,
						player_id: playerId,
						card_id: card.card_id,
					});

					await TableCardDeck.destroy({
						where: {
							id: card.id,
						},
					});
				})
			);

			res.status(200).json({ message: `Added ${numberOfCardsToAdd} cards to the player's hand.` });
		} catch (error) {
			console.error('Error adding cards to player hand:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	});

module.exports = router;
