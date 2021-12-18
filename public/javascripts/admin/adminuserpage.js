class UserEdit extends Component
{
    constructor(id, aftersubmit)
    {
        super();
        this.editor = document.createElement('div');
        let thisclass = this;
        this.editor.createElement('label').createElement('i18nstr').innerText = 'uid';
        this.uidinput = this.editor.createElement('input');

        this.editor.createElement('label').createElement('i18nstr').innerText = 'password';
        this.passwordinput = this.editor.createElement('input');
        this.passwordinput.type = 'password';

        this.editor.createElement('label').createElement('i18nstr').innerText = 'nickname';
        this.nicknameinput = this.editor.createElement('input');

        this.idinput;
        if(id)
        {
            this.idinput = this.editor.createElement('input');
            this.idinput.style.display = 'none';
            this.idinput.value = id;
        }

        let rolelabel = this.editor.createElement('label');
        rolelabel.innerHTML = "<i18nstr>role</i18nstr>";
        var rolebutton = this.editor.createElement('button');
        this.rolespan = this.editor.createElement('span');
        this.role = this.editor.createElement('input');
        this.role.style.display = 'none';
        this.role.result = [];
        rolebutton.onclick = function()
        {
            document.modalwindow2.setContent(new RoleSelector(thisclass.role, ()=>
            {
                thisclass.rolespan.innerHTML = thisclass.role.result.length;
                document.modalwindow2.turnOffDisplay();
            }).selector, false);
            document.modalwindow2.turnOnDisplay();
        }
        rolebutton.innerHTML = "<i18nstr>roleselect</i18nstr>";

        this.submitbutton = this.editor.createElement('button');
        this.submitbutton.innerHTML = '<i18nstr>submit</i18nstr>';
        this.submitbutton.onclick = async function()
        {
            let rids = []
            for(let i of thisclass.role.result)
            {
                rids.push(i.id);
            }
            let obj = {rgroup: 'admin', request: 'editUser', roleid: rids[0]};
            obj.uid = thisclass.uidinput.value;
            thisclass.passwordinput.value.length > 0 ? obj.password = thisclass.passwordinput.value : null;
            obj.nickname = thisclass.nicknameinput.value;
            if(thisclass.unrole)
            {
                let urids = []
                for(let i of thisclass.unrole.result)
                {
                    urids.push(i.id);
                }
                obj.unroleid = urids;
            }
            thisclass.idinput ? obj.id = thisclass.idinput.value : undefined;

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

        if(id)
        {
            this.asyncconstructor(id);
        }
    }

    async asyncconstructor(id)
    {
        let result = (await window[windowid].socket.ioreq.Request("request", {rgroup: "admin", request: 'getUserAdmin', id: id}))[0];
        this.uidinput.value = result.uid;
        this.nicknameinput.value = result.nickname;
    }
}

class AdminUserLister extends Lister
{
    constructor(onindexclick, maxLine=50)
    {
        super(()=>{
            onindexclick ? onindexclick() : this.refresh();
        }, maxLine=50);
    }

    setData(data, index, count)
    {
        super.setData(data, index, count);
        this.listTable.tHead.createElement('th').createElement('i18nstr').innerText = 'id';
        this.listTable.tHead.createElement('th').createElement('i18nstr').innerText = 'uid';
        this.listTable.tHead.createElement('th').createElement('i18nstr').innerText = 'nickname';
        let thisclass = this;
        for(let i of data)
        {
            let tr = this.list.createElement('tr');
            tr.createElement('td').innerHTML = i.id;
            tr.createElement('td').innerHTML = i.uid;
            tr.createElement('td').innerHTML = i.nickname;
            tr.value = i.id;
            tr.ondblclick = ()=>{
                document.modalwindow1.setContent(new UserEdit(tr.value,()=>
                {
                    document.modalwindow1.turnOffDisplay();
                    thisclass.refresh();
                }).editor, false)
                document.modalwindow1.turnOnDisplay();
            };

            tr.onclick = ()=>{
                if(tr.classList.contains('selectedlist'))
                    tr.classList.remove('selectedlist');
                else
                    tr.classList.add('selectedlist');
            }
        }
    }

    async refresh(index, amount)
    {
        amount ? this.maxLine = amount : undefined;
        let users = await getUsersAdmin(index, amount);
        await this.setData(users, index, amount);
    }
}

class AdminUserPageComponent extends Component
{
    constructor()
    {
        super()
        this.page = document.createElement('div');
        this.amount = 50;
        this.index = 1;
        this.userlister = new AdminUserLister();
        this.page.appendChild(this.userlister.lister);

        var selectaction = this.page.createElement('select');
        var deleteoption = selectaction.createElement('option');
        deleteoption.innerHTML = "<i18nstr>DeleteUser</i18nstr>";
        deleteoption.value = 'delete';
        var actionbutton = this.page.createElement('button');
        actionbutton.innerHTML = '<i18nstr>adminuseraction</i18nstr>'
        let thisclass = this;
        actionbutton.onclick = async () => {
            var nodes = thisclass.userlister.lister.querySelectorAll('tr.selectedlist');
            var selected = [];
            nodes.forEach((i)=>{
                console.log(i.value)
                selected.push(i.value)
            });
            await window[windowid].socket.ioreq.Request("request", {rgroup: "admin", request: 'adminUserAction', id: selected, action: selectaction.options[selectaction.selectedIndex].value});
            await thisclass.userlister.refresh();
        };
        

        var newuserbutton = this.page.createElement('button');
        newuserbutton.classList.add('newuserbutton');
        newuserbutton.innerHTML = "<i18nstr>NewUser</i18nstr>";
        newuserbutton.onclick = function()
        {
            document.modalwindow1.setContent(new UserEdit(undefined, ()=> {
                document.modalwindow1.turnOffDisplay();
                thisclass.userlister.refresh();
            }).editor, false);
            document.modalwindow1.turnOnDisplay();
        }
    }

    async replaceTarget(target)
    {
        await this.refresh();
        target.replaceWith(this.page);
    }

    async refresh()
    {
       this.userlister.refresh(this.index, this.amount)
    }
}

async function ReplaceWithAdminUserPageComponent()
{
    var candidates = document.getElementsByTagName('AdminUserPage');
    for(var n of candidates)
    {
        var usercomponent = new AdminUserPageComponent();
        await usercomponent.refresh();
        usercomponent.replaceTarget(n);
    }
}