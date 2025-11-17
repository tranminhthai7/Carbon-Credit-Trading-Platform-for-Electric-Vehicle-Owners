"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//routes/index.ts
const express_1 = require("express");
const calcController_1 = require("../controllers/calcController");
const walletController_1 = require("../controllers/walletController");
const router = (0, express_1.Router)();
router.post('/calculate/co2', calcController_1.calculateCO2);
router.post('/wallet/create', walletController_1.createWalletHandler);
router.get('/wallet/:userId', walletController_1.getWalletHandler);
router.post('/wallet/mint', walletController_1.mintHandler);
router.post('/wallet/transfer', walletController_1.transferHandler);
exports.default = router;
