const Route = use('Route')

Route.group("user", async () => {
    require('./api_user')
  }).prefix('/api/user')
  