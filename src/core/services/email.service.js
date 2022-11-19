"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmailService = void 0;
var common_1 = require("@nestjs/common");
var sendgrid = require("@sendgrid/mail");
var EmailService = /** @class */ (function () {
    function EmailService(configService) {
        this.configService = configService;
        sendgrid.setApiKey(this.configService.get('SENDGRID_KEY'));
    }
    EmailService.prototype.send = function (data) {
        return sendgrid
            .send({
            from: this.configService.get('SENDGRID_SENDER_EMAIL'),
            to: data.email,
            templateId: data.template,
            subject: data.subject,
            personalizations: [
                {
                    subject: data.subject,
                    to: [{ email: data.email }],
                    dynamicTemplateData: __assign({}, data.args)
                },
            ]
        })["catch"](function (err) { var _a; return console.log((_a = err.response) === null || _a === void 0 ? void 0 : _a.body); });
    };
    EmailService.prototype.resetPassword = function (email, args) {
        return this.send({
            email: email,
            template: 'd-c097cd2462e74ede82bbdefc9a97d818',
            subject: 'Password reset',
            args: args
        });
    };
    EmailService.prototype.welomeUser = function (email, args) {
        return this.send({
            email: email,
            template: 'd-c5f46a4817b740bcacbf40fb1772dda6',
            subject: 'Welcome to games for good',
            args: args
        });
    };
    EmailService = __decorate([
        (0, common_1.Injectable)()
    ], EmailService);
    return EmailService;
}());
exports.EmailService = EmailService;
