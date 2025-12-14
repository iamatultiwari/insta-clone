const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const USER = mongoose.model("USER")

module.exports = (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" })
    }

    const token = authorization.replace("Bearer ", "")

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "Invalid or expired token" })
        }

        const { _id } = payload

        USER.findById(_id)
            .then(user => {
                req.user = user
                next()
            })
            .catch(err => {
                return res.status(401).json({ error: "User not found" })
            })
    })
}
