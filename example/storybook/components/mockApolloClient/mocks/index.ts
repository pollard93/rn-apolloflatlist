/* eslint-disable max-len */
// Reference
// https://www.apollographql.com/docs/graphql-tools/mocking.html

import { getFeed } from './resolvers/getFeed';

export default {
  Query: () => ({
    getFeed,
  }),
  DateTime: () => new Date(0).toISOString(),
};
