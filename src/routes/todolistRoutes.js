import { addNewTask, getTasks, updateTask, deleteTask } from '../controllers/taskController'
import { addNewProject, getProjects, updateProject, deleteProject, assignToProdject, getAProject } from '../controllers/projectController'

const routes = (app) => {
    app.route('/task')
        .get(getTasks)

        .post(addNewTask)
    
    app.route('/task/:taskID')
        .put(updateTask)

        .delete(deleteTask)
    
    app.route('/project')
        .get(getProjects)

        .post(addNewProject)
    
    app.route('/project/:projectID')
        .get(getAProject)

        .put(updateProject)

        .delete(deleteProject)
    
    app.route('/project/assign/:projectID')
        .put(assignToProdject)
}

export default routes