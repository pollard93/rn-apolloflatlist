/* eslint-disable max-len */
import React, { Component } from 'react';
import { FlatList, RefreshControl, FlatListProps } from 'react-native';
import ApolloClient, { SubscribeToMoreOptions } from 'apollo-client';
import { Query, QueryResult } from 'react-apollo';
import deepEqual from 'deep-equal';

export interface ApolloFlatListProps<Variables, Payload, Item, SubVariables = null, SubPayload = null> {
  query: any; // gql cursor based query
  variables: Variables; // Variables of that query
  context?: any; // Context for request
  accessor: string; // For accessing the data object returned from query (e.g getFeed.posts)
  renderItem: FlatListProps<Item>['renderItem']; // Render item function
  LoadingErrorComponent: (queryResult: QueryResult<Payload, Variables>) => any; // Footer component with boolean whether there is more to load or not, useful for rendering activity or message when no more
  ListFooterComponent?: (moreToLoad: boolean) => any; // Footer component with boolean whether there is more to load or not, useful for rendering activity or message when no more
  ListHeaderComponent?: (moreToLoad: boolean) => any; // Footer component with boolean whether there is more to load or not, useful for rendering activity or message when no more
  FlatListProps?: FlatListProps<any>; // Extra props to override
  subscriptionOptions?: SubscribeToMoreOptions<Payload, SubVariables, SubPayload>; // Subscription props, see SubscribeToMoreOptions. If this is passed the subscription will connext and disconnect appropriately
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
      >
        {(args) => {
          const { data, error, loading, client, fetchMore, subscribeToMore, refetch } = args;
          if ((loading && !this.state.refreshing) || error) return this.props.LoadingErrorComponent(args);

          /* eslint-disable dot-notation, prefer-destructuring */
          // Get the payload and data from response
          const payload = data[this.payloadAccessor];
          const items: any[] = payload[this.itemAccessor];
          const count: number = payload.count;
          /* eslint-enable dot-notation, prefer-destructuring */

          // Set vars
          this.client = client;
          this.fetchMore = fetchMore;
          this.refetch = refetch;
          this.currentCount = items.length;
          this.maxCount = count;
          this.lastId = items.length && items[items.length - 1].id;
          const moreToLoad = this.currentCount < this.maxCount;

          // Subscribe on first render and set in class for use in componentDidUpdate
          if (this.props.subscriptionOptions && !this.subscribeToMore) {
            this.subscribeToMore = subscribeToMore;
            this.unSubscribe = this.subscribeToMore(this.props.subscriptionOptions);
          }

          return (
            <FlatList
              {...this.props.FlatListProps}
              data={items}
              onEndReachedThreshold={0.1}
              onEndReached={this.onEndReached}
              ListFooterComponent={() => this.props.ListFooterComponent && this.props.ListFooterComponent(moreToLoad)}
              ListHeaderComponent={() => this.props.ListHeaderComponent && this.props.ListHeaderComponent(moreToLoad)}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          );
        }}
      </Query>
    );
  }
}

export default ApolloFlatList;
