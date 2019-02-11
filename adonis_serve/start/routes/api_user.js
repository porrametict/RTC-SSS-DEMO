
const Route = use('Route')
///user
Route.resource('users', 'UserController')
    .middleware(['auth:user'])

Route.post('login', 'UserController.login')
Route.get('getuser', 'UserController.getUser').middleware(['auth:user'])

Route.resource('subject','StudentEnrollController').middleware(['auth:user'])
// Route.post('logout', 'UserController.logout')
//     .middleware(['auth:user'])
