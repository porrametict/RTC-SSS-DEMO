const Route = use('Route')

Route.group("user", async () => {
    require('./api_user')
  }).prefix('/api/user')
  
Route.group("teacher", async () => {
    require('./api_teacher')
  }).prefix('/api/teacher')
  