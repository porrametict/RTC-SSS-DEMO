const Route = use('Route')
///user
Route.resource('subject', 'SubjectController')
Route.get('room','RoomController.index')

Route.get('room/:id','RoomController.show')


// Route.post('logout', 'UserController.logout')
//     .middleware(['auth:user'])
