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
exports.Escrow = exports.EscrowStatus = void 0;
const typeorm_1 = require("typeorm");
var EscrowStatus;
(function (EscrowStatus) {
    EscrowStatus["CREATED"] = "created";
    EscrowStatus["FUNDED"] = "funded";
    EscrowStatus["RELEASED"] = "released";
    EscrowStatus["REFUNDED"] = "refunded";
    EscrowStatus["DISPUTED"] = "disputed"; // Tranh chấp
})(EscrowStatus || (exports.EscrowStatus = EscrowStatus = {}));
let Escrow = class Escrow {
};
exports.Escrow = Escrow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Escrow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Escrow.prototype, "buyer_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Escrow.prototype, "seller_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Escrow.prototype, "credit_listing_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Escrow.prototype, "payment_id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Escrow.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, default: 2.5 }),
    __metadata("design:type", Number)
], Escrow.prototype, "fee_percentage", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Escrow.prototype, "fee_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EscrowStatus,
        default: EscrowStatus.CREATED
    }),
    __metadata("design:type", String)
], Escrow.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Escrow.prototype, "release_conditions", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Escrow.prototype, "released_at", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Escrow.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Escrow.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Escrow.prototype, "updated_at", void 0);
exports.Escrow = Escrow = __decorate([
    (0, typeorm_1.Entity)('escrows')
], Escrow);
