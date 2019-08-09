const Mock = require('mockjs');

class DummyAPI {
    constructor() {
        this.proxies = {};
    }

    proxy(path, process) {
        this.proxies[path] = process;
    }

    find(path, params) {
        const mockData = "<%INJECT%>".nodeList;
    }
}

module.exports = DummyAPI;
