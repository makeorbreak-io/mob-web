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
// notifications
export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const CLEAR_NOTIFICATIONS = "CLEAR_NOTIFICATIONS";

//
// toasts
export const ADD_TOAST = "ADD_TOAST";
export const REMOVE_TOAST = "REMOVE_TOAST";
export const CLEAR_TOASTS = "CLEAR_TOASTS";

//
// flows
export const ADD_FLOW = "ADD_FLOW";
export const REMOVE_FLOW = "REMOVE_FLOW";
export const FLOW_NEXT_STEP = "FLOW_NEXT_STEP";
export const FLOW_PREV_STEP = "FLOW_PREV_STEP";
export const FLOW_SET_STEPS = "FLOW_SET_STEPS";
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
// voting
export const FETCH_VOTING_INFO_BEGIN = "FETCH_VOTING_INFO_BEGIN";
export const SET_VOTING_INFO_BEGIN = "SET_VOTING_INFO_BEGIN";
export const FETCH_VOTING_INFO_END = "FETCH_VOTING_INFO_END";
export const SET_VOTING_INFO_END = "SET_VOTING_INFO_END";

//
// Admin
export const FETCH_USERS_ADMIN = "FETCH_USERS_ADMIN";
export const SET_USERS_ADMIN = "SET_USERS_ADMIN";
export const DELETE_USER_ADMIN = "DELETE_USER_ADMIN";
export const SET_USER_ROLE_ADMIN = "SET_USER_ROLE_ADMIN";
export const SET_USER_CHECKED_IN_ADMIN = "SET_USER_CHECKED_IN_ADMIN";

export const FETCH_STATS_ADMIN = "FETCH_STATS_ADMIN";
export const SET_STATS_ADMIN = "SET_STATS_ADMIN";

export const FETCH_VOTING_STATUS = "FETCH_VOTING_STATUS";
export const SET_VOTING_STATUS = "SET_VOTING_STATUS";

//
// Landing page
export const FETCH_MEDIUM_POSTS = "FETCH_MEDIUM_POSTS";
export const SET_MEDIUM_POSTS = "SET_MEDIUM_POSTS";
