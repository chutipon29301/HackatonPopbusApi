"use strict";
const hashFunc = require('sha256');
function hashToBucket(key) {
    return parseInt(hashFunc(key), 16) % 23;
}
let rawTokens = [
    {
        name: 'Admin',
        public: 'vmp66yuu',
        private: 'o5NMNrwHDgjvsAo3lQ8EG9DCR0Spr8Iy'
    },
    {
        name: 'G.1',
        public: 'cmhekzs6',
        private: 'wtVFl2TZTIuuRD6jNQK5LO3DxL0AzG9z'
    },
    {
        name: 'G.2',
        public: 'n4rzhhcf',
        private: 'lyW1Lj6FwhOmYKCq5BAk9Cm1HltmzbUr'
    },
    {
        name: 'G.3',
        public: 'gk3jlyke',
        private: 'xCJx4VbZApwITdURn1jDqyDMFq57xLao'
    },
    {
        name: 'G.4',
        public: 'vo5tmpj7',
        private: '4Yq2Iffz0ri1f5hjgNYVqhwQ0er71yUy'
    },
    {
        name: 'G.5',
        public: '0p00a5u2',
        private: 'bR2yejB5NQEFsI0KB3GKV1tpomWOFlF0'
    },
    {
        name: 'G.6',
        public: 'hmwh0rjw',
        private: 'Fr02yCWC8DugZGjibbUpVXI9FOFErYjm'
    },
    {
        name: 'G.7',
        public: 'gygey5nx',
        private: 'NazNRF8ecuUStYnppZTT28ND8PG5yjsl'
    },
    {
        name: 'G.8',
        public: 'q5j4s7uz',
        private: 'jfxlON9GqfQmvxxQkork7O4iI7wTiuCf'
    },
    {
        name: 'G.9',
        public: 'i6bshw4s',
        private: '76Xr2Bey3PE1qRwU7VMPLtEV9GtBZMQk'
    },
    {
        name: 'G.10',
        public: 'oq41lqh1',
        private: 'yl0dKSao5xMVA3QUQ6W0nyRjYj8v8nHu'
    },
    {
        name: 'G.11',
        public: 'cpexq5b7',
        private: 'clTnranFyhREPvxfsvAu1Hec0hZxQ6gl'
    },
    {
        name: 'G.12',
        public: 'l9o7pk84',
        private: 'nc6oc1A2GJoOVmgPwSVzObPHT11rbKnP'
    },
    {
        name: 'G.13',
        public: 'z5nhd0qk',
        private: 'TUhJlC84nB5UfPpSmF6rh7oej990To0s'
    },
    {
        name: 'G.14',
        public: 'eok8rjoq',
        private: 'MYJNKnDDQWDUGsDF7RQRYxV7GfKmw1vN'
    },
    {
        name: 'G.15',
        public: 'n2tr4rtn',
        private: 'YvvHvOuSGBPNfxxOLe2EsVbfkpXrcRYg'
    },
    {
        name: 'G.16',
        public: 'f8853vt8',
        private: 'BsYUg7R7btF4jC2FqX74MXuVmepKaMJD'
    },
    {
        name: 'G.17',
        public: 'ubz4i6fu',
        private: 'bJ8C1fF4Js0nMKpf7NDVTxAUZXuDSezW'
    },
    {
        name: 'G.18',
        public: 'px7wguho',
        private: 'tlf5DOacp1sUJeDxyohkAzJ69MTqPC9d'
    },
    {
        name: 'G.19',
        public: '2tz5bkt0',
        private: 'xvWXg4K4mSxExWRu9buWVA53DmMcobpz'
    },
    {
        name: 'G.20',
        public: 'lnp93b4u',
        private: 'gzUuY3OVO3j8QYyq2qcbSEbyJEDh9A9t'
    },
    {
        name: 'G.21',
        public: 'rzrfrlfb',
        private: 'Y2XnzUqa63RMT2oft4gkZsDPI4RaT5hL'
    },
    {
        name: 'G.22',
        public: 'by2bxcmt',
        private: 'JnLDG7MQ1zYzo9XgJqY5DOEOok4rvf3o'
    }];
let tokens = new Array(rawTokens.length);
rawTokens.forEach(token => {
    let bucket = hashToBucket(token.public);
    tokens[bucket] = token;
    tokens[bucket].remaining = 60;
});
function getToken(publicKey) {
    let bucket = hashToBucket(publicKey);
    if (tokens[bucket] && tokens[bucket].public == publicKey) {
        return tokens[bucket];
    }
}
function validate(publicKey, privateKey) {
    let token = getToken(publicKey);
    if (token && token.private == privateKey) {
        return true;
    }
    return false;
}
function refresh() {
    tokens.forEach(token => {
        token.remaining = 60;
    });
}
function decrement(publicKey, privateKey) {
    let token = getToken(publicKey);
    if (token && token.remaining > 0) {
        token.remaining--;
        return token.remaining;
    }
    return -1;
}
exports.getToken = getToken;
exports.validate = validate;
exports.refresh = refresh;
exports.decrement = decrement;