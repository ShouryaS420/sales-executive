export const sendToken = (res, user, statusCode, message) => {

    const token = user.getJWTToken();

    const options = {
        httpOnly:true,
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*60*1000)
    }

    const userData = {
        _id: user._id,
        fullName: user.fullName,
        middleName: user.middleName,
        lastName: user.lastName,
        password: user.password,
        email: user.email,
        mobile: user.mobile,
        city: user.city,
        area: user.area,
        pin: user.pin,
        rera: user.rera,
        gst: user.gst,
    }

    res.status(statusCode).cookie("token", token, options).json({ success: true, message, user: userData, setToken: token });
};