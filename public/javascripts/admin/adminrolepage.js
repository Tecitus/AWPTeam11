class NewRole extends Component
{
    constructor(aftersubmit)
    {
        super();
        this.newrole = document.createElement('div');

        var newrolenamelabel = this.newrole.createElement('label');
        newrolenamelabel.innerHTML = "<i18nstr>newrolename</i18nstr>";
        this.newrolename = this.newrole.createElement('input');

        (this.addadmincheckboxlabel = this.newrole.createElement('label')).createElement('i18nstr').innerText = 'isadmin';
        this.addadmincheckbox = this.newrole.createElement('input');
        this.addadmincheckbox.type = 'checkbox';

        this.adminpermissiontable = this.newrole.createElement('table');
        this.adminpermissiontable.style.display = 'none';
        this.adminpermissiontable.createTHead();
        this.adminpermissiontable.tHead.createElement('th').createElement('i18nstr').innerText = 'admingrantadmin';
        this.adminpermissiontable.tHead.createElement('th').createElement('i18nstr').innerText = 'admineditrole';
        this.adminpermissiontable.tHead.createElement('th').createElement('i18nstr').innerText = 'adminuseredit';
        this.adminpermissiontable.tHead.createElement('th').createElement('i18nstr').innerText = 'adminallowregister';
        this.adminpermissiontable.tHead.createElement('th').createElement('i18nstr').innerText = 'adminchangesettings';
        this.adminpermissiontable.tHead.createElement('th').createElement('i18nstr').innerText = 'admineditthread';
        this.adminpermissiontable.createElement('tbody');
        let tr = this.adminpermissiontable.tBodies[0].createElement('tr');
        (this.grantadmininput = tr.createElement('td').createElement('input')).type = 'checkbox';
        (this.editroleinput = tr.createElement('td').createElement('input')).type = 'checkbox';
        (this.usereditinput = tr.createElement('td').createElement('input')).type = 'checkbox';
        (this.allowregisterinput = tr.createElement('td').createElement('input')).type = 'checkbox';
        (this.changesettingsinput = tr.createElement('td').createElement('input')).type = 'checkbox';
        (this.editthreadinput = tr.createElement('td').createElement('input')).type = 'checkbox';
        let thisclass = this;
        this.addadmincheckbox.onchange = function()
        {
            if(thisclass.addadmincheckbox.checked)
            {
                thisclass.adminpermissiontable.style.display = 'table';
            }
            else
            {
                thisclass.adminpermissiontable.style.display = 'none';
            }
        }
        var newroleuserlabel = this.newrole.createElement('label');
        newroleuserlabel.innerHTML = "<i18nstr>newroleuser</i18nstr>";
        var newroleuserbutton = this.newrole.createElement('button');
        this.newroleuserspan = this.newrole.createElement('span');
        this.newroleuser = this.newrole.createElement('input');
        this.newroleuser.style.display = 'none';
        this.newroleuser.result = [];
        newroleuserbutton.onclick = function()
        {
            document.modalwindow2.setContent(new UserSelector(thisclass.newroleuser, ()=>
            {
                thisclass.newroleuserspan.innerHTML = thisclass.newroleuser.result.length + '<i18nstr>person</i18nstr>'
                document.modalwindow2.turnOffDisplay();
            }).selector, false);
            document.modalwindow2.turnOnDisplay();
        }
        newroleuserbutton.innerHTML = "<i18nstr>select</i18nstr>";

        this.newrolesubmitbutton = this.newrole.createElement('button');
        this.newrolesubmitbutton.innerHTML = '<i18nstr>submit</i18nstr>'
        this.newrolesubmitbutton.onclick = async function()
        {
            let ids = []
            for(let i of thisclass.newroleuser.result)
            {
                ids.push(i.id);
            }
            let obj = {rgroup: 'admin', request: 'newRole', name: thisclass.newrolename.value, userid: ids};
            if(thisclass.addadmincheckbox.checked)
            {
                obj.isadmin = true;
                obj.grantadmin = thisclass.grantadmininput.checked;
                obj.editrole = thisclass.editroleinput.checked;
                obj.useredit = thisclass.usereditinput.checked;
                obj.allowregister = thisclass.allowregisterinput.checked;
                obj.changesettings = thisclass.changesettingsinput.checked;
                obj.editthread = thisclass.editthreadinput.checked;
            }
            var result = await window[windowid].socket.ioreq.Request("request", obj);
            if(result instanceof Object)
            {
                prompt(result.err);
            }
            else
            {
                if(aftersubmit)
                    aftersubmit();
            }
        }
    }
}

