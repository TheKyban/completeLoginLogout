import { DataFromLoginPage, DataFromRegisterPage, Login, isAuthenticated, logout, register } from "../controllers/controller.js"

export default (app) => {

    /**
     * GET
     */
    app.get("/", isAuthenticated, Login) //Login
    app.get("/logout", logout) // Logout
    app.get("/register",register)

    /**
     * POST
     */

    app.post("/", DataFromLoginPage)
    app.post("/register",DataFromRegisterPage)
}