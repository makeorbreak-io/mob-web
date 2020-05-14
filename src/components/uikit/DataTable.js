import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import { noop, clone, filter, isEmpty, has, reduce, orderBy, get, every } from "lodash";
import classnames from "classnames";

import store from "store";
import { submit } from "redux-form";

// import { Btn } from "components/uikit";
import ResourceEditor from "components/admin/ResourceEditor";

export class DataTable extends Component {

  state = {
    sort: this.props.sorter.reduce((all, key) => {
      if (key) return { ...all, [key]: this.props.defaultSort };
      else return all;
    }, {}),
    searchVisible: false,
    query: null,
    filterExp: null,
    filters: {},
    selected: [],
    editing: [],
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source.length !== this.props.source.length) {
      this.setState({
        selected: this.state.selected.filter(i => nextProps.source.map(i => i.id).includes(i.id)),
      });
    }
  }

  //----------------------------------------------------------------------------
  // Callbacks
  //----------------------------------------------------------------------------

  // sorting
  setSort = (key, dir) => {
    const { sort } = this.state;

    this.setState({ sort: { ...sort, [key]: dir } });
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

  handleSearchChange = (ev) => {
    this.setState({ query: ev.target.value });
  }

  handleFilterExpChange = (ev) => {
    this.setState({ filterExp: ev.target.value });
  }

  handleSearchKeyDown = (ev) => {
    switch (ev.key) {
      case "Escape":
        this.setState({ query: null });
        break;

      default:
        break;
    }
  }

  toggleList = (list, item) => {
    const items = this.state[list];

    if (items.includes(item))
      this.setState({ [list]: items.filter(i => i !== item) });
    else
      this.setState({ [list]: [ ...items, item ] });
  }

  toggleAllVisible = () => {
    const items = this.sortedItems;
    const { selected } = this.state;

    const allVisibleSelected = every(items, i => selected.includes(i.id));
    const allVisibleUnselected = every(items, i => !selected.includes(i.id));

    if (allVisibleSelected)
      this.setState({ selected: [] });
    if (allVisibleUnselected || (!allVisibleUnselected && !allVisibleSelected))
      this.setState({ selected: this.sortedItems.map(i => i.id) });
  }

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------
  get filteredItems() {
    const { source, search } = this.props;
    const { query, filterExp, filters } = this.state;

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
    })
    .filter((item, i) => {
      try {
        const cb = eval(filterExp);
        return cb(item, i);
      } catch(e) {
        return true;
      }
    });

  }

  get sortedItems() {
    const keys = Object.keys(this.state.sort);
    const values = Object.values(this.state.sort);

    return orderBy(this.filteredItems, keys, values);
  }

  selectCell = (item) => {
    const selected = this.state.selected.includes(item.id);
    const editing = this.state.editing.includes(item.id);

    if (editing) return (<td className="select" />);

    return (
      <td className="select">
        <span
          onClick={() => this.toggleList("selected", item.id)}
          className={classnames("bg-icon", {
            "bg-icon--check-box-empty": !selected,
            "bg-icon--check-box": selected,
          })}
        />
      </td>
    );
  }

  editCell = (item) => {
    const editing = this.state.editing.includes(item.id);

    return (
      <td className="edit">
        <span
          onClick={() => this.toggleList("editing", item.id)}
          className={classnames("bg-icon", {
            "bg-icon--edit": !editing,
            "bg-icon--cancel": editing,
          })}
        />
      </td>
    );
  }


  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const {
      labels,
      mobile: _mobile,
      sorter,
      filter,
      headcx,
      render,
      actions,
      source,
      sourceFields,
      validate,
      onUpdateSubmit,
      editable,
      fixed,
    } = this.props;

    const { sort, query, filterExp, filters, selected, editing } = this.state;

    const items = this.sortedItems;

    const allVisibleSelected = every(items, i => selected.includes(i.id));
    const allVisibleUnselected = every(items, i => !selected.includes(i.id));

    return (
      <div className={classnames("data-table", { "data-table--fixed": fixed })}>
        <div className="data-table--tools">
          <div className="data-table--actions">
            {selected.length === 0 && <span>No items selected</span>}
            {selected.length > 0 && actions(source.filter(s => selected.includes(s.id)))}
          </div>

          <div className="data-table--search">
            <input
              ref={input => (this.searchInput = input)}
              type="text"
              value={query || ""}
              placeholder="Search..."
              onChange={this.handleSearchChange}
              onKeyDown={this.handleSearchKeyDown}
            />
          </div>

          {filter &&
          <div className="data-table--filter-exp">
            <input
              type="text"
              value={filterExp || ""}
              placeholder={"(item, index) => true"}
              onChange={this.handleFilterExpChange}
            />
          </div>
          }
        </div>

        <table>
          <thead>
            <tr>
              <th className="select">
                <span
                  onClick={this.toggleAllVisible}
                  className={classnames("bg-icon", {
                    "bg-icon--check-box-indeterminate": !allVisibleUnselected && !allVisibleSelected,
                    "bg-icon--check-box-empty": allVisibleUnselected,
                    "bg-icon--check-box": allVisibleSelected,
                  })}
                />
              </th>

              {labels.map((label, i) => {
                const s = sorter[i];
                const f = filter[i];
                // const m = mobile[i];

                // if this.props.mobile is an empty array, show all columns, regardless of device
                const cx = classnames(headcx[i], {
                  // desktop: m === undefined || m === false,
                  // mobile:  m === undefined || m === true,
                });

                return (
                  <th key={i} className={cx}>
                    { /* sort controls */ }
                    {s && (
                      <span
                        onClick={() => this.setSort(s, sort[s] === "asc" ? "desc" : "asc")}
                        className={classnames("data-table--control--sort", {
                          "bg-icon bg-icon--small bg-icon--arrow-upward":   sort[s] === "asc",
                          "bg-icon bg-icon--small bg-icon--arrow-downward": sort[s] === "desc",
                        })}
                      >
                        {label}
                      </span>
                    )}

                    {!s && <span>{label}</span>}

                    { /* visibility controls */ }
                    {f && (
                      <span
                        onClick={() => this.toggleFilter(f, !filters[f])}
                        className="data-table--control--filter bg-icon bg-icon--filter-list"
                      />
                    )}
                  </th>
                );
              })}

              {editable && <th className="edit" />}
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              if (editing.includes(item.id))
                return (
                  <tr key={item.id}>
                    {this.selectCell(item)}
                    <ResourceEditor
                      initialValues={sourceFields.reduce((all, f) => ({ ...all, [f.name]: item[f.name] }), {})}
                      fields={sourceFields}
                      form={`resource-editor-${item.id}`}
                      onSubmit={values => { onUpdateSubmit(item, values); this.toggleList("editing", item.id); }}
                      validate={validate}
                    />
                    <td className="edit">
                      <span className="bg-icon bg-icon--save" onClick={() => store.dispatch(submit(`resource-editor-${item.id}`))} />
                      <span className="bg-icon bg-icon--cancel" onClick={() => this.toggleList("editing", item.id)} />
                    </td>
                  </tr>
                );
              else
                return render(item, this.selectCell(item), this.editCell(item));
            })}
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
    headcx: PropTypes.arrayOf(PropTypes.string).isRequired,
    mobile: PropTypes.arrayOf(PropTypes.bool).isRequired,
    render: PropTypes.func.isRequired,
    actions: PropTypes.func.isRequired,
    validate: PropTypes.func,
    defaultSort: PropTypes.oneOf([ "asc", "desc" ]).isRequired,
    filter: PropTypes.bool.isRequired,
    fixed: PropTypes.bool.isRequired,
    editable: PropTypes.bool.isRequired,
    sourceFields: PropTypes.array.isRequired,
    onUpdateSubmit: PropTypes.func.isRequired,
  }),

  defaultProps({
    source: [],
    search: [],
    labels: [],
    sorter: [],
    headcx: [],
    mobile: [],
    render: noop,
    actions: noop,
    validate: noop,
    defaultSort: "asc",
    filter: false,
    fixed: false,
    editable: false,
    sourceFields: [],
    onUpdateSubmit: noop,
  }),
)(DataTable);
