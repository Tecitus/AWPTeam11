async function getLoginCaptcha()
{
    var result = await window[windowid].socket.ioreq.Request('request', {rgroup: 'user', request: 'getLoginCaptcha'});
    return result;
}

class HeaderComponent extends Component
{
    constructor()
    {
        super()
    }

    async replaceTarget(target)
    {
        this.rootElement = document.createElement("header");
        this.rootElement.className = "Header";
        this.rootElement.classList.add('backgroundgradient','bordergradient');
        let sitename = this.rootElement.createElement('h2');
        let sitenamea = sitename.createElement('a');
        sitenamea.href = '/';
        sitenamea.createElement('i18nstr').innerText = 'SiteName';
        sitename.style.display = 'inline-block';

        this.langselect = this.rootElement.createElement("select");
        this.langselect.onchange = () => {
            console.log(this.langselect.value);
            Cookies.set('lang', this.langselect.value);
            location.reload();
        };
        this.langselect.classList.add("langselect");
        var langs = window[windowid].i18next.availablelangs;
        console.log(langs)
        for(var lang of langs)
        {
            var opt = this.langselect.createElement("option");
            opt.createElement('i18nstr').innerText = lang;
            opt.value = lang;
        }
        var langindex = langs.findIndex((value, index, obj) => { return value == Cookies.get('lang') ? true : false});
        this.langselect.selectedIndex = langindex;
        var logininfo = await getSelfUserData();
        if(logininfo)
        {
            var headerloggedindiv = this.rootElement.createElement('div', 'headerloggedin');
            headerloggedindiv.createElement('span').innerText = logininfo.nickname;
            if(logininfo.isadmin)
            {
                var headerloggedinadmina = headerloggedindiv.createElement('a');
                headerloggedinadmina.href = '/admin';
                headerloggedinadmina.createElement('i18nstr').innerText = 'gotoadminpage';
            }
            var headerlogout = headerloggedindiv.createElement('a');
            headerlogout.createElement('i18nstr').innerText = 'Logout';
            headerlogout.href = '/logout';
        }
        else
        {
            var headerloginoptionsdiv = this.rootElement.createElement('div', 'headerlogin');
            var headerloginform = headerloginoptionsdiv.createElement('div', 'headerloginform');

            var headerlogininputidlabel = headerloginform.createElement('label', 'headerlogininputidlabel');
            headerlogininputidlabel.for = 'headerloginforminputid';
            headerlogininputidlabel.createElement('i18nstr').innerText = 'headerloginforminputid';
            var headerloginforminputid = headerloginform.createElement('input', 'headerloginforminputid');
            headerloginforminputid.name = 'loginid';
            headerloginforminputid.id = 'headerloginforminputid';

            var headerlogininputpasswodlabel = headerloginform.createElement('label', 'headerloginforminputpassword');
            headerlogininputpasswodlabel.for = 'headerloginforminputpassword';
            headerlogininputpasswodlabel.createElement('i18nstr').innerText = 'headerloginforminputpassword';
            var headerloginforminputpassword = headerloginform.createElement('input', 'headerloginforminputpassword');
            headerloginforminputpassword.type = 'password';
            headerloginforminputpassword.name = 'loginpassword';
            headerloginforminputpassword.id = 'headerloginforminputpassword';
            headerloginform.createElement('br');
            let svg = headerloginform.createElement('span');
            svg.innerHTML = await getLoginCaptcha();
            let refreshcaptchabutton = headerloginform.createElement('button');
            refreshcaptchabutton.createElement('i18nstr').innerText = 'refreshlogincaptcha';
            refreshcaptchabutton.onclick = async () => {
                svg.innerHTML = await getLoginCaptcha();
            }
            headerloginform.createElement('br');
            let headerloginforminputcaptcha = headerloginform.createElement('input', 'headerloginforminputcaptcha');
            headerloginform.createElement('br');
            var headerloginforminputsubmit = headerloginform.createElement('button', 'headerloginforminputsubmit');
            headerloginforminputsubmit.onclick = async () => 
            {
                await signIn(headerloginforminputid.value, headerloginforminputpassword.value, headerloginforminputcaptcha.value);
            };
            headerloginforminputsubmit.createElement('i18nstr').innerText = "login"

            var headerloginforminputregister = headerloginoptionsdiv.createElement('button', 'headerloginforminputregister');
            headerloginforminputregister.innerHTML = '<i18nstr>register</i18nstr>';
            headerloginforminputregister.onclick = () => {
                document.modalwindow2.setContent(new RegisterComponent('false').rootElement, false);
                document.modalwindow2.turnOnDisplay();
            };
        }
        target.replaceWith(this.rootElement);
    }

}

async function ReplaceWithHeaderComponent()
{
    var targets = document.getElementsByTagName('headerComponent');

    for(var n of targets)
    {
        var nh = new HeaderComponent();
        nh.replaceTarget(n)
    }
}

document.onloadevents.push(ReplaceWithHeaderComponent);