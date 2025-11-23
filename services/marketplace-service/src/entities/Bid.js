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
exports.Bid = void 0;
const typeorm_1 = require("typeorm");
const Listing_1 = require("./Listing");
let Bid = class Bid {
};
exports.Bid = Bid;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Bid.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bid.prototype, "bidderId", void 0);
__decorate([
    (0, typeorm_1.Column)("double precision"),
    __metadata("design:type", Number)
], Bid.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Listing_1.Listing, (listing) => listing.bids),
    __metadata("design:type", Listing_1.Listing)
], Bid.prototype, "listing", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Bid.prototype, "createdAt", void 0);
exports.Bid = Bid = __decorate([
    (0, typeorm_1.Entity)()
], Bid);
