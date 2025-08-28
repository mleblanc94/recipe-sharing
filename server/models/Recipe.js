const { Schema, model } = require('mongoose');

// Creates Recipe schema
const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        default: ''
    },
    instructions: {
        type: String,
        default: ''
    },
    imageName: {
        type: String,
        required: false,
        default: 'default.png'
    },
    creator: { // Foreign key
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    interestedIn: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    recipeType: {
        type: Schema.Types.ObjectId, ref: 'RecipeType', required: true
    },
    createdAt: { // Create a timestamp for recipe creation
        type: Date,
        default: Date.now
    },
});

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;