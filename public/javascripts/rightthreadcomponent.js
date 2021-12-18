class RightThreadMenuComponent extends Component
{
    constructor(latitude, longitude)
    {
        super()
        this.latitude = latitude;
        this.longitude = longitude;
    }

    async replaceTarget(target)
    {
        this.rootElement = document.createElement("div");
        this.rootElement.className = "RightThreadMenu";
        this.rootElement.classList.add('backgroundgradient','bordergradient');
        this.rootElement.component = this;
        this.data = await window[windowid].socket.ioreq.Request('request', {rgroup: 'thread', request: 'getThreadsFromGeolocation', latitude: this.latitude, longitude: this.longitude});
        this.threadsdiv = this.rootElement.createElement("div");
        this.threadsdiv.className = "Threadsdiv";
        for(let i of this.data)
        {
            let thread = new ThreadComponent(i).rootElement;
            this.threadsdiv.appendChild(thread);
        }
        if(window[windowid].user)
        {
            this.makethreadbutton = this.rootElement.createElement("button");
            this.makethreadbutton.innerHTML = "<i18nstr>makenewthread</i18nstr>";
            let thisclass = this;
            this.makethreadbutton.onclick = () => {
                document.modalwindow1.setContent(new NewThreadComponent(this.latitude, this.longitude, () => thisclass.refresh()).rootElement, false);
                document.modalwindow1.turnOnDisplay();
            };
            if(window[windowid].user.isadmin)
            {
                let deletelocationbutton = this.rootElement.createElement("button");
                deletelocationbutton.innerHTML = "<i18nstr>deletelocation</i18nstr>";
                deletelocationbutton.onclick = async () => {
                    await window[windowid].socket.ioreq.Request('request', {rgroup: 'admin', request: 'adminDeleteGeolocation', latitude: this.latitude, longitude: this.longitude});
                    thisclass.rootElement.innerHTML = "";
                };
            }
        }
        target.replaceWith(this.rootElement);
    }

    async refresh()
    {
        let data = await window[windowid].socket.ioreq.Request('request', {rgroup: 'thread', request: 'getThreadsFromGeolocation', latitude: this.latitude, longitude: this.longitude});
        for(let i of data)
        {
            if(!_.some(this.data, (d) => {
                if(d.id == i.id)
                    return true;
                else
                    return false;
            }))
            {
                this.data.push(i);
                let thread = new ThreadComponent(i).rootElement;
                this.threadsdiv.appendChild(thread);
            }
        }
    }

    async fullrefresh()
    {
        this.threadsdiv.innerHTML = "";
        this.data = await window[windowid].socket.ioreq.Request('request', {rgroup: 'thread', request: 'getThreadsFromGeolocation', latitude: this.latitude, longitude: this.longitude});
        for(let i of this.data)
        {
            let thread = new ThreadComponent(i).rootElement;
            this.threadsdiv.appendChild(thread);
        }
    }
}