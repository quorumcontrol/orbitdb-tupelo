"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var orbit_db_identity_provider_1 = require("orbit-db-identity-provider");
var tupelo_wasm_sdk_1 = require("tupelo-wasm-sdk");
var signatures_pb_1 = require("tupelo-messages/signatures/signatures_pb");
// see https://github.com/orbitdb/orbit-db-identity-provider/blob/master/src/identity-provider-interface.js
var type = 'tupelo-identity';
var authenticationPath = "tree/_tupelo/authentications";
var TupeloIdentityProvider = /** @class */ (function (_super) {
    __extends(TupeloIdentityProvider, _super);
    //TODO: should be more prescriptive typing here?
    function TupeloIdentityProvider(options) {
        var _this = _super.call(this, options) || this;
        if (options.tree === undefined || options.did === undefined) {
            throw new Error("missing tree or did from identity options");
        }
        if (!options.tree.key || options.tree.key.privateKey === undefined) {
            throw new Error("must have a chaintree with a private key");
        }
        _this.tree = options.tree;
        _this.did = options.did;
        return _this;
    }
    Object.defineProperty(TupeloIdentityProvider, "type", {
        get: function () { return type; },
        enumerable: true,
        configurable: true
    });
    TupeloIdentityProvider.verifyIdentity = function (identity) {
        return __awaiter(this, void 0, void 0, function () {
            var c, tip, e_1, tree, _a, value, remainderPath, _i, value_1, addr, verified, e_2, e_3, addr, verified, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("verifying identity: ", identity);
                        return [4 /*yield*/, tupelo_wasm_sdk_1.Community.getDefault()];
                    case 1:
                        c = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, c.getTip(identity.id)];
                    case 3:
                        tip = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        console.error("couldn't find tip: ", e_1);
                        return [2 /*return*/, false];
                    case 5:
                        tree = new tupelo_wasm_sdk_1.ChainTree({
                            store: c.blockservice,
                            tip: tip
                        });
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 14, , 19]);
                        return [4 /*yield*/, tree.resolve(authenticationPath)];
                    case 7:
                        _a = _b.sent(), value = _a.value, remainderPath = _a.remainderPath;
                        if (!value || value.length == 0 || remainderPath.length > 0) {
                            throw 'not found';
                        }
                        _i = 0, value_1 = value;
                        _b.label = 8;
                    case 8:
                        if (!(_i < value_1.length)) return [3 /*break*/, 13];
                        addr = value_1[_i];
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, tupelo_wasm_sdk_1.Tupelo.verifyMessage(addr, Buffer.from(identity.publicKey + identity.signatures.id), signatures_pb_1.Signature.deserializeBinary(Buffer.from(identity.signatures.publicKey, 'base64')))];
                    case 10:
                        verified = _b.sent();
                        if (verified) {
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 12];
                    case 11:
                        e_2 = _b.sent();
                        console.error("error verifying: ", e_2);
                        return [3 /*break*/, 12];
                    case 12:
                        _i++;
                        return [3 /*break*/, 8];
                    case 13: return [3 /*break*/, 19];
                    case 14:
                        e_3 = _b.sent();
                        if (!(e_3 === 'not found')) return [3 /*break*/, 18];
                        addr = identity.id.split("did:tupelo:")[1];
                        _b.label = 15;
                    case 15:
                        _b.trys.push([15, 17, , 18]);
                        return [4 /*yield*/, tupelo_wasm_sdk_1.Tupelo.verifyMessage(addr, Buffer.from(identity.publicKey + identity.signatures.id), signatures_pb_1.Signature.deserializeBinary(Buffer.from(identity.signatures.publicKey, 'base64')))];
                    case 16:
                        verified = _b.sent();
                        if (verified) {
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 18];
                    case 17:
                        e_4 = _b.sent();
                        return [2 /*return*/, false];
                    case 18: return [3 /*break*/, 19];
                    case 19: return [2 /*return*/, false];
                }
            });
        });
    };
    TupeloIdentityProvider.prototype.getId = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.did];
            });
        });
    };
    TupeloIdentityProvider.prototype.signIdentity = function (data, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log("data: ", data, "options: ", options)
                        if (this.tree.key === undefined || this.tree.key.privateKey === undefined) {
                            throw new Error("must have a chaintree with a private key");
                        }
                        return [4 /*yield*/, this.tree.key.signMessage(Buffer.from(data))];
                    case 1:
                        sig = _a.sent();
                        return [2 /*return*/, Buffer.from(sig.serializeBinary()).toString('base64')];
                }
            });
        });
    };
    return TupeloIdentityProvider;
}(orbit_db_identity_provider_1.IdentityProvider));
exports.TupeloIdentityProvider = TupeloIdentityProvider;
