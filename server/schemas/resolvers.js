const { User, Recipe, RecipeType } = require('../models');
const { AuthenticationError } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');

const secret = 'verySecret';
const expiration = '2h';

const signToken = ({ username, email, _id }) => {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

const resolvers = {
    Query: {
        getAllRecipes: async () => {
            return await Recipe.find();
        },
        getCreatedRecipes: async (_, { creator }) => {
            const recipes = await Recipe.find({ creator });
            return recipes;
        },
        getNotCreatedRecipes: async (_, { creator }) => {
            const recipes = await Recipe.find({ creator: { $ne: creator } });
        },
        getInterestedIn: async (_, { interestedIn }) => {
            try {
                const interestedInObjectId = new mongoose.Types.ObjectId(interestedIn);
                const recipes = await Recipe.find({ interestedIn: { $in: interestedIn } });
                return recipes;
            } catch (error) {
                console.error('Error fetching recipes:', error);
                throw new Error('Unable to fetch recipes!');
            }
        },
        getAllRecipeTypes: async () => {
            try {
                const recipeTypes = await RecipeType.find();
                return recipeTypes;
            } catch (error) {
                console.error('Error fetching recipe types:', error);
                throw new Error('Unable to fetch recipe types')
            }
        },
    },
    Mutation: {
        createRecipe: async (_, { input }) => {
            try {
                const newRecipe = await Recipe.create(input);
                return newRecipe;
            } catch (error) {
                throw new Error('Unable to create recipe');
            }
        },
        createUser: async (_, args) => {
            if (args.input) {
                const newUser = await User.create(args.input);
                return newUser;
            } else {
                const { username, email, password } = args;
                const user = await User.create({ username, password, email });
                if (!user) {
                    throw new AuthenticationError;
                }

                const token = signToken({
                    username: user.username,
                    email: user.email,
                    _id: user._id,
                })

                return { token, user };
            }
        },
        addToInterestedIn: async (_, { recipeId, userId }) => {
            try {
                const recipe = await Recipe.findByIdAndUpdate(
                    recipeId,
                    { $addToSet: { interestedIn: userId } },
                    { new: true }
                );

                return recipe;
            } catch (error) {
                throw new Error('Error adding user to interested in list', error);
            }
        },
        login: async (_, { email, password }) => {
            //Find user by email
            const user = await User.findOne({ email });
            // If email doesn't exist, throw an error
            if (!user) throw new AuthenticationError("Email not found!");
            // Check that password matches the email
            const correctPW = await user.isCorrectPassword(password);
            if (!correctPW) throw new AuthenticationError("Incorrect login credentials!");

            const token = signToken(user); // Issue the token

            return { token, user }; // Return the token and the user
        },
    },
    Recipe: {
        interestedIn: async (parent) => {
            return await User.find({ _id: { $in:parent.interetestedIn } });
        },
    },
};

module.exports = resolvers;

