const config = {
    app: {
        port: process.env.PORT
    },
    db: {
        uri: process.env.MONGODB_URI
    }, 
    abstract_api_key: {
        key: process.env.ABSTRACT_API_KEY
    }, 
    email_name: {
        value: process.env.EMAIL_NAME
    }, 
    email_app_password: {
        password: process.env.EMAIL_APP_PASSWORD
    },
    vnp_TmnCode: {
        code: process.env.VNP_TMNCODE
    },
    vnp_HashSecret: {
        secret: process.env.VNP_HASH_SECRET
    },
    vnp_Url: {
        url: process.env.VNP_URL
    },
    vnp_Url_Return: {
        url: process.env.VNP_RETURN_URL
    },

}

module.exports = config;