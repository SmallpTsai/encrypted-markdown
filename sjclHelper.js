"use strict";

var sjclHelper = {

  init: function(password) {
    const salt_hex = "1595E44A20ADE6B2";
    const iv_hex = "ABED67FAE4E5535D8E78D21C26EDC136";

    this._params = {
      salt: sjcl.codec.hex.toBits(salt_hex), 
      iv: sjcl.codec.hex.toBits(iv_hex),
      ks: 256
    };

    var tmp = sjcl.misc.cachedPbkdf2(password, this._params);
    this._key = tmp.key.slice(0, this._params.ks/32);
  },

  encrypt: function(plaintext) {
    var encrypted = sjcl.encrypt(this._key, plaintext, this._params);
    var ciphertext = JSON.parse(encrypted)["ct"]
    return ciphertext;
  },

  decrypt: function(ciphertext) {
    var params = JSON.parse(JSON.stringify(this._params));
    params.ct = sjcl.codec.base64.toBits(ciphertext);
    var ct = sjcl.json.encode(params);
    var decrypted = sjcl.decrypt(this._key, ct);
    return decrypted;
  },
}