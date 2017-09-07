//
// app setup
export const PERFORM_SETUP = "PERFORM_SETUP";
export const SET_READY = "SET_READY";

//
// authentication
export const LOGIN = "LOGIN";
export const SIGNUP = "LOGOUT";
export const LOGOUT = "LOGOUT";
export const SET_JWT = "SET_JWT";

//
// currentUser
export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const CLEAR_CURRENT_USER = "CLEAR_CURRENT_USER";
export const REFRESH_CURRENT_USER = "REFRESH_CURRENT_USER";
export const UPDATE_CURRENT_USER = "UPDATE_CURRENT_USER";

//
// users
export const FETCH_USERS = "FETCH_USERS";
export const SET_USERS = "SET_USERS";

//
// teams
export const FETCH_TEAMS = "FETCH_TEAMS";
export const SET_TEAMS = "SET_TEAMS";
export const CLEAR_TEAMS = "CLEAR_TEAMS";
export const FETCH_TEAM = "FETCH_TEAM";
export const CREATE_TEAM = "CREATE_TEAM";
export const UPDATE_TEAM = "UPDATE_TEAM";
export const DELETE_TEAM = "DELETE_TEAM";
export const ADD_TEAM = "ADD_TEAM";
export const REMOVE_TEAM = "REMOVE_TEAM";

//
// team members / invites
export const INVITE_USER_TO_TEAM = "INVITE_USER_TO_TEAM";
export const INVITE_USER_BY_EMAIL = "INVITE_USER_BY_EMAIL";
export const REMOVE_FROM_TEAM = "REMOVE_FROM_TEAM";
export const REVOKE_INVITE = "REVOKE_INVITE";
export const ACCEPT_INVITE = "ACCEPT_INVITE";
export const REJECT_INVITE = "REJECT_INVITE";

//
// projects
export const FETCH_PROJECTS = "FETCH_PROJECTS";
export const SET_PROJECTS = "SET_PROJECTS";
export const CLEAR_PROJECTS = "CLEAR_PROJECTS";
export const CREATE_PROJECT = "CREATE_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const FETCH_PROJECT = "FETCH_PROJECT";
export const ADD_PROJECT = "ADD_PROJECT";
export const REMOVE_PROJECT = "REMOVE_PROJECT";

//
// notifications
export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const CLEAR_NOTIFICATIONS = "CLEAR_NOTIFICATIONS";

//
// flows
export const ADD_FLOW = "ADD_FLOW";
export const REMOVE_FLOW = "REMOVE_FLOW";
export const FLOW_NEXT_STEP = "FLOW_NEXT_STEP";
export const FLOW_PREV_STEP = "FLOW_PREV_STEP";
export const FLOW_START = "FLOW_START";
export const FLOW_END = "FLOW_END";

//
// workshops
export const FETCH_WORKSHOPS = "FETCH_WORKSHOPS";
export const SET_WORKSHOPS = "SET_WORKSHOPS";
export const JOIN_WORKSHOP = "JOIN_WORKSHOP";
export const LEAVE_WORKSHOP = "LEAVE_WORKSHOP";
export const CREATE_WORKSHOP = "CREATE_WORKSHOP"; // admin action only
export const UPDATE_WORKSHOP = "UPDATE_WORKSHOP"; // admin action only
export const DELETE_WORKSHOP = "DELETE_WORKSHOP"; // admin action only

//
// Admin
export const FETCH_USERS_ADMIN = "FETCH_USERS_ADMIN";
export const SET_USERS_ADMIN = "SET_USERS_ADMIN";
export const DELETE_USER_ADMIN = "DELETE_USER_ADMIN";
export const SET_USER_ROLE_ADMIN = "SET_USER_ROLE_ADMIN";
export const SET_USER_CHECKED_IN_ADMIN = "SET_USER_CHECKED_IN_ADMIN";

export const FETCH_STATS_ADMIN = "FETCH_STATS_ADMIN";
export const SET_STATS_ADMIN = "SET_STATS_ADMIN";
