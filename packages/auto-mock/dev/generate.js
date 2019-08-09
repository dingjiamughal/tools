const Mock = require('mockjs');

class DummyAPI {
    constructor() {
        this.proxies = {};
    }

    proxy(path, process) {
        this.proxies[path] = process;
    }

    find(path, params) {
        const mockData = {"nodeList":[{"url":"/list","description":"get list","response":{"items":[{"id":0},{"name":"dingjia"},{"age":25},{"id":1},{"name":"dingjia"},{"age":25},{"id":2},{"name":"dingjia"},{"age":25},{"id":3},{"name":"dingjia"},{"age":25},{"id":4},{"name":"dingjia"},{"age":25},{"id":5},{"name":"dingjia"},{"age":25}]}},{"url":"/list/save","description":"save","request":{"key":"asdf","value":[{"q":"zxzx"},{"w":"asas"},{"e":"qwqw"}]},"response":{"code":0}}]}.nodeList;
    }
}

module.exports = DummyAPI;
