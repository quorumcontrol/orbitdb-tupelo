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
var access_controller_interface_1 = require("orbit-db-access-controllers/src/access-controller-interface");
var tupelo_wasm_sdk_1 = require("tupelo-wasm-sdk");
var type = 'tupelo-access-controller';
var TupeloAccessController = /** @class */ (function (_super) {
    __extends(TupeloAccessController, _super);
    function TupeloAccessController(opts) {
        var _this = _super.call(this) || this;
        _this.did = opts.did.trim();
        return _this;
    }
    Object.defineProperty(TupeloAccessController, "type", {
        get: function () { return type; },
        enumerable: true,
        configurable: true
    });
    TupeloAccessController.create = function (orbitdb, opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("create calld with options: ", opts);
                return [2 /*return*/, new TupeloAccessController(opts)];
            });
        });
    };
    TupeloAccessController.prototype.canAppend = function (entry, identityProvider) {
        return __awaiter(this, void 0, void 0, function () {
            var c, dbTip, tree, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isValidDid(entry.identity.id)) {
                            return [2 /*return*/, Promise.resolve(false)];
                        }
                        return [4 /*yield*/, tupelo_wasm_sdk_1.Community.getDefault()];
                    case 1:
                        c = _a.sent();
                        console.log('searching for did: "', this.did + "'");
                        return [4 /*yield*/, c.getTip(this.did)];
                    case 2:
                        dbTip = _a.sent();
                        tree = new tupelo_wasm_sdk_1.ChainTree({
                            store: c.blockservice,
                            tip: dbTip
                        });
                        console.log("found tip, resolving", entry.id);
                        return [4 /*yield*/, tree.resolve("/tree/data" + entry.id)];
                    case 3:
                        resp = _a.sent();
                        console.log(resp);
                        if (resp.value.includes(entry.identity.id)) {
                            return [2 /*return*/, identityProvider.verifyIdentity(entry.identity)];
                        }
                        console.log("resolving");
                        return [2 /*return*/, Promise.resolve(false)];
                }
            });
        });
    };
    TupeloAccessController.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { did: this.did }];
            });
        });
    };
    TupeloAccessController.prototype.load = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("load: ", address);
                return [2 /*return*/, Promise.resolve(true)];
            });
        });
    };
    Object.defineProperty(TupeloAccessController.prototype, "address", {
        // Returns the address of the contract used as the AC
        get: function () {
            return this.did;
        },
        enumerable: true,
        configurable: true
    });
    return TupeloAccessController;
}(access_controller_interface_1["default"]));
exports.TupeloAccessController = TupeloAccessController;
function isValidDid(did) {
    return did.startsWith("did:tupelo");
}
