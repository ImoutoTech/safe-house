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
          },
        ],
      },
    ],
  },
];

export default rawRoutes;
