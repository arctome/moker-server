import { handleEvent } from "flareact";
import Koaw, { KoawRouter, Transformer, cors } from "koaw-js";
import UserVerify from './server/controllers/user-verify'
import UserSession from "./server/session/user";
import { getCookie } from "./server/utils/utils";

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = true;

addEventListener("fetch", (event) => {
  try {
    const app = new Koaw(event, { debug: true });
    // const router = new KoawRouter();
    app.use(cors({
      allowedHeaders: ["Content-Type", "auth_token"]
    }));
    app.use(async ctx => {
      if (ctx.req.url.pathname.startsWith('/admin') && ctx.req.url.pathname !== '/login') {
        let checkResult = await UserVerify(event);
        if (!checkResult.ok) {
          ctx.res.status = 302;
          ctx.res.headers["Location"] = '/login'
          ctx.res.headers["Set-Cookie"] = checkResult.cookie
          ctx.end()
        }
      }
      if (ctx.req.url.pathname === '/login') {
        let session = getCookie(ctx.req.headers.cookie, MOKER_VARS_SESS_KEY)
        if (!session) return;
        let checkSession = await UserSession.Verify(session);
        if (!checkSession) return;
        ctx.res.status = 302;
        ctx.res.headers["Location"] = '/admin'
        ctx.end()
      }
    })
    // app.use(router.route());
    // flareact renderer
    app.use(async (ctx) => {
      let response = await handleEvent(event, require.context("./pages/", true, /\.(js|jsx|ts|tsx)$/), DEBUG)
      if (response) {
        ctx.res = await Transformer.responseToCtx(response).catch(e => {
          throw e;
        });
        ctx.end();
      }
    })
    event.respondWith(app.run());
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        })
      );
    }
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});
