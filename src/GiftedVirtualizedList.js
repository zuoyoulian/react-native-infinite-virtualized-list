import React, { PropTypes } from 'react'
import InfiniteVirtualizedList from './InfiniteVirtualizedList'

export default class GiftedVirtualizedList extends React.Component {
  static propTypes = {
    onFetch: PropTypes.func.isRequired,
    rowView: PropTypes.func.isRequired,
    paginationWaitingView: PropTypes.func.isRequired,
    emptyView: PropTypes.func.isRequired,
    paginationAllLoadedView: PropTypes.func.isRequired,
    refreshable: PropTypes.bool.isRequired,
    enableEmptySections: PropTypes.bool.isRequired,
    pagination: PropTypes.bool.isRequired,
  }

  state = {
    list: [],
    page: 1,
    refreshing: false,
  }

  componentDidMount() {
    this.loadNextPage()
  }

  loadNextPage = () => {
    const { onFetch } = this.props
    this.setState({
      isNextPageLoading: true,
    })
    onFetch(this.state.page, (items, { allLoaded }) => {
      this.setState(({ list, page }) => ({
        isNextPageLoading: false,
        hasNextPage: !allLoaded,
        list: list.concat(Array.isArray(items) ? items : []),
        page: page + 1,
        refreshing: false,
      }))
    })
  }

  refresh = () => {
    this.setState({
      list: [],
      page: 1,
      refreshing: true,
    }, this.loadNextPage )
  }

  _refresh = () => {
    this.refresh()
  }

  removeItem = (row) => {
    this.setState(({list}, {removeRow = l => l}) => ({
      list: removeRow(list, row)
    }))
  }

  renderItem = ({ item }) => {
    return this.props.rowView(item)
  }

  render() {
    const { list, hasNextPage, isNextPageLoading, refreshing } = this.state
    const { emptyView, paginationWaitingView, headerView, refreshable, ...otherProps } = this.props

    if (list.length === 0) return emptyView()
    return (
      <InfiniteVirtualizedList
        data={list}
        hasNextPage={hasNextPage}
        isNextPageLoading={isNextPageLoading}
        loadNextPage={this.loadNextPage}
        renderItem={this.renderItem}
        paginationWaitingView={paginationWaitingView}
        getItem={(data, index) => list[index]}
        getItemCount={() => list.length}
        ListHeaderComponent={headerView}
        onRefresh={refreshable ? this.refresh : null}
        refreshing={refreshing}
        {...otherProps}
      />
    )
  }
}
