class RegisterComponent extends Component
{
    constructor(isoauth)
    {
        super();
        this.rootElement = document.createElement('div');
        isoauth = isoauth == 'false' ? false : true;
        this.rootElement.className = "registerComponent";
        if(!isoauth)
        {
            var label = this.rootElement.createElement('label');
            this.id = this.rootElement.createElement('input');
            this.id.label = label;
            this.id.label.innerHTML = "<i18nstr>id</i18nstr>"
            this.rootElement.createElement('br');
            label = this.rootElement.createElement('label');
            this.password = this.rootElement.createElement('input');
            this.password.label = label;
            this.password.label.innerHTML = "<i18nstr>password</i18nstr>"
            //this.rootElement.createElement('br');
            //label = this.rootElement.createElement('label');
            /*this.email = this.rootElement.createElement('input');
            this.email.label = label;
            this.email.label.innerHTML = "<i18nstr>email</i18nstr>"*/
            this.rootElement.createElement('br');
        }
        else
        {
            this.gid = this.rootElement.createElement('input');
            this.gid.setAttribute('style', 'display:none;');
        }
        label = this.rootElement.createElement('label');
        this.nickname = this.rootElement.createElement('input');
        this.nickname.label = label;
        this.nickname.label.innerHTML = "<i18nstr>nickname</i18nstr>"
        this.rootElement.createElement('br');
        this.submit = this.rootElement.createElement('button');
        this.submit.innerHTML = "<i18nstr>registersubmit</i18nstr>"
        if(!isoauth)
        {
            this.password.setAttribute('type', 'password');
            //this.email.setAttribute('type','email');
        }

        if(!isoauth)
        {
            this.id.label.htmlFor = 'registerid';
            this.password.label.htmlFor = 'registerpassword';
            //this.email.label.htmlFor = 'registeremail';
        }
        this.nickname.label.htmlFor = 'register  nickname';

        if(!isoauth)
        {
            this.id.id = 'registerid';
            this.id.name = 'registerid';
            this.password.id = 'registerpassword';
            this.password.name = 'registerpassword'
            //this.email.id = 'registeremail';
            //this.email.name = 'registeremail'
        }
        else
        {
            this.gid.id = 'registergidid';
            this.gid.name = 'registergidname';
            this.gid.value = gidc;
        }
        this.nickname.id = 'registernickname';
        this.nickname.name = 'registernickname';
        this.submit.id = 'registersubmit';
        this.submit.name = 'registersubmit';

        this.submit.onclick = async () => {
            var data = {
                uid: this.id.value,
                password: this.password.value,
               // email: this.email.value,
                gid: this.gid
                    ? this.gid.value
                    : undefined,
                nickname: this.nickname.value
                    ? this.nickname.value
                    : undefined,   
                rgroup: 'user', 
                request: "register"
            };
            var result = await window[windowid].socket.ioreq.Request(
                "request",
                data
            );
            if (result.result) {
                location.reload();
            } 
            else {
                alert(result.err);
            }
        }
    }
}


function ReplaceWithRegisterComponent()
{
    var targets = document.getElementsByTagName('register');
    for(var t of targets)
    {
        t.replaceWith(new Register(t.getAttribute('isoauth')).register);
    }
}

document.onloadevents.push(ReplaceWithRegisterComponent);