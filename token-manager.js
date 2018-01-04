"use strict";
const hashFunc = require('sha256');
function hashToBucket(key) {
    return parseInt(hashFunc(key), 16) % 23;
}
let rawTokens = [
    {
        name: 'Example',
        public: 'wsvnlq0s',
        private: 'iBPqfYnJLjDsjZfK1oPagJ1GCmM8gcyb',
        limit: 100,
        remaining: 100
    },
    {
        name: 'G.1',
        public: 'f4os4q9s',
        private: 'pbXWcUxzvVGgTWZB8gm16guUzfhDgUYM',
        limit: 100,
        remaining: 100
    },
    {
        name: 'G.2',
        public: 'xn8pkkcs',
        private: 'QwYWjQTkKJrprAC3dP9XUCuBfew43Pe1',
        limit: 100,
        remaining: 100
    },
    {
        name: 'G.3',
        public: '1ft7zyc6',
        private: 'GnxVGPw5tzseaMWuQa3FvBW1DNvEHZiQ',
        limit: 100,
        remaining: 100
    },
    {
        name: 'G.4',
        public: 'mhj1tiun',
        private: 'pp7FT4gntqq6UrN6HaiGfyWrefNZ2mpm',
        limit: 100,
        remaining: 100
    },
    {
        name: 'G.5',
        public: 'lmxrve3p',
        private: 't5owXNmp7bTFHfj6H8VdawSf5d6ewZt1',
        limit: 100,
        remaining: 100
    },
    {
        name: 'Too',
        public: '0lr3f4ud',
        private: 'k5dbDz9ECA1YgfEzvT7UqHJF3CbfREfS',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Ham',
        public: 'loig46i0',
        private: 'Hm8CuFnChgP2Rt4vgSgpUg2nNhfPpWCp',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Ming',
        public: 'qjiz24fn',
        private: 'kq3k3JTxGNsjgZDeUpTuEh6Ukkf9tSJg',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Beam',
        public: 'qzhvjx9l',
        private: 's9xr6p1BXmnF5seUMHeZR1utFESHUags',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Pud',
        public: 'r586yr82',
        private: 'eJRbuJcaNjpAUzrNfMByvHSxhr1AEMW4',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Tee',
        public: 'g18dgs19',
        private: '31iZaHfB83VTrCpUwcYyVRTna4iDLAde',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Warm',
        public: 'f4n35oyh',
        private: '8m4xriwFTJaALQdD1pmmnnP9hyw8hpXx',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Taan',
        public: 'h01ebz4b',
        private: 'sdUvNFjP5i1CwK5kyaZ6vK5mAWpeJ1Xy',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Khao-oat',
        public: 'twy7ajcf',
        private: 'qDqbpbZHJhHJreVGAV8FDjHr3Q3giCKB',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Fap',
        public: 'jqc9v9s4',
        private: '55DEoddeo1C8fzygKNV6ZAw7JY1zdPcA',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Chan',
        public: '0buzy5kb',
        private: 'RXJy85ujYFpTLjzSVb22f3RfAKNWehht',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Bas',
        public: 'dxxj2k8v',
        private: 'cYRQTgYj8shvzpAJBJf1J6ep83P7b2iL',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Bee',
        public: '61e353v7',
        private: 'xTDLgDToBUXgAnnrVqtErjHuqcMBrXAR',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Nuke',
        public: 'zuip9z5e',
        private: 'fbdHjjFi2zhjJdTNmDiPxihYeWVBfe3x',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Titang',
        public: 'trdt5qgc',
        private: 'hdR76566u6hEw8hCSUywgKBRDK5dvHLy',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Spare-1',
        public: 'xdd35dut',
        private: 'cZdPb5eJV3ruHw1tTfg7mZFFjj77oDZp',
        limit: 30,
        remaining: 30
    },
    {
        name: 'Admin',
        public: '0o6raqqm',
        private: 'YHrJofZAho1oK3ePSCytPUNayk2Zw34z',
        limit: 500,
        remaining: 500
    }
];
let tokens = new Array(rawTokens.length);
rawTokens.forEach(token => {
    let bucket = hashToBucket(token.public);
    tokens[bucket] = token;
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
        token.remaining = token.limit;
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
function getTokenByPhone(phone) {
    let phoneTokens = [
        {
            name: 'Too',
            public: '0lr3f4ud',
            private: 'k5dbDz9ECA1YgfEzvT7UqHJF3CbfREfS',
            phone: '0625989223',
            limit: 30,
        },
        {
            name: 'Ham',
            public: 'loig46i0',
            private: 'Hm8CuFnChgP2Rt4vgSgpUg2nNhfPpWCp',
            phone: '0909254471',
            limit: 30,
        },
        {
            name: 'Ming',
            public: 'qjiz24fn',
            private: 'kq3k3JTxGNsjgZDeUpTuEh6Ukkf9tSJg',
            phone: '0952532145',
            limit: 30,
        },
        {
            name: 'Beam',
            public: 'qzhvjx9l',
            private: 's9xr6p1BXmnF5seUMHeZR1utFESHUags',
            phone: '0824715225',
            limit: 30,
        },
        {
            name: 'Pud',
            public: 'r586yr82',
            private: 'eJRbuJcaNjpAUzrNfMByvHSxhr1AEMW4',
            phone: '0904840300',
            limit: 30,
        },
        {
            name: 'Tee',
            public: 'g18dgs19',
            private: '31iZaHfB83VTrCpUwcYyVRTna4iDLAde',
            phone: '0867733704',
            limit: 30,
        },
        {
            name: 'Warm',
            public: 'f4n35oyh',
            private: '8m4xriwFTJaALQdD1pmmnnP9hyw8hpXx',
            phone: '0846405948',
            limit: 30,
        },
        {
            name: 'Taan',
            public: 'h01ebz4b',
            private: 'sdUvNFjP5i1CwK5kyaZ6vK5mAWpeJ1Xy',
            phone: '0939586372',
            limit: 30,
        },
        {
            name: 'Khao-oat',
            public: 'twy7ajcf',
            private: 'qDqbpbZHJhHJreVGAV8FDjHr3Q3giCKB',
            phone: '0917917575',
            limit: 30,
        },
        {
            name: 'Fap',
            public: 'jqc9v9s4',
            private: '55DEoddeo1C8fzygKNV6ZAw7JY1zdPcA',
            phone: '0917807441',
            limit: 30,
        },
        {
            name: 'Chan',
            public: '0buzy5kb',
            private: 'RXJy85ujYFpTLjzSVb22f3RfAKNWehht',
            phone: '0863456858',
            limit: 30,
        },
        {
            name: 'Bas',
            public: 'dxxj2k8v',
            private: 'cYRQTgYj8shvzpAJBJf1J6ep83P7b2iL',
            phone: '0827905020',
            limit: 30,
        },
        {
            name: 'Bee',
            public: '61e353v7',
            private: 'xTDLgDToBUXgAnnrVqtErjHuqcMBrXAR',
            phone: '0970404823',
            limit: 30,
        },
        {
            name: 'Nuke',
            public: 'zuip9z5e',
            private: 'fbdHjjFi2zhjJdTNmDiPxihYeWVBfe3x',
            phone: '0864046486',
            limit: 30,
        },
        {
            name: 'Titang',
            public: 'trdt5qgc',
            private: 'hdR76566u6hEw8hCSUywgKBRDK5dvHLy',
            phone: '0812052810',
            limit: 30,
        }
    ];
    let out = null;
    phoneTokens.forEach(token => {
        if (token.phone == phone) {
            out = token;
        }
    });
    return out;
}
exports.getToken = getToken;
exports.validate = validate;
exports.refresh = refresh;
exports.decrement = decrement;
exports.getTokenByPhone = getTokenByPhone;