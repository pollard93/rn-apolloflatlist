/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getFeed
// ====================================================

export interface getFeed_getFeed_posts {
  __typename: "Post";
  id: string | null;
}

export interface getFeed_getFeed {
  __typename: "PostsPayload";
  posts: getFeed_getFeed_posts[];
  count: number | null;
}

export interface getFeed {
  getFeed: getFeed_getFeed | null;
}

export interface getFeedVariables {
  search?: string;
  first: number;
  after?: string | null;
}
