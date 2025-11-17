"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
//Listing.ts
const typeorm_1 = require("typeorm");
const Bid_1 = require("./Bid");
/**
 * Listing: Một bài đăng bán tín chỉ carbon
 * - userId: người đăng bán
 * - amount: số credits (tons CO2)
 * - pricePerCredit: giá 1 credit (USD)
 * - status: OPEN | SOLD
 */
let Listing = class Listing {
};
exports.Listing = Listing;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Listing.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Listing.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("double precision"),
    __metadata("design:type", Number)
], Listing.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)("double precision"),
    __metadata("design:type", Number)
], Listing.prototype, "pricePerCredit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "OPEN" }),
    __metadata("design:type", String)
], Listing.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Listing.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Bid_1.Bid, (bid) => bid.listing),
    __metadata("design:type", Array)
], Listing.prototype, "bids", void 0);
exports.Listing = Listing = __decorate([
    (0, typeorm_1.Entity)()
], Listing);
