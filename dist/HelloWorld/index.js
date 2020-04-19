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
const tedious_1 = require("tedious");
const ConnectionPool = require("./tedious-connection-pool");
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        const pool = null;
        const config = {
            server: "msreadyasctranssql1.database.windows.net",
            options: {
                database: "usersdb",
                encrypt: true,
            },
            authentication: {
                type: "default",
                options: {
                    userName: "translationsuser",
                    password: "Password@123"
                }
            }
        };
        const poolConfig = {
            min: 2,
            max: 10,
            log: true,
            acquireTimeout: 60000,
            idleTimeout: 60000
        };
        this.pool = new ConnectionPool(poolConfig, config);
        this.pool.on('err', (err) => console.log('Error: ', err));
        this.pool.acquire(function (err, connection) {
            if (err) {
                console.error(err);
                return;
            }
            var request = new tedious_1.Request("select * from [dbo].[users]", function (err, rowCount) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(rowCount + ' rows');
                }
                connection.release();
            });
            request.on('row', function (columns) {
                columns.forEach(function (column) {
                    console.log(column.value);
                });
            });
            connection.execSql(request);
        });
        context.res = {
            status: 200,
            body: "success"
        };
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map