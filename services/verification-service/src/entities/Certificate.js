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
exports.Certificate = exports.CertificateType = void 0;
const typeorm_1 = require("typeorm");
var CertificateType;
(function (CertificateType) {
    CertificateType["CARBON_CREDIT"] = "carbon_credit";
    CertificateType["KYC_VERIFICATION"] = "kyc_verification";
    CertificateType["EMISSION_REDUCTION"] = "emission_reduction";
})(CertificateType || (exports.CertificateType = CertificateType = {}));
let Certificate = class Certificate {
};
exports.Certificate = Certificate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Certificate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Certificate.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Certificate.prototype, "verification_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CertificateType
    }),
    __metadata("design:type", String)
], Certificate.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 100, unique: true }),
    __metadata("design:type", String)
], Certificate.prototype, "certificate_number", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Certificate.prototype, "co2_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Certificate.prototype, "credits_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Certificate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], Certificate.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 500, nullable: true }),
    __metadata("design:type", String)
], Certificate.prototype, "certificate_url", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Certificate.prototype, "issued_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Certificate.prototype, "issued_at", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { nullable: true }),
    __metadata("design:type", Date)
], Certificate.prototype, "expires_at", void 0);
exports.Certificate = Certificate = __decorate([
    (0, typeorm_1.Entity)('certificates')
], Certificate);
