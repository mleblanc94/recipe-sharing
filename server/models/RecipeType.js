const { Schema, model } = require('mongoose');

const recipeTypeSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});

const RecipeType = model('RecipeType', recipeTypeSchema);

module.exports = RecipeType;