"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const sampleMqttClient_1 = require("./sampleMqttClient");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
// Load environment variables from .env file using the dotenv package
const envConfig = (0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../../.env') });
const ModuleName = 'SampleApp';
let sampleApp;
class SampleApp {
    stopSample() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this.sampleMqttClient) === null || _a === void 0 ? void 0 : _a.connected) {
                yield this.sampleMqttClient.endClientSession();
            }
        });
    }
    startSample() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.Logger.log([ModuleName, 'info'], `Starting MQTT client sample}`);
                if (!((_a = envConfig.parsed) === null || _a === void 0 ? void 0 : _a.MQTT_HOST_NAME)) {
                    throw new Error('MQTT_HOST_NAME environment variable is not set');
                }
                if (((_b = envConfig.parsed) === null || _b === void 0 ? void 0 : _b.MQTT_PASSWORD) && !((_c = envConfig.parsed) === null || _c === void 0 ? void 0 : _c.MQTT_USERNAME)) {
                    throw new Error('MQTT_USERNAME environment variable is required if MQTT_PASSWORD is set');
                }
                const connectionSettings = {
                    mqttHostname: ((_d = envConfig.parsed) === null || _d === void 0 ? void 0 : _d.MQTT_HOST_NAME) || '',
                    mqttTcpPort: Number((_e = envConfig.parsed) === null || _e === void 0 ? void 0 : _e.MQTT_TCP_PORT) || 8883,
                    mqttUseTls: Boolean(((_f = envConfig.parsed) === null || _f === void 0 ? void 0 : _f.MQTT_USE_TLS) === undefined ? true : (_g = envConfig.parsed) === null || _g === void 0 ? void 0 : _g.MQTT_USE_TLS),
                    mqttCleanSession: Boolean(((_h = envConfig.parsed) === null || _h === void 0 ? void 0 : _h.MQTT_CLEAN_SESSION) === undefined ? true : (_j = envConfig.parsed) === null || _j === void 0 ? void 0 : _j.MQTT_CLEAN_SESSION),
                    mqttKeepAliveInSeconds: Number((_k = envConfig.parsed) === null || _k === void 0 ? void 0 : _k.MQTT_KEEP_ALIVE_IN_SECONDS) || 30,
                    mqttClientId: ((_l = envConfig.parsed) === null || _l === void 0 ? void 0 : _l.MQTT_CLIENT_ID) || '',
                    mqttUsername: ((_m = envConfig.parsed) === null || _m === void 0 ? void 0 : _m.MQTT_USERNAME) || '',
                    mqttPassword: ((_o = envConfig.parsed) === null || _o === void 0 ? void 0 : _o.MQTT_PASSWORD) || '',
                    mqttCertFile: ((_p = envConfig.parsed) === null || _p === void 0 ? void 0 : _p.MQTT_CERT_FILE) || '',
                    mqttKeyFile: ((_q = envConfig.parsed) === null || _q === void 0 ? void 0 : _q.MQTT_KEY_FILE) || '',
                    mqttCaFile: ((_r = envConfig.parsed) === null || _r === void 0 ? void 0 : _r.MQTT_CA_FILE) || ''
                };
                // Create the SampleMqttClient instance, this wraps the MQTT.js client
                this.sampleMqttClient = new sampleMqttClient_1.SampleMqttClient();
                // Connect to the MQTT broker using the connection settings from the .env file
                yield this.sampleMqttClient.connect(connectionSettings);
                // Subscribe to the 'sample/+' topic
                yield this.sampleMqttClient.subscribe('sample/+');
                // Publish to the 'sample/topic1' topic
                yield this.sampleMqttClient.publish('sample/topic1', 'Hello World!');
            }
            catch (ex) {
                logger_1.Logger.log([ModuleName, 'error'], `MQTT client sample error: ${ex.message}`);
            }
        });
    }
}
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.Logger.log([ModuleName, 'error'], `SIGINT received: ending the session and exiting the sample...`);
    if (sampleApp) {
        yield sampleApp.stopSample();
    }
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.Logger.log([ModuleName, 'error'], `SIGTERM received: ending the session and exiting the sample...`);
    if (sampleApp) {
        yield sampleApp.stopSample();
    }
}));
void (() => __awaiter(void 0, void 0, void 0, function* () {
    sampleApp = new SampleApp();
    yield sampleApp.startSample();
}))().catch();
//# sourceMappingURL=index.js.map