const hashFunc = require('sha256');
function hashToBucket(key) {
    return parseInt(hashFunc(key), 16) % 7;
}
let rawTokens = [
    {
        public: "1xnh225k",
        private: "Yq7ZiAoOEmdYgRNyxUBCbC7B9vcwPslN"
    },
    {
        public: "aazkly5h",
        private: "OQcDA1GRA9dItg5cWF23DAu8nGq0hJLq"
    },
    {
        public: "ypi9v8rq",
        private: "Ra6y6Dyuhp0K7HmTh6wOAttg6LEu0y0F"
    },
    {
        public: "hmv46pwd",
        private: "xv1K8UcgEUITR5NHsvOPWUf5vATt8cne"
    },
    {
        public: "3xa7197k",
        private: "mykam6JKc8L6KJEtuaZ9KSbz4N0be8FY"
    },
    {
        public: "3e931inw",
        private: "6V4ZgkAGtWfUgJb2kDJynB4fWzihuhIm"
    },
    {
        public: "0olpkinu",
        private: "jXQ9x9p8PoC3TscQyQL4Na8NwqYxhKGw"
    }
];
let tokens = new Array(rawTokens.length);
rawTokens.forEach(token => {
    let bucket = hashToBucket(token.public);
    tokens[bucket] = token;
});
function validate(publicKey, privateKey) {
    let bucket = hashToBucket(publicKey);
    if (tokens[bucket] && tokens[bucket].public == publicKey && tokens[bucket].private == privateKey) {
        return true;
    }
    return false;
}
exports.validate = validate;