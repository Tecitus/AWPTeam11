class Lister extends Component
{
    constructor(onindexclick, maxLine=50)
    {
        super();
        this.lister = document.createElement('div');
        this.onindexclick = onindexclick;
        this.listTable = this.lister.createElement('table');
        this.listTable.createTHead();
        this.list = this.listTable.createElement('tbody');
        let thisclass = this;
        this.maxLine = maxLine;
        this.indexes = this.lister.createElement('div');
    }

    setData(data, index, count)
    {
        this.list.innerHTML = "";
        this.listTable.tHead.innerHTML = "";
        let maxindex = Math.floor(count / this.maxLine) + 1;
        let range = 2;
        for(let i = range; i >= -range; i--)
        {
            if(index - i > 0 && index - i < maxindex)
            {
                let ind = this.indexes.createElement('a');
                ind.innerHTML = index - i;
                ind.value = index - i;
                ind.onclick = this.onindexclick;
            }
        }
    }
}