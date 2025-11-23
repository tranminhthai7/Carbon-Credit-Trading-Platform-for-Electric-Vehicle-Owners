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
exports.CreditRequest = void 0;
const typeorm_1 = require("typeorm");
let CreditRequest = class CreditRequest {
};
exports.CreditRequest = CreditRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CreditRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CreditRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('double precision'),
    __metadata("design:type", Number)
], CreditRequest.prototype, "co2Amount", void 0);
__decorate([
    (0, typeorm_1.Column)('double precision'),
    __metadata("design:type", Number)
], CreditRequest.prototype, "creditsAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], CreditRequest.prototype, "idempotency_key", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'PENDING' }),
    __metadata("design:type", String)
], CreditRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CreditRequest.prototype, "created_at", void 0);
exports.CreditRequest = CreditRequest = __decorate([
    (0, typeorm_1.Entity)('credit_requests')
], CreditRequest);
