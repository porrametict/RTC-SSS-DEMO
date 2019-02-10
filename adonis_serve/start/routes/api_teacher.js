
const Route = use('Route')
///user
Route.resource('users', 'TeacherController')
    .middleware(['auth:teacher'])

Route.post('login', 'TeacherController.login')
Route.get('getuser', 'TeacherController.getUser').middleware(['auth:teacher'])

// Route.post('logout', 'UserController.logout')
//     .middleware(['auth:user'])
