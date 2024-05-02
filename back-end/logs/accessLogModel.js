class AccessLog {
    constructor(token, endpoint, method, timestamp) {
        this.token = token;
        this.endpoint = endpoint;
        this.method = method;
        this.timestamp = timestamp;
    }
}

export { AccessLog };