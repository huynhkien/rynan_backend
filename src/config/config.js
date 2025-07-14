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
    }
}

module.exports = config;