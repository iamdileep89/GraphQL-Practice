import { join } from 'path';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { graphqlUploadExpress } from 'graphql-upload';
import { success, error } from 'consola';
import { PORT , IN_PROD, DB} from './config';
import { typeDefs, resolvers } from './graphql';
import * as AppModels from './models';
import AuthMiddleware from './middlewares/auth'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { isAuthDirectiveTransformer } from "./graphql/directives";


//Initialize Express app
const app = express();
app.use(AuthMiddleware);
app.use(bodyParser.json());
app.use(express.static(join(__dirname, "./uploads")));


// Create the base executable schema
let schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

// Transform the schema by applying directive logic
schema = isAuthDirectiveTransformer(schema, 'isAuth');

const server = new ApolloServer({
    schema,
    context: ({req}) => {
        let { isAuth, user } = req;
        return {
            req, 
            isAuth,
            user,
            ...AppModels
        }
    },
    plugins: [
        IN_PROD 
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground()
    ]
});

const startApp = async () => {
    try {
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        success({
            badge: true,
            message: `Successfully connected with the DataBase: ${DB}`
        });
        // must call await server.start() before server.applyMiddleware
        await server.start();
        // This middleware should be added before calling `applyMiddleware`.
        app.use(graphqlUploadExpress());
        // Inject Apollo server middleware on express app
        server.applyMiddleware({
            app,
            path: '/v1/ingenio/graphql',
            __internal_healthCheckPath: '/v1/ingenio/graphql/ping'
        });
       
        //App listen on given port
        app.listen(PORT, () => success({
            badge: true,
            message: `Server ready at http://localhost:4000${server.graphqlPath}`
        }));
    } catch (err) {
        error({
            badge: true,
            message: err.message
        });
    };
    
    
};

// Invoke Start Application Function
startApp();