class AdminRolePageComponent extends Component
{
    constructor()
    {
        super();
        this.page = document.createElement('div');
        this.page.className = 'adminrolepage';
        this.rolelist = this.page.createElement('table');

        var rolelisthead = this.rolelist.createElement('thead');
        var checkbox = rolelisthead.createElement('th');
        checkbox.innerHTML = "<i18nstr>RoleChecked</i18nstr>";
        var roleid = rolelisthead.createElement('th');
        roleid.innerHTML = "<i18nstr>RoleId</i18nstr>";
        var rolename = rolelisthead.createElement('th');
        rolename.innerHTML = "<i18nstr>RoleName</i18nstr>";
        var rolecount = rolelisthead.createElement('th');
        rolecount.innerHTML = "<i18nstr>UserCount</i18nstr>";


        var rolelistbody = this.rolelist.createElement('tbody','AdminRolePageTBody');

        var selectaction = this.page.createElement('select');
        var deleteoption = selectaction.createElement('option');
        deleteoption.innerHTML = "<i18nstr>DeleteRole</i18nstr>";
        deleteoption.value = 'delete';
        var actionbutton = this.page.createElement('button');
        actionbutton.innerHTML = '<i18nstr>adminroleaction</i18nstr>'
        let thisclass = this;
        actionbutton.onclick = async () => {
            var nodes = thisclass.rolelist.querySelectorAll('input.adminselectedrole');
            var selected = [];
            nodes.forEach((i)=>{
                selected.push(i.value)
            });
            await window[windowid].socket.ioreq.Request("request", {rgroup: "admin", request: 'adminRoleAction', id: selected, action: selectaction.options[selectaction.selectedIndex].value});
            await thisclass.refresh();
        };

        var newrolebutton = this.page.createElement('button');
        newrolebutton.classList.add('newrolebutton');
        newrolebutton.innerHTML = "<i18nstr>NewRole</i18nstr>";
        newrolebutton.onclick = function()
        {
            document.modalwindow1.setContent(new NewRole(()=> {
                document.modalwindow1.turnOffDisplay();
                thisclass.refresh();
            }).newrole, false);
            document.modalwindow1.turnOnDisplay();
        }

        let assignrolebutton = this.page.createElement('button');
        assignrolebutton.classList.add('assignrolebutton');
        assignrolebutton.innerHTML = "<i18nstr>AssignRole</i18nstr>";
        assignrolebutton.result = []
        assignrolebutton.onclick = function()
        {
            document.modalwindow2.setContent(new UserSelector(assignrolebutton, async ()=>
            {
                var nodes = thisclass.rolelist.querySelectorAll('input.adminselectedrole');
                var selected = [];
                nodes.forEach((i)=>{
                    selected.push(i.value)
                });
                var ids = [];
                for(var i of assignrolebutton.result)
                {
                    ids.push(i.id);
                }
                await window[windowid].socket.ioreq.Request("request", {rgroup: "admin", request: 'adminRoleAssign', id: selected, userid: ids})
                await thisclass.refresh();
                document.modalwindow2.turnOffDisplay();
            }).selector, false);
            document.modalwindow2.turnOnDisplay();
        }
    }

    async replaceTarget(target)
    {
        await this.refresh();
        target.replaceWith(this.page);
    }

    async refresh()
    {
        var roles = await getRolesAdmin();
        this.rolelist.tBodies[0].innerHTML = "";
        for(var r of roles)
        {
            var tr = this.rolelist.tBodies[0].createElement('tr');

            let checkboxtd = tr.createElement('td');
            let checkbox = checkboxtd.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = r.id;
            checkbox.onchange = function()
            {
                if(checkbox.checked)
                {
                    checkbox.classList.add('adminselectedrole');
                }
                else
                {
                    checkbox.classList.remove('adminselectedrole');
                }
            }

            tr.createElement('td').innerText = r.id;
            tr.createElement('td').innerText = r.name;
            tr.createElement('td').innerText = r.usercount[0].count;
        }
    }
}

async function ReplaceWithAdminRolePageComponent()
{
    var candidates = document.getElementsByTagName('AdminRolePage');
    for(var n of candidates)
    {
        var rolecomponent = new AdminRolePageComponent();
        await rolecomponent.refresh();
        rolecomponent.replaceWith(n);
    }
}