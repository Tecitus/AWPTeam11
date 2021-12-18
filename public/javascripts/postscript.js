async function afterLoad()
{
    await DetectLanguage();
    for(var f of document.onloadevents)
    {
        await f();
    }
}
afterLoad();