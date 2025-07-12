const config = {
    app: {
        port: process.env.PORT
    },
    db: {
        uri: process.env.MONGODB_URI
    }, 
    abstract_api_key: {
        key: process.env.ABSTRACT_API_KEY
    }
}

module.exports = config;