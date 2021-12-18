module.exports = function(app)
{
    app.socketfunctions.core.getAvailableLanguageList = async (socket ,msg, trx) => {
        msg.result = Object.keys(app.langdata);
        await app.socketio.ioreq.Response(msg);
    }
}