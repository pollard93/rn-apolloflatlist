/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const FEED_SUBSCRIPTION = gql`
  subscription feedSub($tenantId: String!){
    feed(tenantId: $tenantId){
      mutation
      updatedFields
      node {
        id
      }
    }
  },
`;
