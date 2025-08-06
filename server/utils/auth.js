const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

// Set token secret and expiration date
const secret = 'verySecret';
const expiration = '2h';

module.exports = {
    AuthenticationError: new GraphQLError('Could not authenticate the user.', {
        extensions: {
            code: 'UNAUTHENTICATED',
        },
    }),
    // Function for our authenticated routes
    authMiddleware: function ({ req }) {
        // Allows tooken to be sent via req.query or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // Split the value of the token from the "Bearer" text next to it
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req;
        }

        // Verify the token and get users data from it
        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            console.log("DATA", data);
            req.user = data;
        } catch {
            console.log('Invalid Token');
        }

        return req;
    },
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};
