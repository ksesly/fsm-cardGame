const express = require('express');

const { TableCardDeck, Card, PlayerHand, CardOnTable } = require('../db');
const protected = require('../protected');
const router = express.Router();

router
	.route('/getHandCard/:playerId/:tableId')
	.get(protected, async (req, res) => {
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
	.post(protected, async (req, res) => {
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
router
	.route('/cardsOnTable/:tableId')
	.get(protected, async (req, res) => {
		try {
			const tableId = req.params.tableId;
			const cardsOnTable = await CardOnTable.findAll({
				where: {
					table_id: tableId,
				},
			});

			res.status(200).json(cardsOnTable);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	})
	.post(protected, async (req, res) => {
		try {
			const tableId = req.params.tableId;
			const { cardId } = req.body;
			console.log(req.user.id);
			const playerHandCard = await PlayerHand.findOne({
				where: {
					table_id: tableId,
					card_id: cardId,
					player_id: req.user.id,
				},
				include: {
					model: Card,
					attributes: ['id', 'image', 'title', 'description', 'cost', 'damage', 'defence'],
				},
			});

			if (!playerHandCard) {
				return res.status(400).json({ error: 'Card not found in PlayerHand' });
			}
			console.log(playerHandCard.Card);
			const newCard = await CardOnTable.create({
				player_id: playerHandCard.player_id,
				health: playerHandCard.Card.defence,
				table_id: tableId,
				card_id: playerHandCard.card_id,
			});

			await PlayerHand.destroy({
				where: {
					id: playerHandCard.id,
				},
			});

			res.status(200).json({ message: 'Card placed on the table successfully', newCard });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	});
module.exports = router;
