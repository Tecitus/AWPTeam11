class AdminMainPageComponent extends Component {
    constructor()
    {
        super()
    }

    async replaceTarget(target)
    {
        this.rootElement = document.createElement('div');
        target.replaceWith(this.rootElement);
    }
}

function ReplaceWithAdminMainPage()
{
    var candidates = document.getElementsByTagName('AdminMainPage');
    for(var c of candidates)
    {
        await (new AdminMainPageComponent()).replaceTarget(c);
    }
}