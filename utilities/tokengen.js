let hashFunc = require('sha256');
let tokens = new Array(23);
let count = 23;
function hashToBucket(key) {
    return parseInt(hashFunc(key), 16) % 23;
}
function randPublic() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let out = "";
    for (let i = 0; i < 8; i++) {
        let random = Math.floor(Math.random() * chars.length);
        out += chars[random];
    }
    return out;
}
function randPrivate() {
    const chars = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    let out = "";
    for (let i = 0; i < 32; i++) {
        let random = Math.floor(Math.random() * chars.length);
        out += chars[random];
    }
    return out;
}
while (count > 0) {
    let public = randPublic();
    let hash = hashToBucket(public);
    if (!tokens[hash]) {
        let private = randPrivate();
        tokens[hash] = {
            name: "",
            public: public,
            private: private,
            limit: 30,
            remaining: 30
        };
        count--;
    }
}
console.log(tokens);