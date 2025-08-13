const mongoose = require('mongoose'); // Imports mongoose
const RecipeType = require('../models/ProjectType'); // Imports RecipeType model
const db = require('../config/connection'); // Database connection
const cleanDB = require('./cleanDB'); // CleanDB function
const recipeTypeSeeds = require('./recipeTypesData.json'); // Import recipeType seeds from recipeType.json

db.once('open', async () => {
    await cleanDB('RecipeType', 'RecipeTypes');
    await RecipeType.create(recipeTypeSeeds);

    console.log('ALL DONE!');
    process.exit(0);
})