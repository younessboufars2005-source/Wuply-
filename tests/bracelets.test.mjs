import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { addItem, normalizeCart } from '../src/utils/cart.mjs';

const catalog = JSON.parse(await fs.readFile(new URL('../src/data/catalog.json', import.meta.url), 'utf8'));
const variants = catalog.straps.flatMap(s => s.variants);
const ids = variants.map(v => v.id);

test('19 unique variants have distinct, consistently sized real image assets and translations', async () => {
  assert.equal(catalog.straps.find(s => s.id === 'classique').variants.length, 15);
  assert.equal(catalog.straps.find(s => s.id === 'originale').variants.length, 4);
  assert.equal(new Set(ids).size, 19);
  assert.equal(new Set(variants.map(v => v.image.src)).size, 19);
  for (const v of variants) {
    const file = new URL(`../public${v.image.src}`, import.meta.url);
    const metadata = await sharp(fileURLToPath(file)).metadata();
    assert.equal(metadata.width, 360);
    assert.equal(metadata.height, 480);
    assert.equal(metadata.format, 'webp');
    for (const lang of ['fr','en','ar']) {
      assert.ok(v.name[lang]); assert.ok(v.description[lang]); assert.ok(v.image.alt[lang]);
    }
    assert.equal(v.price, undefined, 'No accessory price invented');
    assert.equal(v.availability, 'unavailable', 'No stock inferred from a photo');
    assert.equal(v.demoSelectable, true);
  }
});

test('all colours/models survive cart serialization, separately and on the device', () => {
  let cart = [];
  for (const id of ids) {
    cart = addItem(cart, {productId:catalog.product.id, strapId:id, extras:[]}, 1);
    cart = addItem(cart, {productId:catalog.product.id, itemType:'strap', strapId:id, extras:[]}, 2);
  }
  assert.equal(cart.length, 38, 'Standalone straps must not merge with device configurations');
  assert.deepEqual(normalizeCart(JSON.parse(JSON.stringify(cart)), catalog.product.id, ids), cart);
  const first = {productId:catalog.product.id, itemType:'strap', strapId:ids[0], extras:[]};
  cart = addItem(cart, first, 3);
  assert.equal(cart.find(i => i.configuration.itemType === 'strap' && i.configuration.strapId === ids[0]).quantity, 5);
  assert.equal(normalizeCart([{quantity:1,configuration:{...first,strapId:'unknown'}}],catalog.product.id,ids).length,0);
});
