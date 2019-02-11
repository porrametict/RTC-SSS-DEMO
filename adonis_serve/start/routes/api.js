const Route = use('Route')

Route.group("user", async () => {
    require('./api_user')
  }).prefix('/api/user')
  
  
Route.group("teacher", async () => {
    require('./api_teacher')
  }).prefix('/api/teacher')


  
  Route.group("public", async () => {
    require('./api_public')
  }).prefix('/api/public')