/* eslint-disable max-len */
import React, { Component, FC } from 'react';
import { FlatList, RefreshControl, FlatListProps } from 'react-native';
import ApolloClient, { SubscribeToMoreOptions, WatchQueryFetchPolicy } from 'apollo-client';
import { Query, QueryResult } from 'react-apollo';
import deepEqual from 'deep-equal';

export interface QueryResultProps<Payload, Variables> {
  queryResult: QueryResult<Payload, Variables>,
  moreToLoad: boolean;
  maxCount: number;
  currentCount: number;
}

export interface ApolloFlatListProps<Variables, Payload, Item, SubVariables = null, SubPayload = null> {
  query: any; // gql cursor based query
  variables: Variables; // Variables of that query
  context?: any; // Context for request
  fetchPolicy?: WatchQueryFetchPolicy;
  accessor: string; // For accessing the data object returned from query (e.g getFeed.posts)
  renderItem: FlatListProps<Item>['renderItem']; // Render item function
  ListEmptyComponent?: FC<QueryResultProps<Payload, Variables>>;
  ListFooterComponent?: FC<QueryResultProps<Payload, Variables>>;
  ListHeaderComponent?: FC<QueryResultProps<Payload, Variables>>;
  children?: FC<QueryResultProps<Payload, Variables>>; // Rendered after flatlist, so can positioned to cover
  FlatListProps?: Partial<FlatListProps<any>>; // Extra props to override
  subscriptionOptions?: SubscribeToMoreOptions<Payload, SubVariables, SubPayload>; // Subscription props, see SubscribeToMoreOptions. If this is passed the subscription will connext and disconnect appropriately
  debug?: boolean; // Console logs the request response
  disableRefresh?: boolean;
  disablePagination?: boolean;
}

export interface ApolloFlatListState<Variables> {
  loadingMore: boolean;
  refreshing: boolean;
  loading: boolean;
  variables: Variables;
}

/**
 * Flatlist that works off cursor based pagination, please see the example-query folder for example query and subscription
 *
 * TYPES
 *  Variables -> Variables of query
 *  Payload -> Payload of the data object
 *  Item -> The single item you are working with, will be passed through to renderItem
 *  SubVariables -> Variables of the subscription if passed
 *  SubPayload -> Payload of the subscription if passed
 */
class ApolloFlatList<Variables, Payload, Item, SubVariables = null, SubPayload = null> extends Component<ApolloFlatListProps<Variables, Payload, Item, SubVariables, SubPayload>, ApolloFlatListState<Variables>> {
  private client: ApolloClient<any>;

  private lastId: string;

  private currentCount: number;

  private maxCount: number;

  private fetchMore: any;

  private subscribeToMore: any;

  private refetch: any;

  private unSubscribe: any;

  public payloadAccessor: string;

  public itemAccessor: string;

  constructor(props: ApolloFlatListProps<Variables, Payload, Item>) {
    super(props);

    // Variables are passed to the state, as this will handle the cursor (after)
    this.state = {
      loadingMore: false,
      refreshing: false,
      loading: false,
      variables: {
        ...props.variables,
        after: null,
      },
    };

    // Set accessors
    const [payloadAccessor, itemAccessor] = this.props.accessor.split('.');
    this.payloadAccessor = payloadAccessor;
    this.itemAccessor = itemAccessor;
  }


  /**
   * To test variables are equal, append after:null on both
   */
  static deepEqual(a, b) {
    return deepEqual(
      { ...a, after: null },
      { ...b, after: null },
    );
  }


  /**
   * Merge props.variables into state.variables
   */
  static getDerivedStateFromProps(props: ApolloFlatListProps<any, any, any>, state: ApolloFlatListState<any>): ApolloFlatListState<any> {
    return {
      ...state,
      variables: {
        ...state.variables,
        ...props.variables,
      },
    };
  }


