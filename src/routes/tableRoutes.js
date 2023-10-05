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
			const currentNumberOfCards = await PlayerHand.count({
				where: {
					table_id: tableId,
					player_id: playerId,
				},
			});
			const cardsToAdd = await TableCardDeck.findAll({
				where: {
					table_id: tableId,
					player_id: playerId,
				},
				limit: 3 - currentNumberOfCards,
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

			res.status(200).json({ message: `Added ${3 - currentNumberOfCards} cards to the player's hand.` });
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
			const table = await Table.findByPk(tableId);
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
			if (table.moves_left === 0) {
				return res.status(200).json({ error: 'No more moves left', status: '-1' });
			}
			console.log(playerHandCard.Card);
			const newCard = await CardOnTable.create({
				player_id: playerHandCard.player_id,
				health: playerHandCard.Card.defence,
				table_id: tableId,
				card_id: playerHandCard.card_id,
			});
			table.moves_left -= 1;
			await table.save();
			await playerHandCard.destroy();

			res.status(200).json({ message: 'Card placed on the table successfully', newCard });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	});
router.route('/changeTurn/:tableId').post(protected, async (req, res) => {
	const tableId = req.params.tableId;
	console.log(tableId, 'THIS ISISISISIISSIIS');
	try {
		const table = await Table.findByPk(tableId * 1);
		if (table.move === req.user.id) {
			if (!table) return res.status(404).json({ error: 'Table not found' });
			table.moves_left = 2;
			table.move = table.move === table.player_1 ? table.player_2 : table.player_1;

			await table.save();
			res.status(200).json({ message: 'Turn changed successfully' });
		} else res.status(410).json({ message: 'You cant change it :(' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error });
	}
});

router.route('/isMyTurn/:tableId').get(protected, async (req, res) => {
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

router.route('/howManyMovesLeft/:tableId').get(protected, async (req, res) => {
	const tableId = req.params.tableId;

	try {
		const table = await Table.findByPk(tableId);
		if (!table) return res.status(404).json({ error: 'Table not found' });

		res.status(200).json({ movesLeft: table.moves_left });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error });
	}
});
module.exports = router;
