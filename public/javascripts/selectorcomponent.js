class Selector
{
    constructor(receiver, aftersubmit)
    {
        this.selector = document.createElement('div');
        this.candidatetable = this.selector.createElement('table');
        this.candidatetable.createTHead();
        this.candidatelist = this.candidatetable.createElement('tbody');
        this.submitbutton = this.selector.createElement('button');
        this.submitbutton.innerHTML = '<i18nstr>selectorsubmit</i18nstr>'
        let thisclass = this;
        this.submitbutton.onclick = function()
        {
            let selected = thisclass.candidatelist.querySelectorAll('tr.selectorselected');
            let list = [];
            selected.forEach(function(item){
                list.push(item.value);
            })
            receiver.result = list;
            if(aftersubmit)
            {
                aftersubmit();
            }
        }
    }
}

class UserSelector extends Selector
{
    constructor(receiver, aftersubmit)
    {
        super(receiver, aftersubmit);
        let searcherlabel = this.selector.createElement('label');
        searcherlabel.innerHTML = '<i18nstr>selectorsearch</i18nstr>';
        let searcherselector = this.selector.createElement('select');
        let option = searcherselector.createElement('option');
        option.value = 'id';
        option.innerHTML = '<i18nstr>userid</i18nstr>';
        option = searcherselector.createElement('option');
        option.value = 'uid';
        option.innerHTML = '<i18nstr>useruid</i18nstr>';
        option = searcherselector.createElement('option');
        option.value = 'nickname';
        option.innerHTML = '<i18nstr>usernickname</i18nstr>';
        searcherselector.selectedIndex = 0;
        this.searcher = this.selector.createElement('input');
        let thisclass = this;
        this.searcher.addEventListener('keyup',async function()
        {
            if(thisclass.searcher.value == thisclass.searcher.pvalue)
                return;
            else
            {
                thisclass.searcher.pvalue = thisclass.searcher.value;
            }
            let result = await window[windowid].socket.ioreq.Request('request',{rgroup: 'user', request: 'getUsers', category: searcherselector.options[searcherselector.selectedIndex].value, value: thisclass.searcher.value});
            thisclass.candidatelist.innerHTML = "";

            for(var i of result)
            {
                let tr = thisclass.candidatelist.createElement('tr');
                tr.createElement('td').innerText = i.id;
                tr.createElement('td').innerText = i.uid;
                tr.createElement('td').innerText = i.nickname;
                tr.value = {id: i.id, uid: i.uid, nickname: i.nickname};

                tr.onclick = function(){
                    if(tr.classList.contains('selectorselected'))
                    {
                        tr.classList.remove('selectorselected');
                    }
                    else
                    {
                        tr.classList.add('selectorselected');
                    }
                }
            }
        });
        this.candidatetable.tHead.createElement('th').innerHTML = '<i18nstr>userid</i18nstr>';
        this.candidatetable.tHead.createElement('th').innerHTML = '<i18nstr>useruid</i18nstr>';
        this.candidatetable.tHead.createElement('th').innerHTML = '<i18nstr>usernickname</i18nstr>';
    }
}

class RoleSelector extends Selector
{
    constructor(receiver, aftersubmit)
    {
        super(receiver, aftersubmit);
        let searcherlabel = this.selector.createElement('label');
        searcherlabel.innerHTML = '<i18nstr>selectorsearch</i18nstr>';
        let searcherselector = this.selector.createElement('select');
        let option = searcherselector.createElement('option');
        option.value = 'id';
        option.innerHTML = '<i18nstr>roleid</i18nstr>';
        option = searcherselector.createElement('option');
        option.value = 'name';
        option.innerHTML = '<i18nstr>rolename</i18nstr>';
        searcherselector.selectedIndex = 0;
        this.searcher = this.selector.createElement('input');
        let thisclass = this;
        this.searcher.addEventListener('keyup',async function()
        {
            if(thisclass.searcher.value == thisclass.searcher.pvalue)
                return;
            else
            {
                thisclass.searcher.pvalue = thisclass.searcher.value;
            }
            let result = await window[windowid].socket.ioreq.Request('request',{rgroup: 'user', request: 'getRoles', category: searcherselector.options[searcherselector.selectedIndex].value, value: thisclass.searcher.value});
            thisclass.candidatelist.innerHTML = "";

            for(var i of result)
            {
                let tr = thisclass.candidatelist.createElement('tr');
                tr.createElement('td').innerText = i.id;
                tr.createElement('td').innerText = i.name;
                tr.value = {id: i.id, name: i.name};

                tr.onclick = function(){
                    if(tr.classList.contains('selectorselected'))
                    {
                        tr.classList.remove('selectorselected');
                    }
                    else
                    {
                        tr.classList.add('selectorselected');
                    }
                }
            }
        });
        this.candidatetable.tHead.createElement('th').innerHTML = '<i18nstr>roleid</i18nstr>';
        this.candidatetable.tHead.createElement('th').innerHTML = '<i18nstr>rolename</i18nstr>';
    }

    
}