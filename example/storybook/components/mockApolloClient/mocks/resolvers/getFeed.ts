/* eslint-disable import/prefer-default-export */
/* eslint-disable prefer-spread */
export const getFeed = (_, variables) => ({
  posts: () => Array.apply(null, Array(variables.first)).map(() => ({})),
  count: () => 50,
});
