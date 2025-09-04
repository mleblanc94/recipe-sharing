// server/schemas/resolvers.js
const { User, Recipe, RecipeType } = require('../models');
const { AuthenticationError } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const secret = 'verySecret';
const expiration = '2h';

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
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
    // expects args: { input: { title, description, ingredients (String), instructions (String), recipeType, imageName } }
    createRecipe: async (_, { input }, context) => {
      try {
        // require auth and stamp creator from token
        if (!context.user?._id) {
          throw new AuthenticationError('You need to be logged in');
        }

        const title = (input?.title || '').trim();
        const description = (input?.description || '').trim();
        const ingredients = String(input?.ingredients ?? '').trim();   // <-- keep as String
        const instructions = String(input?.instructions ?? '').trim(); // <-- keep as String

        if (!title) throw new Error('Title is required');
        if (!ingredients) throw new Error('At least one ingredient is required');
        if (!instructions) throw new Error('At least one instruction is required');
        if (!input?.recipeType) throw new Error('Recipe type is required');

        const doc = await Recipe.create({
          title,
          description,
          ingredients,   // String
          instructions,  // String
          recipeType: input.recipeType, // Mongoose will cast string _id to ObjectId
          imageName: input.imageName,
          creator: context.user._id,    // authoritative creator from JWT
        });

        return doc;
      } catch (error) {
        // this will show up in `heroku logs --tail`
        console.error('createRecipe failed:', {
          message: error.message,
          name: error.name,
          code: error.code,
          errors: error.errors,
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

    voteOnRecipe: async (_, { recipeId, value }, context) => {
  if (!context.user?._id) {
    throw new AuthenticationError('You need to be logged in');
  }
  if (![1, -1, 0].includes(value)) {
    throw new Error('value must be 1, -1, or 0');
  }

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const uid = context.user._id.toString();
  const idx = (recipe.voters || []).findIndex(v => v.user.toString() === uid);
  const current = idx >= 0 ? recipe.voters[idx].value : 0;

  // toggle: clicking same value turns it off (0)
  const next = (value === current) ? 0 : value;

  if (idx >= 0) {
    if (next === 0) {
      recipe.voters.splice(idx, 1);
    } else {
      recipe.voters[idx].value = next;
    }
  } else if (next !== 0) {
    recipe.voters.push({ user: uid, value: next });
  }

  await recipe.save();
  return recipe; // field resolvers below will compute votes & myVote
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
  // existing
  interestedIn: async (parent) => {
    const ids = parent.interestedIn || [];
    return await User.find({ _id: { $in: ids } });
  },

  // NEW: never returns null
  votes(parent) {
    const voters = parent.voters || [];
    let up = 0, down = 0;
    for (const v of voters) {
      if (v.value === 1) up += 1;
      else if (v.value === -1) down += 1;
    }
    return { up, down, score: up - down };
  },

  // NEW: never returns null (returns 0 if not logged in or no vote)
  myVote(parent, _args, context) {
    const uid = context.user?._id?.toString();
    if (!uid) return 0;
    const entry = (parent.voters || []).find(v => v.user?.toString?.() === uid);
    return entry ? entry.value : 0;
  },
},
}

module.exports = resolvers;
