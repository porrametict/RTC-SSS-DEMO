
const Route = use('Route')
///user
Route.post('login', 'TeacherController.login')
Route.resource('users', 'TeacherController')
    .middleware(['auth:teacher'])

Route.get('getuser', 'TeacherController.getUser').middleware(['auth:teacher'])

Route.resource('subject','TeacherSubjectController').middleware(['auth:teacher'])

Route.resource('room','RoomController').middleware(['auth:teacher'])




// Route.post('logout', 'UserController.logout')
//     .middleware(['auth:user'])
