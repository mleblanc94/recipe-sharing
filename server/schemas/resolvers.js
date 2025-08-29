// server/schemas/resolvers.js
const { User, Recipe, RecipeType } = require('../models');
const { AuthenticationError } = require('../utils/auth'); // your helper wraps/exports the error
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const secret = 'verySecret';
const expiration = '2h';

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

const toLines = (x) => {
  if (Array.isArray(x)) return x.map(String).map(s => s.trim()).filter(Boolean);
  return String(x || '')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
};

const resolvers = {
  Query: {
    getAllRecipes: async () => Recipe.find(),

    getCreatedRecipes: async (_, { creator }) => Recipe.find({ creator }),

    getNotCreatedRecipes: async (_, { creator }) =>
      Recipe.find({ creator: { $ne: creator } }),

    getInterestedIn: async (_, { interestedIn }) => {
      try {
        const id = new mongoose.Types.ObjectId(interestedIn);
        // $in expects an array
        return await Recipe.find({ interestedIn: { $in: [id] } });
      } catch (error) {
        console.error('getInterestedIn error:', error);
        throw new Error('Unable to fetch recipes!');
      }
    },

    getAllRecipeTypes: async () => {
      try {
        return await RecipeType.find();
      } catch (error) {
        console.error('getAllRecipeTypes error:', error);
        throw new Error('Unable to fetch recipe types');
      }
    },
  },

  Mutation: {
    // expects args: { input: { title, description, ingredients, instructions, recipeType, ... } }
    createRecipe: async (_, { input }, context) => {
      try {
        // require auth and stamp creator
        if (!context.user?._id) {
          throw new AuthenticationError('You need to be logged in');
        }

        // normalize arrays from textarea strings, enforce minimally required fields
        const ingredients = toLines(input.ingredients);
        const instructions = toLines(input.instructions);

        if (!input?.title?.trim()) {
          throw new Error('Title is required');
        }
        if (!ingredients.length) {
          throw new Error('At least one ingredient is required');
        }
        if (!instructions.length) {
          throw new Error('At least one instruction is required');
        }

        const doc = await Recipe.create({
          ...input,
          title: input.title.trim(),
          description: (input.description || '').trim(),
          ingredients,
          instructions,
          creator: context.user._id, // ensure ownership
        });

        return doc;
      } catch (error) {
        // this will show up in `heroku logs --tail`
        console.error('createRecipe failed:', {
          message: error.message,
          name: error.name,
          code: error.code,
          stack: error.stack,
        });
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
        if (!user) throw new AuthenticationError('User creation failed');

        const token = signToken({
          username: user.username,
          email: user.email,
          _id: user._id,
        });

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
        console.error('addToInterestedIn error:', error);
        throw new Error('Error adding user to interested in list');
      }
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('Email not found!');
      const correctPW = await user.isCorrectPassword(password);
      if (!correctPW) throw new AuthenticationError('Incorrect login credentials!');
      const token = signToken(user);
      return { token, user };
    },
  },

  Recipe: {
    // fix typo: parent.interestedIn (not interetestedIn)
    interestedIn: async (parent) => {
      const ids = parent.interestedIn || [];
      return await User.find({ _id: { $in: ids } });
    },
  },
};

module.exports = resolvers;