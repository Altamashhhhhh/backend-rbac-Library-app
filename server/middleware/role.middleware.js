const roleAuth = (allowedRoles) =>{
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).send({message: 'You must be logged in to access this resource.'});
        }
        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).send({message:'You do not have permission to access this resource.'});
        }
        next();
                
                
}} 
module.exports = roleAuth;