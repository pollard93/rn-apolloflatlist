import gql from 'graphql-tag';

export const GET_FEED_QUERY = gql`
  query getFeed($search: String, $first: Int!, $after: String) {
    getFeed(search: $search, first: $first, after: $after) {
      posts {
        id
      }
      count
    }
  }
`;
