import { ApolloError } from "apollo-server-errors";
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';


// This function takes in a schema and adds auth logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `isAuth`)
export const isAuthDirectiveTransformer = (schema, directiveName) => {
  return mapSchema(schema, {
      // Executes once for each object field in the schema
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        // Check whether this field has the specified directive
        const authDirective = getDirective(schema, fieldConfig, directiveName) ? getDirective(schema, fieldConfig, directiveName)[0] : null;
        if (authDirective) {
          // Get this field's original resolver
          const { resolve = defaultFieldResolver } = fieldConfig;
          // Replace the original resolver with a function that checks whether request is authenticated or not
          // then calls the actual resolver function
          fieldConfig.resolve = async function (source, args, context, info) {
            let { isAuth } = context;
            if(isAuth){
                const result = resolve.apply(this, [source, args, context, info]);
                return result;
            } else {
                throw new ApolloError("You must be authenticated to get this information!")
            };
          };
        return fieldConfig;
      }
    }
  });
};
