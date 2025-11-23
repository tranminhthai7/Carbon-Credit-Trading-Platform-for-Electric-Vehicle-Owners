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
exports.KYC = exports.DocumentType = exports.KYCStatus = void 0;
const typeorm_1 = require("typeorm");
var KYCStatus;
(function (KYCStatus) {
    KYCStatus["PENDING"] = "pending";
    KYCStatus["APPROVED"] = "approved";
    KYCStatus["REJECTED"] = "rejected";
    KYCStatus["REQUIRES_ADDITIONAL_INFO"] = "requires_additional_info";
})(KYCStatus || (exports.KYCStatus = KYCStatus = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["PASSPORT"] = "passport";
    DocumentType["DRIVERS_LICENSE"] = "drivers_license";
    DocumentType["NATIONAL_ID"] = "national_id";
    DocumentType["UTILITY_BILL"] = "utility_bill";
    DocumentType["BANK_STATEMENT"] = "bank_statement";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
let KYC = class KYC {
};
exports.KYC = KYC;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], KYC.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], KYC.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 100 }),
    __metadata("design:type", String)
], KYC.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], KYC.prototype, "date_of_birth", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 100 }),
    __metadata("design:type", String)
], KYC.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], KYC.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 20 }),
    __metadata("design:type", String)
], KYC.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Array)
], KYC.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: KYCStatus,
        default: KYCStatus.PENDING
    }),
    __metadata("design:type", String)
], KYC.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], KYC.prototype, "reviewer_id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], KYC.prototype, "rejection_reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], KYC.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], KYC.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], KYC.prototype, "reviewed_at", void 0);
exports.KYC = KYC = __decorate([
    (0, typeorm_1.Entity)('kyc_verifications')
], KYC);
