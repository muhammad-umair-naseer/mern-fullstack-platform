'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const cx = require('../server/cx');
const Store = require('../server/store');
const { Accounts } = require('../server/accounts');

const DATA = '/tmp/pickparty-test/cx-auth.json';
fs.rmSync(path.dirname(DATA), { recursive: true, force: true });

const store = new Store(DATA);
const accounts = new Accounts(store);

// 1. Verify token signing and verification
const token = cx.signGameToken({ sub: '1234', name: 'Muhammad Umair Naseer' });
const verified = cx.verifyGameToken(token);
assert.strictEqual(verified.sub, '1234');
assert.strictEqual(verified.name, 'Muhammad Umair Naseer');

// 2. Reject tampered token
const [h, p, s] = token.split('.');
const tampered = `${h}.${p}.invalid_sig`;
assert.throws(() => cx.verifyGameToken(tampered), /signature does not match/);

// 3. Test Cortexis binding and guest account merging
const { account: guest, token: guestToken } = accounts.login(null);
guest.name = 'OldGuest';
guest.points = 250;
guest.matches = 2;
guest.wins = 1;
guest.streak = { cur: 3, best: 3, day: 100 };
guest.ach = ['first_match', 'first_win'];
store.save();

const bindResult = accounts.bindCortexis(verified, {
  guest,
  country: 'PK',
  nickname: cx.nicknameFrom(verified.name),
});

assert.strictEqual(bindResult.created, true);
assert.strictEqual(bindResult.merged, true);
assert.strictEqual(bindResult.account.id, 'cx_1234');
assert.strictEqual(bindResult.account.name, 'Muhammad Umair');
assert.strictEqual(bindResult.account.points, 250);
assert.strictEqual(bindResult.account.wins, 1);
assert.strictEqual(bindResult.account.matches, 2);
assert.deepStrictEqual(bindResult.account.ach, ['first_match', 'first_win']);
assert.strictEqual(bindResult.account.country, 'PK');

// 4. Test public profile output
const pub = accounts.public(bindResult.account);
assert.strictEqual(pub.isCortexis, true);
assert.strictEqual(pub.cortexisName, 'Muhammad Umair Naseer');

// 5. Solo ranked points stop at the daily cap
const cap = [1, 2].map(() => accounts.settleSolo(bindResult.account, { total: 7500, perfect: 0 }, 400));
assert.deepStrictEqual(cap.map((r) => [r.points, r.capped]), [[300, false], [100, true]]);

console.log('✓ All PickParty Cortexis SSO tests passed successfully!');
