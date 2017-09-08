import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import { noop, clone, filter, isEmpty, has, reduce, orderBy, get } from "lodash";
import classnames from "classnames";

//
// assets
import searchImg from "assets/images/search.svg";

export class DataTable extends Component {

  state = {
    sortKey: null,
    sortDir: null,
    searchVisible: false,
    query: null,
    filters: {},
  }

  //----------------------------------------------------------------------------
  // Callbacks
  //----------------------------------------------------------------------------

  // sorting
  setSort = (newSortKey, newSortDir) => {
    const { sortKey, sortDir } = this.state;

    if (sortKey === newSortKey && sortDir === newSortDir) {
      this.setState({ sortKey: null, sortDir: null });
    } else {
      this.setState({ sortKey: newSortKey, sortDir: newSortDir });
    }
  }

  // filtering
  toggleFilter = (attribute, value) => {
    const { filters } = this.state;

    // filter is already set, remove it
    if (has(filters, attribute) && filters[attribute] === value) {
      delete filters[attribute];
    // set filter to whatever value we want
    } else {
      filters[attribute] = value;
    }

    this.setState({ filters });
  }

  // search
  toggleSearch = () => {
    const { searchVisible } = this.state;

    this.setState({ searchVisible: !searchVisible }, () => {
      this.state.searchVisible
      ? this.searchInput.focus()
      : this.searchInput.blur();
    });
  }

  handleSearchChange = (ev) => {
    this.setState({ query: ev.target.value });
    this.forceUpdate();
  }

  handleSearchKeyDown = (ev) => {
    switch (ev.key) {
      case "Escape":
        this.setState({ query: null, searchVisible: false });
        break;

      case "Enter":
        this.setState({ searchVisible: false });
        break;

      default:
        break;
    }
  }

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------
  get filteredItems() {
    const { source, search } = this.props;
    const { query, filters } = this.state;

    if (isEmpty(search)) return clone(source);

    const regexp = new RegExp(query || ".", "i");
    return filter(source, item => {
      const searchString = reduce(search, (str, prop) => `${str}|${get(item, prop)}`, "");
      const isMatch      = regexp.test(searchString);

      const isVisible = isEmpty(filters) || reduce(
        filters,
        (result, val, attr) => result || item[attr] === val,
        false,
      );

      return isMatch && isVisible;
    });

  }

  get sortedItems() {
    const { sortKey, sortDir } = this.state;

    if (!sortKey) return this.filteredItems;

    return orderBy(this.filteredItems, [ sortKey ], [ sortDir ]);
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { labels, mobile, sorter, filter, render } = this.props;
    const { sortKey, sortDir, query, searchVisible, filters } = this.state;

    const searchBarCx = classnames("search-bar", {
      visible: searchVisible,
    });

    return (
      <div className="DataTable">
        <div className="search"><img src={searchImg} onClick={this.toggleSearch} /></div>
        <div className={searchBarCx}>
          <input
            ref={input => (this.searchInput = input)}
            type="text"
            value={query || ""}
            placeholder="Search table..."
            onChange={this.handleSearchChange}
            onKeyDown={this.handleSearchKeyDown}
          />
        </div>
        <table>
          <thead>
            <tr>
              {labels.map((label, i) => {
                const s = sorter[i];
                const f = filter[i];
                const m = mobile[i];

                // if this.props.mobile is an empty array, show all columns, regardless of device
                const cx = classnames({
                  desktop: m === undefined || m === false,
                  mobile:  m === undefined || m === true,
                });

                return (
                  <td key={i} className={cx}>
                    {label}

                    { /* sort controls */ }
                    {s && (
                      <span className="sort-controls">
                        <button
                          onClick={() => this.setSort(s, "asc")}
                          className={classnames({ selected: s === sortKey && "asc" === sortDir })}
                        >
                          ⬆
                        </button>
                        <button
                          onClick={() => this.setSort(s, "desc")}
                          className={classnames({ selected: s === sortKey && "desc" === sortDir })}
                        >
                          ⬇
                        </button>
                      </span>
                    )}

                    { /* visibility controls */ }
                    {f && (
                      <span className="filter-controls">
                        <button
                          onClick={() => this.toggleFilter(f, true)}
                          className={classnames({ selected: filters[f] === true })}
                        >
                          ✔
                        </button>
                        <button
                          onClick={() => this.toggleFilter(f, false)}
                          className={classnames({ selected: filters[f] === false })}
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {this.sortedItems.map(render)}
          </tbody>
        </table>
      </div>
    );
  }

}

export default compose(
  setDisplayName("DataTable"),

  setPropTypes({
    source: PropTypes.arrayOf(PropTypes.object).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    search: PropTypes.arrayOf(PropTypes.string).isRequired,
    sorter: PropTypes.arrayOf(PropTypes.string).isRequired,
    filter: PropTypes.arrayOf(PropTypes.string).isRequired,
    mobile: PropTypes.arrayOf(PropTypes.bool).isRequired,
    render: PropTypes.func.isRequired,
  }),

  defaultProps({
    source: [],
    search: [],
    labels: [],
    sorter: [],
    filter: [],
    mobile: [],
    render: noop,
  }),
)(DataTable);
