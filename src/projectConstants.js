const projectConstants = {
  GENERIC_ERROR : '50',
  USER_NOT_PRESENT : '51',
  INCORRECT_PASSWORD : '52',
  USER_ALREADY_PRESENT : '53',
  NO_PURCHASED_WIDGETS : '54',
  CART_EMPTY  : '55',
  SESSION_EXPIRED  : '56',
  SEARCH_NOT_FOUND  : '57',



  // response types
  SUCCESS  : '111'
}


export default projectConstants;

export type ServerResponse = {
  message : string,
  data : any
}
