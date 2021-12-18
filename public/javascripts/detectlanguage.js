async function DetectLanguage()
{
    window[windowid].langinit = false;
    if(!window[windowid].langdata)
        window[windowid].langdata = {};
    var lang = Cookies.get('lang');
    
    if(!Cookies.get('lang'))
    {
        lang = navigator.language;
    }
    document.getElementsByTagName('html')[0].setAttribute('lang', lang);
    var availablelangs = await getAvailableLanguageList();
    if(!availablelangs.includes(lang))
    {
        lang = "ko-KR";
    }
    Cookies.set('lang', lang);
    var res = await fetch('/lang/'+lang);
    res = await res.json();
    window[windowid].langdata[lang] = res;
    i18next.init({
        lng: lang,
        debug: true,
        resources: window[windowid].langdata
    });
    i18next.availablelangs = availablelangs;
    
    window[windowid].i18next = i18next;
        
    let i18nRecursive = function(node)
    {
        if(node.children)
            for(var n of node.children)
            {
                i18nRecursive(n)
            }
        if(node.nodeName == "I18NSTR")
        {
            node.textContent = window[windowid].i18next.t(node.textContent);
        }
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for(var n of mutation.addedNodes)
            {
                i18nRecursive(n);
            }
        });    
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    for(var n of document.getElementsByTagName('i18nstr'))
    {
        n.innerHTML = window[windowid].i18next.t(n.innerHTML);
    }

    var title = document.head.getElementsByTagName('title')[0];
    title.innerHTML = window[windowid].i18next.t(title.innerHTML);

    window[windowid].langinit = true;
}