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

