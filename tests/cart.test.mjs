import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCart,addItem,configurationKey} from '../src/utils/cart.mjs';
test('rejects malformed storage and strips untrusted prices and unknown variants',()=>{
 assert.throws(()=>normalizeCart({},'device'));
 assert.deepEqual(normalizeCart([{quantity:2,price:1,configuration:{productId:'device',strapId:'unknown',extras:[{variantId:'bad',quantity:1}]}}],'device'),[{quantity:2,configuration:{productId:'device',extras:[]}}]);
 assert.deepEqual(normalizeCart([{quantity:-1,configuration:{productId:'device'}},{quantity:2,configuration:{productId:'unknown'}}],'device'),[]);
});
test('configuration identity is stable and additions merge with a quantity limit',()=>{
 const a={productId:'device',extras:[{variantId:'a',quantity:1},{variantId:'b',quantity:2}]};
 const b={...a,extras:[...a.extras].reverse()};
 assert.equal(configurationKey(a),configurationKey(b));
 assert.equal(addItem([{configuration:a,quantity:98}],b,2)[0].quantity,99);
});
