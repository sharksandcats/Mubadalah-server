const adminAuth = (req, res, next) =>{
    if(req.user && req.user.isAdmin){
        next();
    } else{
        res.status(403).json({message: "Access Denied: Admin priviliges required."});
    }
};

export default adminAuth;
 