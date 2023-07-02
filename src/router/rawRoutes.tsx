const rawRoutes = [
  {
    path: "/",
    children: [
      {
        path: "/",
      },
      {
        path: "/login",
      },
      {
        path: "/register",
      },
      {
        path: "/callback/:appId",
      },
      {
        path: "/user",
        meta: {
          needAuth: true,
        },
        children: [
          {
            path: "/user",
          },
          {
            path: "/user/app",
            children: [
              {
                path: "/user/app",
              },
              {
                path: "/user/app/:type",
              },
            ],
          },
          {
            path: "/user/admin",
            meta: {
              needAdmin: true,
            },
          },
        ],
      },
    ],
  },
];

export default rawRoutes;
