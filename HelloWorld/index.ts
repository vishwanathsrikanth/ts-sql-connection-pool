import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Connection, Request, ConnectionConfig } from "tedious"
import ConnectionPool = require('./tedious-connection-pool');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    context.log('HTTP trigger function processed a request.');
    const pool: any = null;
    const config: ConnectionConfig = {
        server: "msreadyasctranssql1.database.windows.net",
        options: {
            database: "usersdb",
            encrypt: true,
        },
        authentication: {
            type: "default",
            options: {
                userName: "translationsuser",
                password: "{{password-here}}"
            }
        }
    };

    const poolConfig = {
        min: 2,
        max: 10,
        log: true,
        acquireTimeout: 15000,
        idleTimeout: 15000
    }

    this.pool = new ConnectionPool(poolConfig, config);

    this.pool.on('err', (err) => console.log('Error: ', err));

    this.pool.acquire(function (err, connection) {

        if (err) {
            console.error(err);
            return;
        }

        var request = new Request("select * from [dbo].[users]", function (err, rowCount) {
            if (err) {
                console.log(err);
            } else {
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
};

export default httpTrigger;
