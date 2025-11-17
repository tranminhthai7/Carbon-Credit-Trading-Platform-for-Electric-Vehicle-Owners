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
exports.Withdrawal = exports.WithdrawalMethod = exports.WithdrawalStatus = void 0;
const typeorm_1 = require("typeorm");
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "pending";
    WithdrawalStatus["PROCESSING"] = "processing";
    WithdrawalStatus["COMPLETED"] = "completed";
    WithdrawalStatus["FAILED"] = "failed";
    WithdrawalStatus["CANCELLED"] = "cancelled";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
var WithdrawalMethod;
(function (WithdrawalMethod) {
    WithdrawalMethod["BANK_TRANSFER"] = "bank_transfer";
    WithdrawalMethod["PAYPAL"] = "paypal";
    WithdrawalMethod["STRIPE"] = "stripe";
    WithdrawalMethod["WALLET"] = "wallet";
})(WithdrawalMethod || (exports.WithdrawalMethod = WithdrawalMethod = {}));
let Withdrawal = class Withdrawal {
};
exports.Withdrawal = Withdrawal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Withdrawal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Withdrawal.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "net_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WithdrawalMethod,
        default: WithdrawalMethod.BANK_TRANSFER
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WithdrawalStatus,
        default: WithdrawalStatus.PENDING
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Object)
], Withdrawal.prototype, "bank_details", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Withdrawal.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Withdrawal.prototype, "failure_reason", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "processed_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Withdrawal.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Withdrawal.prototype, "updated_at", void 0);
exports.Withdrawal = Withdrawal = __decorate([
    (0, typeorm_1.Entity)('withdrawals')
], Withdrawal);
