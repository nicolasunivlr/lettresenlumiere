const BASE_ROUTE = process.env.NODE_ENV === 'production'
    ? '/lettresenlumiere'
    : '';
export default BASE_ROUTE;
