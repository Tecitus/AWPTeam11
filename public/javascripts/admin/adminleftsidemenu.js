class AdminSidebarComponent extends Component {
    constructor(){
        super()
    }

    async replaceTarget(target)
    {
        var sidebar = document.createElement('div');
        this.rootElement = sidebar;
        sidebar.className = 'adminleftsidemenu';
        
        //Main
        var maindiv = document.createElement('div');
        var maina = document.createElement('a');
        var maini18nstr = document.createElement('i18nstr');
        maini18nstr.innerText = 'SidebarMain';
        maina.appendChild(maini18nstr);
        maina.onclick = async (ev) => {
            let amp = clearContentDiv().createElement('AdminMainPage');
            await (new AdminMainPageComponent()).replaceTarget(amp);
        };
        maindiv.appendChild(maina);
        sidebar.appendChild(maindiv);

        //Role
        var rolediv = document.createElement('div');
        var rolea = document.createElement('a');
        var rolei18nstr = document.createElement('i18nstr');
        rolei18nstr.innerText = 'SidebarRole';
        rolea.appendChild(rolei18nstr);
        rolea.onclick = async (ev) => {
            let arp = clearContentDiv().createElement('AdminRolePage');
            await (new AdminRolePageComponent()).replaceTarget(arp);
        };
        rolediv.appendChild(rolea);
        sidebar.appendChild(rolediv);

        //User
        var userdiv = document.createElement('div');
        var usera = document.createElement('a');
        var useri18nstr = document.createElement('i18nstr');
        useri18nstr.innerText = 'SidebarUser';
        usera.appendChild(useri18nstr);
        usera.onclick = async (ev) => {
            let aup = clearContentDiv().createElement('AdminUserPage');
            await (new AdminUserPageComponent()).replaceTarget(aup);
        };
        userdiv.appendChild(usera);
        sidebar.appendChild(userdiv);

        target.replaceWith(this.rootElement);
    }
}

async function ReplaceWithSidebarMenuAdmin()
{
    var target = document.getElementsByClassName('adminleftsidemenu')[0];
    await (new AdminSidebarComponent()).replaceTarget(target);
}
