const express = require('express');

const { TableCardDeck, Card, PlayerHand, CardOnTable, Table } = require('../db');
const protected = require('../protected');
const router = express.Router();

router
	.route('/getHandCard/:tableId')
	.get(protected, async (req, res) => {
		try {
			const cards = await PlayerHand.findAll({
				where: {
					table_id: req.params.tableId,
					player_id: req.user.id,
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
			const playerId = req.user.id;
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
			res.status(500).json({ error: error });
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
				include: {
					model: Card,
					attributes: ['id', 'image', 'title', 'description', 'cost', 'damage', 'defence'],
				},
				attributes: ['player_id', 'health', 'id'],
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

			await playerHandCard.destroy();

			res.status(200).json({ message: 'Card placed on the table successfully', newCard });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	});
router.route('/changeTurn/:tableId').post(protected, async (req, res) => {
	const tableId = req.params.tableId;

	try {
		const table = await Table.findByPk(tableId);

		if (!table) return res.status(404).json({ error: 'Table not found' });
		if (table.mana_per_move < 10 && table.mana_p1 === table.mana_p2) table.mana_per_move += 1;
		if (table.move === table.player_1) table.mana_p1 = table.mana_per_move;
		else table.mana_p2 = table.mana_per_move;
		table.move = table.move === table.player_1 ? table.player_2 : table.player_1;

		await table.save();
		res.status(200).json({ message: 'Turn changed successfully', table });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error });
	}
});

router.route('isMyTurn/:tableId').get(protected, async (req, res) => {
	const tableId = req.params.tableId;

	try {
		const table = await Table.findByPk(tableId);

		if (!table) return res.status(404).json({ error: 'Table not found' });

		res.status(200).json({ yourMove: table.move === req.user.id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error });
	}
});

module.exports = router;