  shouldComponentUpdate(nextProps: ApolloFlatListProps<any, any, any>, nextState: ApolloFlatListState<any>) {
    /**
     * Should update if the nextProps.variables are different from state.variables
     */
    if (!ApolloFlatList.deepEqual(nextProps.variables, this.state.variables)) {
      /**
       * If subscribeToMore is set then unsubscribe and subscribe
       */
      if (this.subscribeToMore) {
        this.tryUnsubscribe();
        this.unSubscribe = this.subscribeToMore(this.props.subscriptionOptions);
      }

      return true;
    }

    /**
     * Otherwise, update if the freshing state changes
     */
    return nextState.refreshing !== this.state.refreshing;
  }


  componentWillUnmount() {
    this.tryUnsubscribe();
  }


  onEndReached = () => {
    // If loading more or have got all that we can
    if (
      this.state.refreshing
      || this.state.loadingMore
      || this.currentCount >= this.maxCount
    ) return;

    this.setState({
      loadingMore: true,
    }, () => {
      // Fetch more with the last posts id (after) as the cursor
      this.fetchMore({
        variables: {
          ...this.state.variables,
          after: this.lastId,
        },
        context: this.props.context,
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            ...prev,
            [this.payloadAccessor]: {
              ...prev[this.payloadAccessor],
              [this.itemAccessor]: [...prev[this.payloadAccessor][this.itemAccessor], ...fetchMoreResult[this.payloadAccessor][this.itemAccessor]],
            },
          };
        },
      })
        .then(() => {
          this.setState({
            loadingMore: false,
          });
        });
    });
  };


  tryUnsubscribe = () => {
    if (this.unSubscribe) {
      this.unSubscribe();
      this.unSubscribe = null;
    }
  }


  onRefresh = () => {
    this.setState({
      refreshing: true,
    }, async () => {
      try {
        await this.refetch(this.state.variables);
      } catch (e) {} // eslint-disable-line no-empty

      this.setState({
        refreshing: false,
      });
    });
  }


  render() {
    const { query, context, renderItem } = this.props;
    return (
      <Query
        query={query}
        context={context}
        variables={this.state.variables}
        fetchPolicy={this.props.fetchPolicy}
      >
        {(args) => {
          if (this.props.debug) {
            // eslint-disable-next-line no-console
            console.log(args);
          }

          const { data, client, fetchMore, subscribeToMore, refetch } = args;

          /* eslint-disable dot-notation, prefer-destructuring */
          // Get the payload and data from response
          const payload = data && data[this.payloadAccessor];
          const items: any[] = payload ? payload[this.itemAccessor] : [];
          const count: number = payload ? payload.count : null;
          /* eslint-enable dot-notation, prefer-destructuring */

          // Set vars
          this.client = client;
          this.fetchMore = fetchMore;
          this.refetch = refetch;
          this.currentCount = items.length;
          this.maxCount = count;
          this.lastId = items.length && items[items.length - 1].id;

          // Subscribe on first render and set in class for use in componentDidUpdate
          if (this.props.subscriptionOptions && !this.subscribeToMore) {
            this.subscribeToMore = subscribeToMore;
            this.unSubscribe = this.subscribeToMore(this.props.subscriptionOptions);
          }

          const queryResultProps: QueryResultProps<Payload, Variables> = {
            queryResult: args,
            moreToLoad: this.currentCount < this.maxCount,
            maxCount: this.maxCount,
            currentCount: this.currentCount,
          };

          return (
            <>
              <FlatList
                data={items}
                onEndReachedThreshold={!this.props.disablePagination && 0.2}
                onEndReached={!this.props.disablePagination && this.onEndReached}
                ListEmptyComponent={this.props.ListEmptyComponent && this.props.ListEmptyComponent(queryResultProps)}
                ListHeaderComponent={this.props.ListHeaderComponent && this.props.ListHeaderComponent(queryResultProps)}
                ListFooterComponent={this.props.ListFooterComponent && this.props.ListFooterComponent(queryResultProps)}
                refreshControl={
                  !this.props.disableRefresh
                    ? (
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                      />
                    )
                    : undefined
                }
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                {...this.props.FlatListProps}
              />

              {this.props.children && this.props.children(queryResultProps)}
            </>
          );
        }}
      </Query>
    );
  }
}

export default ApolloFlatList;
