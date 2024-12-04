"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscription: {
        isActive: { type: Boolean, default: false },
        startDate: { type: Date },
        endDate: { type: Date },
        plan: { type: String, required: false },
    },
    role: { type: String, enum: ['admin', 'moderator', 'participant'], default: 'participant' },
    verify_token: { type: String, required: false },
    verified: { type: Boolean, required: true, default: false },
});
;
exports.User = mongoose_1.default.model('User', UserSchema);
