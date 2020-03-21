import gql from 'graphql-tag';

export const GET_FEED_QUERY = gql`
  query getFeed($first: Int!, $after: String) {
    getFeed(first: $first, after: $after) {
      posts {
        id
      }
      count
    }
  }
`;
