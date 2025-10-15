// const db = require("../models");
const db = require("../../../models");

const dbService = require("../services/db-service");

//Create and Save a new entity:
exports.create = async (req, res) => {
	try {
		const entity = { ...req.body };
		const data = await dbService.createItem(db[req.query.model], entity);
		if (data) {
			res.send(data);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({message: error.message || "Some error occurred while create entity."});
	}
};

// exports.findAll = async (req, res) => {
// 	try {
// 		const query = {... req.query};
// 		const model = req.query.model;
// 		delete query.model;
// 		return res.send(await dbService.getMultipleItems(db[model], req.query));
// 	} catch (error) {
// 		res.status(500).send({message: error.message || "Some error occurred while findAll entity."});		
// 	}
// };


// //Find a single entity with an id:
// exports.findOne = async (req, res) => {
// 	try {
// 		const id = req.params.id;
// 		return res.send(await dbService.getSingleItem(db[req.query.model], {_id: id}));
// 	} catch (error) {
// 		res.status(500).send({ message: "Error retrieving entity!"});		
// 	}
// };


exports.getEntities = async (req, res) => {
	try {
		const { model, ...filter } = req.query;
		if (!model) return res.status(400).send({ message: "Missing 'model' parameter" });

		const result = await dbService.getEntities({ model: db[model], filter });

		if (!result || (Array.isArray(result) && result.length === 0)) {
			return res.status(404).send({ message: "No results found" });
		}

		res.send(result);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Error retrieving data", error: error.message });
	}
};




// //Update a entity identified by the id in the request:
// exports.update = async (req, res) => {
// 	try {
// 		const id = req.params.id;
// 		const data = await dbService.updateItem(db[req.query.model], {_id: id}, req.body);
// 		if(data) {
// 			res.send({ message: "entity was updated successfully." });
// 		} else {
// 			res.status(404).send({message: `Cannot update entity with id=${id}. Maybe entity was not found!`});
// 		}
// 	} catch (error) {
// 		res.status(500).send({ message: "Error updating entity!"});		
// 	}
// };

// Unified update function
exports.updateEntity = async (req, res) => {
  try {
    const { filter, data } = req.body;
    const { model, ...options } = req.query; // options = { upsert: true, etc. }

    if (!model) return res.status(400).send({ message: "Missing 'model' parameter" });
    if (!filter || typeof filter !== "object") {
      return res.status(400).send({ message: "Missing or invalid 'filter' in body" });
    }

    const result = await dbService.updateItem(db[model], filter, data, options);

    if (!result) {
      return res.status(404).send({ message: "Entity not found" });
    }

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating entity!", error: error.message });
  }
};



//Delete a entity with the specified id:
exports.delete = async (req, res) => {
	try {
		const id = req.query.id;
		const data = await dbService.deleteItem(db[req.query.model], {_id: id});
		if(data) {
			res.send({ message: "entity was updated successfully." });
		} else {
			res.status(404).send({message: `Cannot delete entity with id=${id}. Maybe entity was not found!`});
		}
	} catch (error) {
		res.status(500).send({ message: "Error updating entity!"});		
	}
};

//Delete all records with specified year - if year not specified - delete all data from the database:
exports.deleteAll = async (req, res) => {
	try {
		const query = {... req.query};
		const model = req.query.model;
		delete query.model;

		const data = await dbService.deleteMany(db[model], query);
		if(data) {
			res.send({
				message: `${data.deletedCount} data were deleted successfully!`
			});
		}
	} catch (error) {
		res.status(500).send({
			message:
				err.message || "Some error occurred while removing all data."
		});
	}
};
