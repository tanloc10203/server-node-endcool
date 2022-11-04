export const introServer = {
  SERVER_NAME: 'SERVER API OF END COOL',
  COPY_RIGHT: 'BY END COOL',
  EMAIL_CONTACT: 'ginga550504@gmail.com',
  SERVER_MESSAGE: 'SERVER ON RUNNING',
  SERVER_HOST: process.env.DOMAIN + 'api',
  GENERAL_RESPONSE_SERVER: {
    error: 'boolean',
    data: 'any',
    message: 'string',
  },
  '[SERVER_API]': {
    '[API: 1]': {
      ROUTE: '/auth',
      ROUTE_CHILDREN: [
        {
          ROUTE: '/register',
          METHOD: 'POST',
          REQUEST: {
            body: {
              firstName: 'string',
              lastName: 'string',
              username: 'string',
              password: 'string',
              email: 'string',
              gender: `enum('male', 'female')`,
              key: `enum('ADMIN', 'STAFF', 'MEMBER')`,
            },
          },
        },
        {
          ROUTE: '/login',
          METHOD: 'POST',
          REQUEST: {
            body: {
              username: 'string',
              password: 'string',
            },
          },
          RESPONSE: {
            assetToken: 'string',
            refreshToken: 'string',
          },
        },
        {
          ROUTE: '/refresh',
          METHOD: 'GET',
          REQUEST: {
            headers: `Bearer {assetToken}`,
            cookies: '{refreshToken}',
          },
          RESPONSE: {
            assetToken: 'string',
          },
        },
        {
          ROUTE: '/logout',
          METHOD: 'POST',
          REQUEST: {
            headers: `Bearer {assetToken}`,
            cookies: '{refreshToken}',
          },
        },
        {
          ROUTE: '/forgot-password',
          METHOD: 'POST',
          REQUEST: {
            body: {
              username: 'string',
              email: 'string',
            },
            params: {
              token: '',
            },
          },
        },
        {
          ROUTE: '/verify-change-password',
          METHOD: 'POST',
          REQUEST: {
            body: {
              password: 'string',
            },
            params: {
              token: 'FORM RESPONSE YOUR EMAIL',
            },
          },
        },
      ],
    },
    '[API: 2]': {
      ROUTE: '/member',
      MESSAGE: 'UPDATING',
      // METHOD: [
      //   {
      //     METHOD: 'GET',
      //     REQUEST: {
      //       params: {
      //         _limit: 'string',
      //         _page: 'number',
      //         _name: 'string',
      //         _order: "enum('ASC', 'DESC')",
      //       },
      //     },
      //   },
      // ],
    },
    '[API: 3]': {
      ROUTE: '/product',
      METHOD: [
        {
          METHOD: 'GET',
          REQUEST: {
            params: {
              _limit: 'string',
              _page: 'number',
              _name: 'string',
              _order: "enum('ASC', 'DESC')",
              other: '...',
              message: 'if you have limit then you must have page too or as well as name and order',
            },
          },
          RESPONSE: {
            error: 'boolean',
            data: 'any',
            message: 'string',
            pagination: {
              _limit: 'number',
              _page: 'number',
              _totalRows: 'number',
            },
          },
        },
        'GET/:id',
        'POST',
        'PATCH',
        'DELETE',
      ],
    },
    '[API: 4]': {
      ROUTE: '/product-status',
      METHOD: ['GET', 'GET/:id', 'POST', 'PATCH', 'DELETE'],
    },
    '[API: 5]': {
      ROUTE: '/product-price',
      METHOD: ['GET', 'GET/:id', 'POST', 'PATCH', 'DELETE'],
    },
  },
};
