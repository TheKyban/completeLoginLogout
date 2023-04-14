import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { HASH_ROUND, SECRET } from "../constants/constants.js";
import User from "../models/model.js"
import { render } from "ejs";



/**
 * Authenticated or not
 */

export const isAuthenticated = async (req, res, next) => {
    /**
     * Get email and Password
     */
    const { email, password } = req.body;

    /**
     * Check cookie is available or not
     */
    const { token } = req.cookies;


    if (token) {
        /**
         * Decrypt Secrets
         */

        const DecryptedToken = Jwt.verify(token, SECRET)

        /**
         * find the user from decoded token and save to req body to access in all functions
         */

        const user = await User.findById(DecryptedToken._id)
        req.user = user

        /**
         * Call next middleware
         */
        next()

    } else {
        /**
         * If cookie is not avialable then render Login
         */
        res.render("login")
    }


}

/**
 * Login
 */

export const Login = (req, res) => {

    /**
     * Get email and Password from request user
     */
    const { email, password } = req.user;

    /**
     * render logout page
     */


    res.render("logout", { name: email })

}


/**
 * Get data from Login page
*/

export const DataFromLoginPage = async (req, res) => {
    /**
     * GEt email passwor from Request body
     */
    const { email, password } = req.body

    /**
     * check user is exist or not in database
     */

    const isExist = await User.findOne({ email })

    if (!isExist) {
        return res.redirect("/register")
    }

    /**
     * compare password
     */
    const isMatch = await bcrypt.compare(password,isExist.password)
    
    try {
        if (isMatch) {

            /**
             * Get id of that data
             */

            const _id = isExist._id

            /**
             * Encrypt the id
             */

            const EncryptedID = Jwt.sign({ _id: _id }, SECRET)

            /**
             * Set cookie
            */
            res.cookie("token", EncryptedID, { expires: new Date(Date.now() + 1000 * 10) })

            /**
             * Redirect to Home route for check cookie is avialable or not
             */
        
            console.log("Logged")
            return res.redirect("/")
        }


    } catch (error) {
        console.log(error)
    }
    /**
     * Redirect to Home route for check cookie is avialable or not
     */

    console.log("password not correct")
    res.render('login',{message:"password incorrect"})

}


/**
 * Logout 
 */

export const logout = (req, res) => {
    /**
     * Delete Cookie
     */
    res.cookie("token", "", { httpOnly: true, expires: new Date(Date.now()) });

    /**
     * Redirect to Home route for check cookie is avialable or not
     */

    console.log("logged out")
    res.redirect("/")
}



/**
 * Resgister
 */

export const register = (req, res) => {
    /**
     * render register page
     */
    res.render("register")
}


/**
 * Data from Register page
 */

export const DataFromRegisterPage = async (req, res) => {
    /**
     * GEt email passwor from Request body
     */
    const { name, email, password } = req.body

    /**
     * check user is exist or not in database
     */

    const isExist = await User.findOne({ email })

    if (isExist) {
        /**
         * user is already exist to redirect to login page
         */
        console.log("already exist")
        return res.redirect("/")
    }

    try {
        /**
         * Encrypt password
         */
        const hashPassword = await bcrypt.hash(password,HASH_ROUND)

        /**
         * upload data to database
         */

        const userCreated = await User.create({ name, email, password:hashPassword })

    } catch (error) {
        console.log(error)
    }

    /**
     * Redirect to Home route for Login
     */

    console.log("signed")
    res.redirect("/")
}