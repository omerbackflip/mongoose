// db-service.js

exports.getEntities = async ({ model, filter = {}, options = {} }) => {
  if (!model) throw new Error("Model is required");

  const {sort, limit, skip, select, populate, lean = true} = options; // default lean to true

  let query = model.find(filter);

  if (sort) {
    query = query.sort(sort);
  }

  if (typeof limit !== "undefined") {
    query = query.limit(Number(limit));
  }

  if (typeof skip !== "undefined") {
    query = query.skip(Number(skip));
  }

  if (select) {
    query = query.select(select);
  }

  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((p) => {
        query = query.populate(p);
      });
    } else {
      query = query.populate(populate);
    }
  }

  if (lean) {
    query = query.lean();
  }

  const data = await query.exec();
  return data;
};

exports.updateItem = async (model, query, payload, options = {}) => {
  try {
    return await model.findOneAndUpdate(query, payload, { new: true, ...options });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.createItem = async (model,payload) => {
    try {
        return await model.create(payload);
    } catch (error) {
        console.log(error)
        throw error;
    }
},
exports.deleteItem = async (model,query) => {
    try {
        return await model.deleteOne(query);
    } catch (error) {
        console.log(error)
        throw error;
    }
},
exports.deleteMany = async (model,query) => {
    try {
        return await model.deleteMany(query);
    } catch (error) {
        console.log(error)
        throw error;
    }
},
exports.insertMany = async (model,payload) => {
    try {
        return await model.insertMany(payload);
    } catch (error) {
        console.log(error)
        throw error;
    }
}