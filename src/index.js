const Koa = require("koa");
const mount = require("koa-mount");
const URL = require("url");
const querystring = require("querystring");
const responseTemplate = require("./util/responseTemplate");
const listData = require("./json/list.json");

const app = new Koa();

app.use(
    mount("/favicon.ico", (ctx) => {
        ctx.status = 200;
    })
);
app.use(
    mount("/api", (ctx) => {
        const request = ctx.request;
        const response = ctx.response;

        const url = URL.parse(request.url);
        const pathname = url.pathname;

        if (pathname === "/list") {
            responseTemplate.success.data = listData;
            response.body = responseTemplate.success;
        } else if (pathname === "/detail") {
            const query = querystring.parse(url.query);
            console.log("query:", query);
            if (query && query.id) {
                const list = require("./json/list.json");

                let detail = null;
                for (let index = 0; index < listData.length; index++) {
                    const item = listData[index];

                    if (Number(query.id) === item["id"]) {
                        detail = item;
                        break;
                    }
                }
                if (detail) {
                    responseTemplate.success.data = detail;
                    response.body = responseTemplate.success;
                } else {
                    responseTemplate.success.data = "暂无数据";
                    response.body = responseTemplate.success;
                }
            } else {
                response.body = responseTemplate.fail;
            }
        }
    })
);

app.listen(80);
